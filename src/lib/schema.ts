import { site, placeLine } from '~/data/site';
import { services, serviceHref } from '~/data/services';

/**
 * Сборщики разметки schema.org.
 *
 * Правило одно: в разметку уходит только то, что подтверждено. Ни цен, ни
 * сроков, ни рейтинга, ни часов работы здесь нет и появиться не может —
 * этих фактов у мастерской не было. Небольшой, но правдивый LocalBusiness
 * лучше богатого и выдуманного: за выдуманный прилетает ручная санкция.
 */

const ORG = '#org';

export const orgId = (origin: string) => new URL(ORG, origin).toString();

/** Главный узел: кто это, где и чем занимается. Стоит на каждой странице. */
export function localBusiness(origin: string) {
  return {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': orgId(origin),
    name: site.brand.name,
    description: site.positioning,
    url: origin,
    telephone: site.phone.e164,
    /* Улицы и дома нет: частный дом в селе не выдаётся за шоурум. Село и
       область — подтверждены и достаточны, чтобы привязать к месту. */
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: 'RU',
    },
    image: new URL('/og.jpg', origin).toString(),
    areaServed: {
      '@type': 'AdministrativeArea',
      name: site.region,
    },
    /* Чем мастерская занимается — списком, теми же словами, какими это
       ищут. Не цены и не обещания: перечень тем, а не оффер. */
    knowsAbout: [
      'мебельная фурнитура',
      'мебельные петли',
      'направляющие для ящиков',
      'эксцентриковая стяжка',
      'полкодержатели',
      'ролики для дверей-купе',
      'мебельные доводчики',
      'крепёж и резьбовые элементы',
      'металлические узлы и кронштейны',
      'ремонт мебели',
      'распил и присадка',
      'заточка инструмента',
    ],
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.schemaName,
        url: new URL(serviceHref(s.slug), origin).toString(),
      },
    })),
  };
}

export function webSite(origin: string) {
  return {
    '@type': 'WebSite',
    '@id': new URL('#website', origin).toString(),
    url: origin,
    name: site.brand.name,
    inLanguage: 'ru-RU',
    publisher: { '@id': orgId(origin) },
  };
}

export function breadcrumbs(origin: string, trail: { name: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: new URL(t.href, origin).toString(),
    })),
  };
}

export function service(
  origin: string,
  s: { name: string; serviceType: string; description: string; url: string }
) {
  return {
    '@type': 'Service',
    name: s.name,
    serviceType: s.serviceType,
    description: s.description,
    url: new URL(s.url, origin).toString(),
    provider: { '@id': orgId(origin) },
    areaServed: { '@type': 'AdministrativeArea', name: site.region },
  };
}

export function faqPage(items: { q: string; a: string }[]) {
  if (!items.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

/** Страница контактов: тот же адрес, но как отдельная сущность. */
export function contactPage(origin: string) {
  return {
    '@type': 'ContactPage',
    url: new URL('/kontakty/', origin).toString(),
    name: `Контакты — ${site.brand.name}`,
    description: `Связаться с мастерской: ${site.phone.label}, WhatsApp, Telegram. ${placeLine}.`,
    mainEntity: { '@id': orgId(origin) },
  };
}

/** Все узлы страницы — одним @graph, а не пятью отдельными скриптами. */
export function graph(nodes: unknown[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) });
}
