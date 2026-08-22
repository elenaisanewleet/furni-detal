/**
 * Всё, чем мастерская «является», в одном файле.
 *
 * Меняется здесь — меняется везде: копирайт, подвал, schema.org, Open Graph,
 * контакты и текст заявки читают отсюда.
 *
 * Чего здесь нет и быть не должно: стажа, цен, сроков, гарантий и отзывов.
 * Этих фактов у мастера не было, и придумывать их нельзя.
 */

export const site = {
  brand: {
    /** Марка — слово, набранное типографикой. Логотипа не существует. */
    name: 'Мастерская Архангельское',
    short: 'Мастерская',
    where: 'Архангельское',
  },

  positioning:
    'Мебельная фурнитура и крепёж, металлические узлы, мебель из дерева на заказ, ремонт мебели, распил и присадка, заточка.',

  locality: 'село Архангельское',
  region: 'Ульяновская область',
  /** ISO 3166-2 — уходит в schema.org. */
  regionCode: 'RU-ULY',

  /** Оператор мастерской: этот номер стоит на всех кнопках связи. */
  phone: {
    label: '+7 985 198 29 45',
    tel: '+79851982945',
    /** Формат для schema.org. */
    e164: '+79851982945',
    person: 'Елена',
    role: 'оператор мастерской — принимает заявки',
  },

  master: {
    name: 'Николай',
    role: 'мастер',
  },

  whatsapp: 'https://wa.me/79851982945',

  telegram: {
    /** Личный Telegram оператора — работает уже сейчас. */
    personal: 'https://t.me/elenaisanewleet',
    personalHandle: '@elenaisanewleet',
    /**
     * Бот приёма заявок. Заводится через @BotFather; до этого переменная
     * пуста, и заявки идут в личный Telegram, как сегодня.
     */
    bot: (import.meta.env.PUBLIC_TG_BOT || '').replace(/^@/, ''),
    get botReady() {
      return Boolean(this.bot);
    },
    get botUrl() {
      return this.bot ? `https://t.me/${this.bot}` : this.personal;
    },
  },

  /**
   * Почта. Пусто — кнопка «Отправить на почту» не рисуется, чтобы не вести
   * в пустоту.
   */
  mail: import.meta.env.PUBLIC_MAIL || '',

  /**
   * Обработчик заявок. Пусто — форма работает как раньше: номер выдаёт
   * браузер, заявка уходит только в мессенджер.
   */
  leadEndpoint: import.meta.env.PUBLIC_LEAD_ENDPOINT || '',

  /** Яндекс.Метрика. Пусто — счётчик не подключается. */
  metrikaId: import.meta.env.PUBLIC_METRIKA_ID || '',

  /**
   * Подтверждение прав на сайт. Коды выдают Яндекс.Вебмастер и Google
   * Search Console; пока их нет, метатеги не выводятся вовсе.
   */
  verify: {
    yandex: import.meta.env.PUBLIC_YANDEX_VERIFICATION || '',
    google: import.meta.env.PUBLIC_GOOGLE_VERIFICATION || '',
  },

  /** Ограничения совпадают с проверками на сервере. */
  upload: {
    maxFiles: 6,
    maxFileMb: 12,
    accept: 'image/*,.heic,.heif',
    maxVoiceSeconds: 180,
  },
} as const;

/** Строка «Ульяновская область, село Архангельское» — она нужна часто. */
export const placeLine = `${site.region}, ${site.locality}`;
