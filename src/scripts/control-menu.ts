/**
 * CONTROL-1's menus: the live UWA site's behaviour (www.uwa.edu.au, recorded
 * 20 Oct 2026). Markup: src/components/ControlHeader.astro.
 *
 * Menu bar (data-control-bar="bar" on <html>, 768px and wider):
 *   - Hovering a menu button opens its panel after a short delay (the live
 *     site's ~250ms); moving on to another button within it opens that one
 *     instead. The delay isn't cancelled by moving off, as on the live site.
 *   - Once the pointer has been inside the open panel, leaving it closes the
 *     panel after a delay (~2s); coming back cancels that. Moving off the
 *     button without entering the panel leaves it open.
 *   - Clicking a button toggles its panel (a click just after hovering opened
 *     it keeps it open). From the keyboard, it opens with focus on the panel's
 *     first link.
 *   - Closes on: its button, the panel's ×, Esc (focus back on the button), or
 *     a click outside the header.
 *   - Dropdowns (More, a section's or co-branded site's pages) sit under their
 *     button; mega menus (sections, All UWA, Search) span the header. All UWA
 *     opens just under the top row, over the section's menu row (as live).
 *   - Buttons that don't fit on one row are hidden; » shows them all (the
 *     bar wraps), and hides them again.
 *   - The panel's title slides in as it opens.
 * Mobile menu (data-control-bar="mobile"): the Menu button opens the top
 *   level; choosing a section slides its panel in from the right, and the Menu
 *   button becomes Back (‹), which slides back to the top level; at the top it
 *   is Close (×). L3 pages sit behind accordions, one open at a time per panel.
 * Search (both): the search button opens the search panel (and turns into ×);
 *   typing lists matching pages under "Did you mean...", Search or Enter goes
 *   to the first. A popular search fills in the field.
 * Crossing 768px closes everything. Motion timings come from tokens.css.
 */
import { matchPages, type SearchEntry } from '../lib/search';

const header = document.querySelector<HTMLElement>('[data-control-header]');
if (header) init(header);

