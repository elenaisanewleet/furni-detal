// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Боевой адрес сайта. Задаётся в одном месте — отсюда его берут canonical,
 * Open Graph, sitemap.xml, robots.txt и schema.org. В тринадцати страницах
 * домена нет ни разу.
 *
 *   SITE_URL=https://мастерская.рф npm run build
 *
 * Пока своего домена нет, на Vercel задавать ничего не нужно: адрес берётся
 * из VERCEL_PROJECT_PRODUCTION_URL. Важно, что именно из неё, а не из
 * VERCEL_URL: вторая уникальна для каждой выкладки, и canonical на ней
 * менялся бы после каждого коммита — то есть указывал бы на адрес, которого
 * через день уже нет.
 */
const VERCEL_HOST = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const SITE =
  process.env.SITE_URL ||
  (VERCEL_HOST ? `https://${VERCEL_HOST}` : null) ||
  'https://furniture-detal.vercel.app';

/**
 * Приоритеты повторяют коммерческую важность страницы, а не глубину вложения:
 * заявка и определитель детали приносят обращения, 3D — витрина.
 */
const PRIORITY = [
  [/^\/$/, 1.0],
  [/^\/podbor-detali\/$/, 0.9],
  [/^\/detali\/$/, 0.9],
  [/^\/detali\/[^/]+\/$/, 0.7],
  [/^\/(zakaz|stanki|kontakty)\/$/, 0.8],
  [/^\/(masterskaya-3d|katalog-3d)\/$/, 0.5],
];

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const hit = PRIORITY.find(([re]) => re.test(path));
        // Страницы услуг — всё остальное, что попало в карту: 0.8.
        item.priority = hit ? Number(hit[1]) : 0.8;
        return item;
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      // Один файл стилей на весь сайт: он небольшой и кэшируется целиком.
      cssCodeSplit: false,
    },
  },
});
