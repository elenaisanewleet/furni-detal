import type { APIRoute } from 'astro';
import { originOf } from '~/lib/origin';

/**
 * robots.txt собирается сборкой, чтобы адрес карты сайта всегда совпадал
 * с адресом выкладки: руками положенный файл рано или поздно начинает
 * указывать на прошлый домен.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = originOf(site);

  const body = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