function init(header: HTMLElement) {
  const html = document.documentElement;
  const { base, search } = JSON.parse(header.querySelector('[data-control-data]')?.textContent || '{}') as { base: string; search: SearchEntry[] };
  const panels = new Map([...header.querySelectorAll<HTMLElement>('[data-panel]')].map(p => [p.id, p]));
  const triggers = [...header.querySelectorAll<HTMLButtonElement>('[data-opens]')];
  const menuButton = header.querySelector<HTMLButtonElement>('[data-control-menu]')!;
  const nav = header.querySelector<HTMLElement>('[data-control-nav]');
  const items = header.querySelector<HTMLElement>('[data-control-items]');
  const overflow = header.querySelector<HTMLButtonElement>('[data-control-overflow]');
  const form = header.querySelector<HTMLFormElement>('[data-control-search]')!;
  const input = form.querySelector('input')!;
  const suggestions = header.querySelector<HTMLElement>('[data-control-suggestions]')!;
  const results = header.querySelector<HTMLElement>('[data-control-results]')!;
  const none = header.querySelector<HTMLElement>('[data-control-none]')!;

  const isBar = () => html.dataset.controlBar === 'bar';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const token = (name: string) => getComputedStyle(html).getPropertyValue(name).trim();
  const ms = (name: string) => {
    const v = token(name);
    return v.endsWith('ms') ? parseFloat(v) : (parseFloat(v) * 1000) || 0;
  };
  const href = (path: string) => (path ? `${base}${path}/` : base);

  let openId = '';            // the panel showing ('' = none)
  let opener: HTMLElement | null = null;
  let hoverOpenedAt = 0;      // when hover last opened a panel (a click just after it keeps it open)
  let openTimer = 0, closeTimer = 0;
  let pointerInPanel = false;

  const triggerFor = (id: string) => triggers.find(t => t.dataset.opens === id && t.offsetParent) ?? null;

  /** Header buttons' states: aria-expanded, and the Menu button's icon (menu, back, close). */
  function sync() {
    triggers.forEach(t => t.setAttribute('aria-expanded', String(t.dataset.opens === openId)));
    const menuOpen = !isBar() && openId !== '' && openId !== 'cm-search';
    const state = !menuOpen ? 'menu' : openId === 'cm-root' ? 'close' : 'back';
    menuButton.dataset.state = state;
    menuButton.setAttribute('aria-expanded', String(menuOpen));
    menuButton.setAttribute('aria-label', state === 'menu' ? 'Open the menu' : state === 'close' ? 'Close the menu' : 'Back to the top of the menu');
    header.classList.toggle('is-open', openId !== '');
    header.dataset.open = openId;
  }

  /**
   * Dropdowns sit under their button, kept inside the header's width. All UWA (menu bar) opens higher,
   * just under the top row, covering the section's menu row, as on the live site, so the pointer can't
   * open a section dropdown on its way down to it.
   */
  function place(panel: HTMLElement, trigger: HTMLElement | null) {
    panel.style.top = '';
    if (isBar() && panel.id === 'cm-all') {
      // Under the top row and the logos, whichever is lower
      const above = [...header.querySelectorAll<HTMLElement>('.control-top, .control-brand .logo, .control-brand .cobrand-logo')].filter(e => e.offsetParent);
      const below = Math.max(...above.map(e => e.getBoundingClientRect().bottom)) - header.getBoundingClientRect().bottom;
      panel.style.top = `${below + parseFloat(token('--control-all-gap') || '0')}px`;
    }
    if (!isBar() || !trigger || !panel.classList.contains('control-dropdown')) { panel.style.left = ''; return; }
    const h = header.getBoundingClientRect(), t = trigger.getBoundingClientRect();
    panel.style.left = '0px';
    const room = h.width - panel.offsetWidth;
    panel.style.left = `${Math.max(0, Math.min(t.left - h.left - parseFloat(token('--control-dropdown-inset') || '0'), room))}px`;
  }

  function animateIn(panel: HTMLElement, dir: 0 | 1 | -1) {
    if (reducedMotion.matches) return;
    if (dir === 0) {
      // Bar: the title slides down into place
      const title = panel.querySelector<HTMLElement>('.control-title');
      const duration = ms('--control-title-duration');
      if (title && duration) title.animate([{ opacity: 0, transform: `translateY(-${token('--control-title-offset')})` }, { opacity: 1, transform: 'none' }], { duration, easing: 'ease-out' });
      return;
    }
    // Mobile: the panel slides in from the right (deeper) or the left (back)
    const duration = ms('--control-slide-duration');
    const offset = token('--control-slide-offset');
    if (duration) panel.animate([{ opacity: 0, transform: `translateX(${dir === 1 ? '' : '-'}${offset})` }, { opacity: 1, transform: 'none' }], { duration, easing: 'linear' });
  }

  /** Show panel `id` (closing any other). `focus`: move focus into it (keyboard). `dir`: mobile slide direction. */
  function open(id: string, trigger: HTMLElement | null, focus = false, dir: 0 | 1 | -1 = 0) {
    const panel = panels.get(id);
    if (!panel) return;
    clearTimeout(closeTimer);
    if (openId && openId !== id) panels.get(openId)!.hidden = true;
    const already = openId === id;
    openId = id;
    opener = trigger;
    panel.hidden = false;
    pointerInPanel = false;
    place(panel, trigger);
    sync();
    if (!already) animateIn(panel, dir);
    if (id === 'cm-search') { input.focus(); return; }
    if (focus) panel.querySelector<HTMLElement>('a[href], button:not([data-control-close])')?.focus();
  }

  function close(returnFocus = false) {
    clearTimeout(openTimer); clearTimeout(closeTimer);
    if (!openId) return;
    const was = openId;
    panels.get(openId)!.hidden = true;
    openId = '';
    sync();
    if (returnFocus) (opener && opener.offsetParent ? opener : was === 'cm-search' ? triggerFor('cm-search') : menuButton)?.focus();
  }

  // ---------- Menu bar: hover ----------
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');
  triggers.forEach(t => {
    if (t.dataset.opens === 'cm-search') return;
    t.addEventListener('pointerenter', (e) => {
      if (!isBar() || !canHover.matches || e.pointerType !== 'mouse') return;
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      if (openId === t.dataset.opens) return;
      openTimer = window.setTimeout(() => { open(t.dataset.opens!, t); hoverOpenedAt = performance.now(); }, ms('--control-hover-open-delay'));
    });
  });
  panels.forEach(p => {
    p.addEventListener('pointerenter', () => { pointerInPanel = true; clearTimeout(closeTimer); });
    p.addEventListener('pointerleave', (e) => {
      if (!isBar() || e.pointerType !== 'mouse' || !pointerInPanel || p.id !== openId || p.id === 'cm-search') return;
      clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => close(), ms('--control-hover-close-delay'));
    });
  });

  // ---------- Clicks ----------
  triggers.forEach(t => t.addEventListener('click', (e) => {
    clearTimeout(openTimer);
    const id = t.dataset.opens!;
    if (openId === id) {
      if (performance.now() - hoverOpenedAt < ms('--control-click-guard')) return; // hover opened it a moment ago
      close();
      return;
    }
    open(id, t, e.detail === 0 && id !== 'cm-search');
  }));
  menuButton.addEventListener('click', (e) => {
    const keyboard = e.detail === 0;
    const state = menuButton.dataset.state;
    if (state === 'close') close();
    else if (state === 'back') open('cm-root', menuButton, keyboard, -1);
    else open('cm-root', menuButton, keyboard);
  });
  header.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const drill = target.closest<HTMLElement>('[data-drill]');
    if (drill) { open(drill.dataset.drill!, menuButton, (e as MouseEvent).detail === 0, 1); return; }
    if (target.closest('[data-control-close]')) { close((e as MouseEvent).detail === 0); return; }
    const acc = target.closest<HTMLButtonElement>('.control-accordion');
    if (acc) {
      const opening = acc.getAttribute('aria-expanded') !== 'true';
      // One open at a time in a panel
      acc.closest('[data-panel]')!.querySelectorAll('.control-accordion[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
      acc.setAttribute('aria-expanded', String(opening));
      return;
    }
    const popular = target.closest<HTMLElement>('[data-popular]');
    if (popular) { input.value = popular.dataset.popular!; suggest(); input.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (openId && !header.contains(e.target as Node)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openId) close(true);
  });

  // ---------- Overflow (menu bar): buttons that don't fit on the row hide behind » ----------
  function fit() {
    if (!nav || !items || !overflow) return;
    const lis = [...items.children] as HTMLElement[];
    lis.forEach(li => li.classList.remove('is-clipped'));
    if (!isBar()) { overflow.hidden = true; nav.classList.remove('is-expanded'); return; }
    const expanded = nav.classList.contains('is-expanded');
    nav.classList.add('is-measuring'); // all on one row, wrapping, to see what fits
    overflow.hidden = true;
    const wraps = () => lis.some(li => li.offsetTop > lis[0].offsetTop);
    if (wraps()) {
      overflow.hidden = false;
      lis.forEach(li => { if (li.offsetTop > lis[0].offsetTop) li.classList.add('is-clipped'); });
    }
    nav.classList.remove('is-measuring');
    if (overflow.hidden) nav.classList.remove('is-expanded');
    overflow.setAttribute('aria-expanded', String(expanded && !overflow.hidden));
  }
  overflow?.addEventListener('click', () => {
    nav!.classList.toggle('is-expanded');
    overflow.setAttribute('aria-expanded', String(nav!.classList.contains('is-expanded')));
    if (openId) place(panels.get(openId)!, opener);
  });
  if (nav) new ResizeObserver(() => fit()).observe(header);
  fit();

  // ---------- Search ----------
  function suggest() {
    const typed = input.value.trim();
    results.replaceChildren();
    suggestions.hidden = !typed;
    if (!typed) return;
    const found = matchPages(search, typed);
    none.hidden = found.length > 0;
    none.textContent = found.length ? '' : `No pages match “${typed}”.`;
    for (const e of found) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href(e.h);
      a.textContent = e.l;
      if (e.t) {
        const trail = document.createElement('span');
        trail.className = 'control-search-trail';
        trail.textContent = e.t;
        a.append(trail);
      }
      li.append(a);
      results.append(li);
    }
  }
  input.addEventListener('input', suggest);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const first = matchPages(search, input.value)[0];
    if (first) location.href = href(first.h);
  });

  // ---------- Crossing 768px: start again ----------
  document.addEventListener('controllayoutchange', () => {
    close();
    header.querySelectorAll('.control-accordion[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    nav?.classList.remove('is-expanded');
    fit();
  });
  sync();
}
