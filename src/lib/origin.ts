/**
 * Адрес сайта и переезд на свой домен.
 *
 * Домен живёт в одной переменной — SITE_URL, а на Vercel до её появления
 * берётся из VERCEL_PROJECT_PRODUCTION_URL (см. astro.config.mjs). Отсюда
 * его читают canonical, Open Graph, sitemap.xml, robots.txt и schema.org.
 *
 * Решение по индексации принято сознательно: временный адрес vercel.app
 * в поиск пускаем. Смысл сайта — местная выдача, а новый сайт набирает
 * позиции месяцами, и ждать домена, чтобы только начать, дороже, чем потом
 * схлопнуть дубль. Когда домен появится:
 *
 *   1. SITE_URL=https://новый-домен — и всё содержимое переедет само;
 *   2. в Vercel → Settings → Domains сделать новый домен основным, чтобы
 *      старый адрес отдавал 301, а не вторую копию сайта.
 *
 * Второй шаг обязателен. Без него в выдаче останутся два одинаковых сайта,
 * растаскивающих друг у друга позиции.
 */

/** Хосты, которые не являются собственным доменом мастерской. */
const TEMPORARY = [
  /\.vercel\.app$/,
  /\.netlify\.app$/,
  /\.pages\.dev$/,
  /^localhost$/,
  /\.local$/,
  /^\d+\.\d+\.\d+\.\d+$/,
];

export function isTemporaryOrigin(site: URL | undefined): boolean {
  if (!site) return true;
  return TEMPORARY.some((re) => re.test(site.hostname));
}

/** Адрес без завершающего слэша — в таком виде он нужен разметке. */
export function originOf(site: URL | undefined): string {
  return site?.toString().replace(/\/$/, '') ?? '';
}
