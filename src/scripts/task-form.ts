/**
 * Форма заявки.
 *
 * Что изменилось против прототипа: номер заявки выдаёт сервер, а не браузер.
 * Раньше он жил в sessionStorage и терялся при смене устройства — клиент
 * называл номер, которого у мастерской никогда не было. Теперь порядок
 * такой: нажатие на канал → заявка уходит на /api/zayavka вместе со
 * снимками и голосовым → сервер возвращает номер → и уже с этим номером
 * открывается мессенджер.
 *
 * Если эндпоинт не настроен или не ответил, поведение прежнее: номер
 * выдаётся на месте, мессенджер открывается, заявка не теряется. Об этом
 * прямо сказано в подтверждении — обещать доставку, которой не было,
 * нельзя.
 */

type Channel = 'wa' | 'tg' | 'tel' | 'mail';

const WA = 'https://wa.me/79851982945';
const TEL = '+79851982945';

const root = document.getElementById('zayavka');

/** Куда отправлять заявку. Пусто — работаем без сервера. */
const ENDPOINT = root?.dataset.endpoint || '';

/* Почта и адрес Telegram лежат в атрибутах кнопок: их подставляет сборка
   из переменных окружения, и скрипт не должен знать их заранее. */
const MAIL = document.querySelector<HTMLElement>('[data-send="mail"]')?.dataset.mail || '';
const TG = document.querySelector<HTMLElement>('[data-send="tg"]')?.dataset.tg || '';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;

const val = (id: string) => {
  const el = $<HTMLInputElement | HTMLTextAreaElement>(id);
  const v = el?.value.trim();
  return v ? v : '—';
};

/* ------------------------------------------------------------- снимки */

/** Выбранные снимки. Показываются превью, уходят вместе с заявкой. */
const shots: File[] = [];
let voiceBlob: Blob | null = null;

const MAX_FILES = 6;
const MAX_BYTES = 12 * 1024 * 1024;

function renderShots() {
  const box = $<HTMLElement>('shots');
  if (!box) return;
  box.innerHTML = '';
  shots.forEach((file, i) => {
    const item = document.createElement('div');
    item.className = 'shot-item';

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = `Снимок ${i + 1}`;
    img.onload = () => URL.revokeObjectURL(img.src);

    const del = document.createElement('button');
    del.type = 'button';
    del.textContent = '×';
    del.setAttribute('aria-label', `Убрать снимок ${i + 1}`);
    del.onclick = () => {
      shots.splice(i, 1);
      renderShots();
    };

    item.append(img, del);
    box.appendChild(item);
  });
}

function addFiles(list: FileList | null) {
  if (!list) return;
  for (const file of Array.from(list)) {
    if (shots.length >= MAX_FILES) break;
    if (file.size > MAX_BYTES) continue;
    if (!file.type.startsWith('image/')) continue;
    shots.push(file);
  }
  renderShots();
}

const fileInput = $<HTMLInputElement>('f-shots');
fileInput?.addEventListener('change', () => {
  addFiles(fileInput.files);
  fileInput.value = '';
});

/* Перетаскивание на зону: то же действие, что и выбор файла. Уголки
   зоны при этом раздвигаются — «сюда помещается предмет». */
const zone = $<HTMLElement>('shot-zone');
if (zone) {
  const stop = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };
  ['dragenter', 'dragover'].forEach((n) =>
    zone.addEventListener(n, (e) => {
      stop(e);
      zone.classList.add('is-active');
    })
  );
  ['dragleave', 'drop'].forEach((n) =>
    zone.addEventListener(n, (e) => {
      stop(e);
      zone.classList.remove('is-active');
    })
  );
  zone.addEventListener('drop', (e) => addFiles((e as DragEvent).dataTransfer?.files ?? null));
}

/* -------------------------------------------------------------- номер */

/** Номер, выданный сервером в этом сеансе. */
let issued = '';

/** Запасной номер — когда сервера нет. Живёт в сеансе браузера. */
function localNo(): string {
  let n = sessionStorage.getItem('zayavkaNo');
  if (!n) {
    n = '73-' + String(1000 + Math.floor(Math.random() * 9000));
    sessionStorage.setItem('zayavkaNo', n);
  }
  return n;
}

