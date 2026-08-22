import { setTopic } from '~/scripts/task-form';

/**
 * Схемы станков.
 *
 * Чертёж прорисовывается, когда попадает в вид: линии выкатываются по
 * stroke-dashoffset, с задержкой в 55 мс на элемент — рука, ведущая по
 * бумаге, а не появление картинки. Через четыре секунды штриховка
 * снимается: она нужна была ровно для прорисовки, а дальше только мешала
 * бы масштабированию.
 */

const cards = Array.from(document.querySelectorAll<HTMLElement>('.m'));

if (cards.length) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw(card: HTMLElement) {
    if (card.dataset.drawn) return;
    card.dataset.drawn = '1';
    if (reduced) return;

    const shapes = Array.from(card.querySelectorAll<SVGGeometryElement>('svg > *'));
    shapes.forEach((shape, i) => {
      let len = 0;
      try {
        len = shape.getTotalLength();
      } catch {
        len = 0;
      }
      if (!len) return;

      shape.style.strokeDasharray = `${len}px`;
      shape.style.strokeDashoffset = `${len}px`;

      setTimeout(() => {
        shape.style.transition =
          'stroke-dashoffset .55s cubic-bezier(.4,0,.2,1), stroke var(--dur-2) var(--ease)';
        shape.style.strokeDashoffset = '0px';
      }, 40 + 55 * i);
    });

    // Штриховка снимается, когда прорисовка закончилась.
    setTimeout(() => {
      shapes.forEach((s) => {
        s.style.strokeDasharray = '';
        s.style.strokeDashoffset = '';
      });
    }, 4000);
  }

  /* IntersectionObserver вместо обработчика прокрутки: тот считал
     положение шести карточек на каждый кадр прокрутки. */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const card = entry.target as HTMLElement;
        setTimeout(() => draw(card), (i % 3) * 150);
        io.unobserve(card);
      });
    },
    { rootMargin: '0px 0px -8% 0px' }
  );

  cards.forEach((c) => io.observe(c));

  /** Приход по якорю: раскрыть нужный станок и прорисовать его. */
  function fromHash() {
    const id = location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target || !target.classList.contains('m')) return;

    cards.forEach((c) => {
      c.classList.remove('on');
      c.setAttribute('aria-expanded', 'false');
    });
    target.classList.add('on');
    target.setAttribute('aria-expanded', 'true');
    draw(target);
  }

  fromHash();
  window.addEventListener('hashchange', fromHash);

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      // Нажатие на «Заказать эту работу» ведёт в заявку, а не раскрывает
      // карточку: это разные намерения.
      if (target.closest('.go')) {
        e.stopPropagation();
        setTopic(card.dataset.name || '');
        return;
      }

      const open = card.classList.toggle('on');
      card.setAttribute('aria-expanded', String(open));
    });
  });
}
