/**
 * Навигация и адреса страниц.
 *
 * Один список на шапку, подвал, sitemap и перелинковку: страница не может
 * появиться в меню и потеряться в подвале.
 */

export interface NavItem {
  href: string;
  label: string;
}

/** Шесть услуг — порядок тот же в шапке, в хабе на главной и в подвале. */
export const services: NavItem[] = [
  { href: '/furnitura-i-krepezh/', label: 'Фурнитура и крепёж' },
  { href: '/mebel-na-zakaz/', label: 'Мебель на заказ' },
  { href: '/remont-mebeli/', label: 'Ремонт и доработка мебели' },
  { href: '/metallicheskie-uzly/', label: 'Металлические узлы' },
  { href: '/raspil-i-prisadka/', label: 'Распил и присадка' },
  { href: '/zatochka/', label: 'Заточка' },
];

export const primaryNav: NavItem[] = [
  { href: '/podbor-detali/', label: 'Подбор детали' },
  { href: '/stanki/', label: 'Станки' },
  { href: '/masterskaya-3d/', label: '3D-модель' },
  { href: '/kontakty/', label: 'Контакты' },
];

export const footerLinks: NavItem[] = [
  { href: '/detali/', label: 'Названия деталей' },
  { href: '/podbor-detali/', label: 'Подбор детали' },
  { href: '/zakaz/', label: 'Показать деталь' },
  { href: '/stanki/', label: 'Станки мастерской' },
  { href: '/masterskaya-3d/', label: '3D-модель' },
  { href: '/katalog-3d/', label: 'Каталог объектов' },
];
