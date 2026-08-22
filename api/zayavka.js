/**
 * Приём заявок — serverless-функция на Vercel.
 *
 *   браузер --HTTPS--> эта функция --> хранилище (карточка заявки)
 *                                  \-> Telegram (текст, снимки, голосовое)
 *
 * Три вещи, которых не делал прототип:
 *
 * 1. Номер выдаёт сервер. Раньше он жил в sessionStorage и терялся при
 *    смене устройства: клиент называл номер, которого у мастерской никогда
 *    не было.
 * 2. Заявка сохраняется. Telegram — это доставка, а не архив: сообщение
 *    можно удалить, чат — потерять вместе с телефоном.
 * 3. Голосовое и снимки доходят до мастерской, а не остаются на устройстве.
 *
 * Драйвер хранилища выбирается сам по тому, что задано в окружении, —
 * см. storage() ниже. Без единой переменной функция всё равно работает:
 * заявка уйдёт в Telegram, а номер будет выдан по времени. Это честный
 * минимум, а не заглушка.
 */

export const config = { runtime: 'nodejs' };

/* --------------------------------------------------------------- лимиты */

const MAX_PHOTOS = 6;
const MAX_FILE_BYTES = 12 * 1024 * 1024;
const MAX_VOICE_BYTES = 20 * 1024 * 1024;
const MAX_TEXT = 4000;
const MAX_SHORT = 200;

const PHOTO_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/heic',
  'image/heif',
]);

const VOICE_TYPES = new Set([
  'audio/webm',
  'audio/ogg',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'video/webm', // MediaRecorder в Chrome помечает аудио-дорожку так
]);

const EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'audio/webm': 'webm',
  'video/webm': 'webm',
  'audio/ogg': 'ogg',
  'audio/mp4': 'm4a',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
};

/* ---------------------------------------------------------- ограничение */

/**
 * Грубый лимит на адрес: мастерская получает единицы заявок в день, и
 * сотня с одного адреса за час — это не клиент. Память живёт до тех пор,
 * пока жив контейнер функции; для этой задачи достаточно, а ради точного
 * счётчика городить общее хранилище незачем.
 */
const RATE_MAX = 12;
const RATE_WINDOW = 60 * 60 * 1000;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > RATE_MAX;
}

/* ---------------------------------------------------------- вспомогательное */

const clean = (v, max = MAX_TEXT) =>
  String(v ?? '')
    .replace(/\0/g, '')
    .trim()
    .slice(0, max);

const dash = (v) => (v ? v : '—');

/* ------------------------------------------------------------- хранилище */

/**
 * Драйверы, в порядке предпочтения.
 *
 * kv    — Upstash Redis / Vercel KV. Единственный, кто даёт сквозную
 *         нумерацию: INCR атомарен, поэтому два одновременных обращения
 *         не получат один номер.
 * blob  — Vercel Blob. Хранит карточку и файлы, счётчика не имеет.
 * none  — ничего не задано: заявка живёт в Telegram, номер — по времени.
 */
function storage() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) return 'kv';
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'blob';
  return 'none';
}

async function kv(command) {
  const res = await fetch(process.env.KV_REST_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`kv ${res.status}`);
  return (await res.json()).result;
}

/**
 * Номер заявки — 73-XXXX, где 73 код региона.
 *
 * С KV это сквозной счётчик: 73-1001, 73-1002 и так далее. Без него —
 * четыре цифры от времени суток: два обращения в одну и ту же секунду
 * получат один номер, поэтому в карточке всегда лежит ещё и полный id.
 */
async function leadNo() {
  if (storage() === 'kv') {
    try {
      const n = await kv(['INCR', 'zayavka:counter']);
      return `73-${String(1000 + (Number(n) % 9000)).padStart(4, '0')}`;
    } catch {
      /* Счётчик недоступен — падаем на запасной путь ниже. */
    }
  }
  const now = new Date();
  const minutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  return `73-${String(minutes).padStart(4, '0').slice(-4)}`;
}

