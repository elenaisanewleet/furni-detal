import { setTopic } from '~/scripts/task-form';

/**
 * Определитель детали — три входа в один список.
 *
 * Плитки и карточки отрисованы на сервере: без JS страница работает,
 * карточка раскрывается по :target. Здесь добавляется только то, чего
 * разметкой не сделать — вкладки, фильтры и подстановка названия детали
 * в заявку.
 */

const grid = document.getElementById('pgrid');

if (grid) {
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.p'));
  const count = document.getElementById('count')!;
  const empty = document.getElementById('empty')!;
  const search = document.getElementById('q') as HTMLInputElement | null;
  const placesBox = document.getElementById('places');
  const symsBox = document.getElementById('syms');

  /** «ё» и «е» для человека одна буква, и искать он будет как придётся. */
  const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').trim();

  function show(visible: HTMLElement[]) {
    cards.forEach((c) => {
      c.hidden = !visible.includes(c);
    });
    count.textContent = visible.length ? `Показано: ${visible.length} из ${cards.length}` : '';
    empty.hidden = visible.length > 0;
  }

  function clearChips(except?: Element) {
    document.querySelectorAll<HTMLElement>('.chip').forEach((c) => {
      if (c !== except) c.setAttribute('aria-pressed', 'false');
    });
  }

  /* ---- вход первый: по месту ---- */

  let place = '';

  placesBox?.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest<HTMLElement>('.chip');
    if (!chip) return;

    place = place === chip.dataset.place ? '' : chip.dataset.place || '';
    clearChips();
    chip.setAttribute('aria-pressed', String(Boolean(place)));
    if (search) search.value = '';

    show(place ? cards.filter((c) => (c.dataset.place || '').split(' ').includes(place)) : cards);
  });

  /* ---- вход второй: по названию ---- */

  search?.addEventListener('input', () => {
    place = '';
    clearChips();
    const q = norm(search.value);
    show(q ? cards.filter((c) => norm(c.dataset.terms || '').includes(q)) : cards);
  });

  /* ---- вход третий: по проблеме ---- */

  let symptom = '';

  symsBox?.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest<HTMLElement>('.chip');
    if (!chip) return;

    symptom = symptom === chip.dataset.sym ? '' : chip.dataset.sym || '';
    clearChips();
    chip.setAttribute('aria-pressed', String(Boolean(symptom)));
    if (search) search.value = '';

    if (!symptom) {
      show(cards);
      return;
    }

    const found = cards.filter((c) => norm(c.dataset.terms || '').includes(norm(symptom)));
    show(found);

    // Если по симптому нашлась ровно одна деталь, показывать список из
    // одной плитки незачем — раскрываем её сразу.
    if (found.length === 1) {
      setTimeout(() => {
        location.hash = found[0].getAttribute('href') || '';
      }, 260);
    }
  });

  /* ---- вкладки ---- */

  const tabs = Array.from(document.querySelectorAll<HTMLElement>('.tab'));

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        const panel = document.getElementById(t.getAttribute('aria-controls') || '');
        if (panel) panel.hidden = !on;
      });
      if (tab.getAttribute('aria-controls') === 'nm') search?.focus();
    });
  });

  /* ---- подсветка выбранной плитки ---- */

  function markOpen() {
    const id = location.hash.replace('#detail-', '');
    cards.forEach((c) => c.classList.toggle('on', Boolean(id) && c.dataset.id === id));
  }

  markOpen();
  window.addEventListener('hashchange', markOpen);

  /* ---- «Заказать эту деталь» ---- */

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-order]');
    if (!btn) return;
    const what = btn.dataset.order || '';
    setTopic(`Деталь: ${what}`, `Нужна деталь: ${what}. `);
  });

  show(cards);
}