function letter(no: string): string {
  const topic = $<HTMLInputElement>('f-topic')?.value || '';
  return (
    'Заявка ' +
    no +
    (topic ? ' · ' + topic : '') +
    '\nИмя: ' +
    val('f-name') +
    '\nСвязь: ' +
    val('f-contact') +
    '\nЗадача: ' +
    val('f-task')
  );
}

/* ------------------------------------------------------------ отправка */

interface LeadResult {
  no: string;
  delivered: boolean;
}

async function submit(channel: Channel): Promise<LeadResult> {
  if (!ENDPOINT) return { no: localNo(), delivered: false };
  if (issued) return { no: issued, delivered: true };

  const form = new FormData();
  form.set('name', $<HTMLInputElement>('f-name')?.value.trim() || '');
  form.set('contact', $<HTMLInputElement>('f-contact')?.value.trim() || '');
  form.set('task', $<HTMLTextAreaElement>('f-task')?.value.trim() || '');
  form.set('topic', $<HTMLInputElement>('f-topic')?.value || '');
  form.set('channel', channel);
  form.set('page', location.pathname);
  form.set('company', $<HTMLInputElement>('f-company')?.value || '');
  shots.forEach((f) => form.append('photos', f));
  if (voiceBlob) form.append('voice', voiceBlob, 'voice.webm');

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { ok?: boolean; no?: string };
    if (!data.ok || !data.no) throw new Error('bad_response');
    issued = data.no;
    return { no: issued, delivered: true };
  } catch {
    // Сервер молчит — заявка всё равно уйдёт в мессенджер, но обещать,
    // что она дошла до мастерской, мы не имеем права.
    return { no: localNo(), delivered: false };
  }
}

/* ------------------------------------------------------- подтверждение */

const WHERE: Record<Channel, string> = {
  wa: 'WhatsApp',
  tg: 'Telegram',
  tel: 'звонке',
  mail: 'почте',
};

function confirmBox(no: string, channel: Channel, delivered: boolean, text: string) {
  const host = $<HTMLElement>('zayavka');
  if (!host) return;

  let box = $<HTMLElement>('okbox');
  if (!box) {
    box = document.createElement('div');
    box.className = 'okbox';
    box.id = 'okbox';
    box.setAttribute('role', 'status');
    host.querySelector('.pane')?.appendChild(box);
  }

  box.className = delivered ? 'okbox' : 'okbox err';
  box.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'eyebrow';
  label.textContent = 'Номер вашей заявки';

  const number = document.createElement('span');
  number.className = 'okno';
  number.textContent = no;

  const p = document.createElement('p');
  p.textContent = delivered
    ? `Заявка принята и открыта в ${WHERE[channel]}. Отправьте сообщение — мы ответим на него. Если продолжите разговор позже, назовите этот номер: по нему найдём вашу задачу.`
    : `Заявка открыта в ${WHERE[channel]}, но до мастерской пока не дошла: отправьте сообщение, иначе мы о ней не узнаем. Номер назовите в переписке.`;

  box.append(label, number, p);

  // Телеграм не принимает текст в ссылке, поэтому его копируют в буфер.
  // Если буфер недоступен, показываем текст и кнопку: нажатие даст новое
  // разрешение на копирование.
  if (channel === 'tg') {
    const copy = document.createElement('button');
    copy.className = 'btn line';
    copy.type = 'button';
    copy.textContent = 'Скопировать текст заявки';
    copy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(text);
        copy.textContent = 'Скопировано';
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.className = 'copy-fallback';
        box!.appendChild(ta);
        ta.select();
        copy.textContent = 'Выделено — скопируйте вручную';
      }
    };
    box.appendChild(copy);
  }
}

/* ---------------------------------------------------------- каналы */

const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-send]'));

function busy(on: boolean) {
  buttons.forEach((b) => {
    b.disabled = on;
  });
}