async function putBlob(path, body, contentType) {
  const res = await fetch(`https://blob.vercel-storage.com/${encodeURIComponent(path)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      'x-api-version': '7',
      'x-content-type': contentType,
      'x-add-random-suffix': '0',
    },
    body,
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`blob ${res.status}`);
  return (await res.json()).url;
}

/** Кладёт карточку заявки и файлы. Ошибка хранилища не теряет заявку. */
async function store(lead, files) {
  const driver = storage();
  if (driver === 'none') return { driver, saved: false };

  try {
    if (driver === 'kv') {
      await kv(['SET', `zayavka:${lead.id}`, JSON.stringify(lead)]);
      await kv(['LPUSH', 'zayavka:list', lead.id]);
      // Файлы в KV не кладём: они уходят в Telegram, а хранить мегабайты
      // в редисе — не то, для чего он нужен.
      return { driver, saved: true };
    }

    const day = lead.at.slice(0, 10);
    const urls = [];
    for (const f of files) {
      urls.push(await putBlob(`zayavki/${day}/${lead.id}/${f.name}`, f.data, f.type));
    }
    lead.files = urls;
    await putBlob(
      `zayavki/${day}/${lead.id}/zayavka.json`,
      JSON.stringify(lead, null, 2),
      'application/json'
    );
    return { driver, saved: true };
  } catch (err) {
    console.error('[store] не удалось сохранить:', err.message);
    return { driver, saved: false };
  }
}

/* --------------------------------------------------------------- Telegram */

const TG_API = (method) => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`;

async function tg(method, body) {
  const isForm = body instanceof FormData;
  const res = await fetch(TG_API(method), {
    method: 'POST',
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
    body: isForm ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${method} ${res.status}`);
  return res.json();
}

/**
 * Отправка в бота.
 *
 * В отличие от эталонной реализации в furniture-site, текст заявки идёт
 * в сообщение целиком. Там это была осознанная защита персональных данных
 * — уведомление без содержания. Здесь наоборот: Telegram и есть рабочее
 * место оператора, ради него всё и делается. Ходить за содержанием
 * в другое место Елене негде.
 */
async function notify(lead, files) {
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!process.env.TELEGRAM_BOT_TOKEN || !chat) return false;

  const text = [
    `Заявка ${lead.no}${lead.topic ? ' · ' + lead.topic : ''}`,
    `Имя: ${dash(lead.name)}`,
    `Связь: ${dash(lead.contact)}`,
    `Задача: ${dash(lead.task)}`,
    '',
    `Канал: ${lead.channel} · страница: ${lead.page}`,
  ].join('\n');

  try {
    await tg('sendMessage', { chat_id: chat, text, disable_web_page_preview: true });

    for (const f of files) {
      const form = new FormData();
      form.set('chat_id', chat);
      const blob = new Blob([f.data], { type: f.type });

      if (f.field === 'voice') {
        form.set('voice', blob, f.name);
        form.set('caption', `Голосовое к заявке ${lead.no}`);
        await tg('sendVoice', form);
      } else {
        // Именно документом, а не фотографией: Telegram сжимает фото,
        // а по сжатой резьбе деталь не опознать.
        form.set('document', blob, f.name);
        form.set('caption', `Снимок к заявке ${lead.no}`);
        await tg('sendDocument', form);
      }
    }
    return true;
  } catch (err) {
    console.error('[telegram] не удалось отправить:', err.message);
    return false;
  }
}

/* ------------------------------------------------------------------ ответ */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

/* ------------------------------------------------------------ обработчик */

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method_not_allowed' }, 405);
  }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return json({ ok: false, error: 'too_many_requests' }, 429);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Ловушка для ботов: поле, которого нет на экране. Заполнено — отвечаем
  // как обычно, чтобы бот не пробовал ещё раз, но никуда не отправляем.
  if (clean(form.get('company'), MAX_SHORT)) {
    return json({ ok: true, no: '73-0000' });
  }

  const name = clean(form.get('name'), 120);
  const contact = clean(form.get('contact'), MAX_SHORT);
  const task = clean(form.get('task'));
  const topic = clean(form.get('topic'), MAX_SHORT);

  // Пустая заявка — не заявка: без связи и без задачи мастерской не с чем
  // работать и некуда отвечать.
  if (!contact && !task) {
    return json({ ok: false, error: 'empty' }, 422);
  }

  /* ---- файлы ---- */

  const files = [];
  let photos = 0;

  for (const field of ['photos', 'voice']) {
    for (const value of form.getAll(field)) {
      if (typeof value === 'string' || !value?.size) continue;

      const type = (value.type || '').split(';')[0].toLowerCase();
      const isVoice = field === 'voice';

      if (isVoice && !VOICE_TYPES.has(type)) continue;
      if (!isVoice && !PHOTO_TYPES.has(type)) continue;
      if (value.size > (isVoice ? MAX_VOICE_BYTES : MAX_FILE_BYTES)) continue;
      if (!isVoice && photos >= MAX_PHOTOS) continue;
      if (!isVoice) photos += 1;

      files.push({
        field,
        // Имя файла от клиента не берётся никогда: оно попадёт в путь
        // хранилища и в подпись в Telegram.
        name: isVoice ? `golos.${EXT[type] || 'bin'}` : `snimok-${photos}.${EXT[type] || 'bin'}`,
        type: isVoice && type === 'video/webm' ? 'audio/webm' : type,
        data: Buffer.from(await value.arrayBuffer()),
      });
    }
  }

  /* ---- заявка ---- */

  const at = new Date().toISOString();
  const no = await leadNo();

  const lead = {
    // Номер — для разговора с клиентом, id — для хранилища: номер может
    // повториться через год, id не повторится никогда.
    no,
    id: `${at.slice(0, 10).replace(/-/g, '')}-${crypto.randomUUID().slice(0, 8)}`,
    at,
    name,
    contact,
    task,
    topic,
    channel: clean(form.get('channel'), 20) || 'unknown',
    page: clean(form.get('page'), 200) || '/',
    photos: files.filter((f) => f.field === 'photos').length,
    voice: files.some((f) => f.field === 'voice'),
    status: 'new',
  };

  const [saved, delivered] = await Promise.all([store(lead, files), notify(lead, files)]);

  console.log(
    `[zayavka] ${lead.no} (${lead.id}) канал=${lead.channel} снимков=${lead.photos}` +
      `${lead.voice ? ' +голос' : ''} хранилище=${saved.driver}/${saved.saved ? 'ok' : 'нет'}` +
      ` telegram=${delivered ? 'ok' : 'нет'}`
  );

  return json({ ok: true, no: lead.no });
}