async function send(channel: Channel) {
  /* Окно открывается сразу по нажатию, ещё до отправки: открытое после
     await, оно считается всплывающим и блокируется. Адрес подставляется,
     когда сервер вернёт номер. */
  const needsWindow = channel === 'wa' || channel === 'tg';
  const win = needsWindow ? window.open('', '_blank') : null;

  busy(true);
  const { no, delivered } = await submit(channel);
  busy(false);

  const text = letter(no);

  if (channel === 'wa') {
    const url = WA + '?text=' + encodeURIComponent(text);
    if (win) win.location.replace(url);
    else location.href = url;
  }

  if (channel === 'tg') {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* Кнопка «Скопировать» в подтверждении закроет этот случай. */
    }
    if (win) win.location.replace(TG);
    else location.href = TG;
  }

  if (channel === 'tel') location.href = 'tel:' + TEL;

  if (channel === 'mail' && MAIL) {
    location.href =
      'mailto:' +
      MAIL +
      '?subject=' +
      encodeURIComponent('Заявка ' + no) +
      '&body=' +
      encodeURIComponent(text);
  }

  confirmBox(no, channel, delivered, text);
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  const btn = target?.closest<HTMLElement>('[data-send]');
  if (!btn) return;
  e.preventDefault();
  void send(btn.dataset.send as Channel);
});

/* ------------------------------------------------- тема заявки */

/**
 * Подставляет тему в скрытое поле и прокручивает к форме. Вызывается со
 * страницы станков и из определителя детали.
 */
export function setTopic(topic: string, task?: string) {
  const field = $<HTMLInputElement>('f-topic');
  if (field) field.value = topic;

  const area = $<HTMLTextAreaElement>('f-task');
  if (area) {
    if (task && !area.value) area.value = task;
    if (!area.value) area.placeholder = `Например: ${topic.toLowerCase()} — опишите деталь и количество`;
  }

  const host = $<HTMLElement>('zayavka');
  if (!host) return;
  const top = host.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
  area?.focus({ preventScroll: true });
}

/* ------------------------------------------------- голосовое сообщение */

const recBtn = $<HTMLButtonElement>('rec');

if (recBtn) {
  const time = $<HTMLElement>('rtime')!;
  const play = $<HTMLAudioElement>('rplay')!;
  const dl = $<HTMLAnchorElement>('rdl')!;
  const hint = $<HTMLElement>('rhint')!;

  if (!navigator.mediaDevices || !('MediaRecorder' in window)) {
    recBtn.disabled = true;
    hint.textContent =
      'Запись голоса не поддерживается этим браузером — надиктуйте сообщение прямо в WhatsApp или Telegram.';
  } else {
    let mr: MediaRecorder | null = null;
    let chunks: Blob[] = [];
    let tick: ReturnType<typeof setInterval> | null = null;

    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    recBtn.addEventListener('click', async () => {
      if (mr && mr.state === 'recording') {
        mr.stop();
        return;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        hint.textContent =
          'Микрофон недоступен: разрешите запись в настройках браузера или надиктуйте сообщение в мессенджере.';
        return;
      }

      chunks = [];
      mr = new MediaRecorder(stream);

      mr.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };

      mr.onstop = () => {
        if (tick) clearInterval(tick);
        stream.getTracks().forEach((t) => t.stop());

        voiceBlob = new Blob(chunks, { type: mr?.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(voiceBlob);
        play.src = url;
        play.hidden = false;
        dl.href = url;
        dl.hidden = false;
        dl.download = `zayavka-${new Date().toISOString().slice(0, 10)}.webm`;

        recBtn.classList.remove('rec');
        recBtn.innerHTML = '<span class="dot"></span>Записать заново';
        hint.textContent = ENDPOINT
          ? 'Готово. Запись уйдёт вместе с заявкой, когда выберете канал связи.'
          : 'Готово. Сохраните файл и прикрепите его в WhatsApp или Telegram — так мы услышим задачу вашими словами.';
      };

      mr.start();
      const started = Date.now();
      recBtn.classList.add('rec');
      recBtn.innerHTML = '<span class="dot"></span>Остановить запись';
      hint.textContent = 'Идёт запись. Скажите, что нужно: деталь, размеры, количество.';

      tick = setInterval(() => {
        const s = Math.round((Date.now() - started) / 1000);
        time.textContent = fmt(s);
        if (s >= 180) mr?.stop();
      }, 250);
    });
  }
}
