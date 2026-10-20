/**
 * Phase 2's menu pane (click only, no hover), for variants G and H.
 *
 * One pane handles the whole menu, one level at a time, as in E: the Menu
 * button opens it at the top-level items; choosing an item with children
 * replaces the pane's contents with that item as a heading (linking to its
 * page) and its children, sliding in from the right. Back steps up a level.
 *   G (header): the pane opens under the header, sliding down from its bottom
 *     edge. Compact layouts: it takes over the screen under the header.
 *   H (sidebar): the pane opens beside the sidebar, sliding out from under it
 *     (as E). Compact layouts: E's drawer; the hamburger opens it with the pane
 *     on it at the top level.
 *
 * Search (G: the header's search button; H: the sidebar's search button, and
 * the top bar's search icon on mobile and tablet) opens the same pane with a
 * search field. Typing lists the pages whose names contain every word typed
 * (names starting with the text first, then in IA order), each linking to its
 * page, with its trail under it. Enter goes to the first result. Menu and
 * Search swap the pane between the two; the button that's showing closes it.
 *
 * Promo: a placeholder at the bottom of the pane, shown at the menu's top level
 * only, and on a co-branded page only under the UWA tab (not the site's); not with
 * search or deeper levels.
 *
 * Behaviour options (src/options.ts):
 *   "Back button in the menu": Back, or the name of the level it goes back to
 *     ("All UWA" at the top level; the site's name on a co-branded site's tab).
 *   "Arrows in the menu": which items show a → (CSS, components.css).
 *   "Shortcuts", "Search": hide those buttons (CSS).
 * Co-branded site pages always use the tabs (co-brand menu option 2): the pane
 * opens on the site's sections, under the UWA and site tabs and the site's name.
 *
 * The menu always opens at the top, as on the homepage. Closes on: the button
 * that opened it, Esc, or a click outside the pane and the buttons. Clicking a
 * page link slides the pane away first, then navigates. Crossing between the
 * compact and desktop layouts closes it. Motion timings come from tokens.css.
 */
import { indexTree, pagePath, cobrandTop, type MenuNode, type CobrandData } from '../lib/menu-state';
import { getOption } from '../lib/options';
import { isCompact, onLayoutChange } from '../lib/breakpoints';
import { menuTabs, tabArrowKeys, type MenuMode } from '../lib/menu-tabs';

type SearchEntry = { l: string; h: string; t: string };
type Mode = 'menu' | 'search';

const pane = document.querySelector<HTMLElement>('[data-menu-pane]');
if (pane) init(pane);

function init(pane: HTMLElement) {
  const dataEl = document.querySelector<HTMLScriptElement>('[data-nav-data]')!;
  const { base, tree, cobrand, search } = JSON.parse(dataEl.textContent || '{}') as { base: string; tree: MenuNode[]; cobrand?: CobrandData; search: SearchEntry[] };
  const currentPath = pane.dataset.currentPath || '';
  const sidebar = document.querySelector<HTMLElement>('[data-sidebar]'); // H
  const list = pane.querySelector<HTMLUListElement>('[data-pane-list]')!;
  const back = pane.querySelector<HTMLButtonElement>('[data-pane-back]')!;
  const backLabel = pane.querySelector<HTMLElement>('[data-pane-back-label]')!;
  const form = pane.querySelector<HTMLFormElement>('[data-pane-search]')!;
  const input = form.querySelector<HTMLInputElement>('input')!;
  const status = pane.querySelector<HTMLElement>('[data-pane-search-status]')!;
  const promo = pane.querySelector<HTMLElement>('[data-pane-promo]')!;
  const arrowTpl = document.querySelector<HTMLTemplateElement>('[data-arrow]')!;
  const menuToggles = [...document.querySelectorAll<HTMLButtonElement>('[data-menu-toggle]')];
  const searchToggles = [...document.querySelectorAll<HTMLButtonElement>('[data-search-toggle]')];
  const barToggle = document.querySelector<HTMLButtonElement>('[data-drawer-toggle]'); // H, compact
  const barSearch = document.querySelector<HTMLButtonElement>('[data-bar-search]');    // H, compact
  const scrim = document.querySelector<HTMLElement>('[data-drawer-scrim]');
  const triggers: HTMLElement[] = [...menuToggles, ...searchToggles];

  // Co-branded pages: the site's sections stand in for the top level, under the tabs
  const cbTop = cobrand ? cobrandTop(cobrand) : [];
  const startTab: MenuMode = cobrand ? 'cobrand' : 'core';
  let tab: MenuMode = startTab;
  const topLevel = () => (tab === 'cobrand' ? cbTop : tree);

  const byPath = indexTree([...tree, ...cbTop]);
  const href = (p: string) => `${base}${p}/`;
  let open = false;
  let mode: Mode = 'menu';
  let path: string[] = []; // the chain drilled into; the pane shows the last item's children

  // ---------- Motion helpers ----------
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  function ms(name: string): number {
    if (reducedMotion.matches) return 0;
    const v = token(name);
    const n = parseFloat(v);
    if (Number.isNaN(n)) return 0;
    return v.endsWith('ms') ? n : n * 1000;
  }
  function play(el: HTMLElement, frames: Keyframe[], durationVar: string, easingVar: string): Promise<void> {
    const duration = ms(durationVar);
    if (!duration) return Promise.resolve();
    const anim = el.animate(frames, { duration, easing: token(easingVar) || 'ease', fill: 'both' });
    return anim.finished.then(() => anim.cancel(), () => {});
  }

  // ---------- Rendering ----------
  /** A menu row. Every row carries a → (the "Arrows in the menu" option decides in CSS which show). */
  function row(node: MenuNode, heading = false): HTMLLIElement {
    const li = document.createElement('li');
    const drills = node.c.length > 0 && !heading;
    const el = drills ? document.createElement('button') : document.createElement('a');
    el.className = 'menu-item' + (heading ? ' dynamic-heading' : '');
    el.dataset.path = node.p;
    if (drills) (el as HTMLButtonElement).type = 'button';
    else (el as HTMLAnchorElement).href = href(pagePath(node));
    if (pagePath(node) === currentPath) el.setAttribute('aria-current', 'page');
    const label = document.createElement('span');
    label.className = 'menu-item-label';
    label.textContent = node.l;
    el.append(label, arrowTpl.content.cloneNode(true));
    li.append(el);
    return li;
  }

  /** The co-branded site's name, linking to its home (under the tabs, on the site's tab). */
  function siteTitleRow(): HTMLLIElement {
    const li = document.createElement('li');
    const title = document.createElement('a');
    title.className = 'menu-item menu-site-title';
    title.href = href(cobrand!.h);
    if (cobrand!.h === currentPath) title.setAttribute('aria-current', 'page');
    const label = document.createElement('span');
    label.className = 'menu-item-label';
    label.textContent = cobrand!.l;
    title.append(label, arrowTpl.content.cloneNode(true));
    li.append(title);
    return li;
  }

  /** Where Back goes: the previous level's name ("All UWA", or the site's name, at the top). */
  function previousName(): string {
    if (path.length >= 2) return byPath.get(path[path.length - 2])?.l ?? 'Back';
    return tab === 'cobrand' ? cobrand!.l : 'All UWA';
  }

  function fill() {
    list.replaceChildren();
    const searching = mode === 'search';
    form.hidden = !searching;
    status.hidden = !searching;
    list.classList.toggle('is-results', searching);
    promo.hidden = searching || path.length > 0 || tab === 'cobrand';
    if (searching) {
      back.hidden = true;
      results();
      pane.setAttribute('aria-label', 'Search');
    } else {
      const target = path[path.length - 1];
      const node = target ? byPath.get(target) : undefined;
      if (node) {
        list.append(row(node, true));
        for (const child of node.c) list.append(row(child));
        pane.setAttribute('aria-label', node.l);
      } else {
        if (cobrand) {
          const li = document.createElement('li');
          li.append(menuTabs(cobrand.s, cobrand.l, tab));
          list.append(li);
          if (tab === 'cobrand') list.append(siteTitleRow());
        }
        for (const top of topLevel()) list.append(row(top));
        pane.setAttribute('aria-label', tab === 'cobrand' ? `${cobrand!.l} menu` : 'Main menu');
      }
      back.hidden = path.length === 0;
      const name = previousName();
      const generic = getOption('menu-back') !== 'previous';
      backLabel.textContent = generic ? 'Back' : name;
      back.setAttribute('aria-label', `Back to ${name}`);
    }
    menuToggles.forEach(b => b.setAttribute('aria-expanded', String(open && mode === 'menu')));
    searchToggles.forEach(b => b.setAttribute('aria-expanded', String(open && mode === 'search')));
  }

  /** Search results: pages whose names contain every word typed. */
  function results() {
    list.replaceChildren();
    const typed = input.value.trim();
    const q = typed.toLowerCase().replace(/\s+/g, ' ');
    if (!q) { status.textContent = 'Type to find a page.'; return; }
    const words = q.split(' ');
    const startsWord = (label: string) => label.split(/[^a-z0-9]+/).some(w => w.startsWith(words[0]));
    const found = search
      .map((e, i) => ({ e, i, l: e.l.toLowerCase() }))
      .filter(x => words.every(w => x.l.includes(w)))
      .map(x => ({ ...x, score: x.l.startsWith(q) ? 0 : startsWord(x.l) ? 1 : 2 }))
      .sort((a, b) => a.score - b.score || a.i - b.i);
    status.textContent = found.length
      ? `${found.length} ${found.length === 1 ? 'page' : 'pages'}`
      : `No pages match “${typed}”.`;
    for (const { e } of found) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'search-result';
      a.href = href(e.h);
      if (e.h === currentPath) a.setAttribute('aria-current', 'page');
      const label = document.createElement('span');
      label.className = 'search-result-label';
      label.textContent = e.l;
      a.append(label);
      if (e.t) {
        const trail = document.createElement('span');
        trail.className = 'search-result-trail';
        trail.textContent = e.t;
        a.append(trail);
      }
      li.append(a);
      list.append(li);
    }
  }

  /** Slide the pane's contents in from the right (deeper) or the left (Back). `keepTabs`: the tabs stay put. */
  function slideContents(dir: 1 | -1, keepTabs = false) {
    const duration = ms('--motion-submenu-in-duration');
    if (!duration) return;
    const offset = token('--motion-drill-offset') || '24px';
    const from = dir === 1 ? offset : `-${offset}`;
    const frames = [{ transform: `translateX(${from})`, opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }];
    const opts = { duration, easing: token('--motion-submenu-in-easing') || 'ease-out' };
    list.getAnimations({ subtree: true }).forEach(a => a.cancel());
    if (keepTabs) { ([...list.children] as HTMLElement[]).slice(1).forEach(li => li.animate(frames, opts)); return; }
    list.animate(frames, opts);
  }

  function focusFirst() {
    if (mode === 'search') { input.focus(); return; }
    list.querySelector<HTMLElement>('.menu-item, .menu-tab[aria-selected="true"]')?.focus();
  }

  /** Start a mode afresh: the menu at the top level (on a co-branded site's tab), or an empty search. */
  function reset(next: Mode) {
    mode = next;
    path = [];
    tab = startTab;
    input.value = '';
  }

  // ---------- Open / close (desktop, and G's takeover) ----------
  // G: the pane slides down from the header's bottom edge, clipped there. H: it slides out from under the sidebar.
  const paneIn = (): Keyframe[] => sidebar
    ? [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }]
    : [{ transform: 'translateY(-100%)', clipPath: 'inset(100% 0 0 0)' }, { transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' }];
  let closing = false;
  async function setOpen(next: boolean, closeDuration = '--motion-core-duration') {
    if (next === open) return;
    open = next;
    if (open) {
      closing = false;
      pane.getAnimations().forEach(a => a.cancel());
      fill();
      pane.hidden = false;
      pane.scrollTop = 0;
      if (!sidebar) document.documentElement.classList.add('menu-open'); // G compact: the header stays put, the page doesn't scroll
      focusAfterOpen();
      await play(pane, paneIn(), '--motion-core-duration', '--motion-core-easing');
    } else {
      closing = true;
      fill(); // the buttons drop their open state straight away
      await play(pane, [...paneIn()].reverse(), closeDuration, '--motion-core-easing');
      if (!closing) return; // reopened mid-close
      pane.hidden = true;
      if (!sidebar) document.documentElement.classList.remove('menu-open');
      path = [];
      closing = false;
    }
  }
  /** Search: the field takes focus as soon as the pane opens. */
  function focusAfterOpen() { if (mode === 'search') input.focus({ preventScroll: true }); }

  /** Menu or Search pressed: open the pane in that mode, swap to it, or close it if it's showing. */
  function press(next: Mode) {
    if (isCompact() && sidebar) { pressDrawer(next); return; }
    if (open && mode === next) { setOpen(false); return; }
    if (open) {
      reset(next);
      fill();
      slideContents(1);
      focusFirst();
      return;
    }
    reset(next);
    setOpen(true);
  }

  // ---------- Events ----------
  menuToggles.forEach(b => b.addEventListener('click', () => press('menu')));
  searchToggles.forEach(b => b.addEventListener('click', () => press('search')));

  /** Co-branded pages: swap between the site's sections and the top level. */
  function switchTab(next: MenuMode) {
    if (next === tab) return;
    tab = next;
    path = [];
    fill();
    slideContents(next === 'core' ? -1 : 1, true); // from the side of the chosen tab (UWA: left)
    list.querySelector<HTMLElement>('.menu-tab[aria-selected="true"]')?.focus();
  }
  tabArrowKeys(list, switchTab);

  // Drill down (or switch tabs)
  list.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-tab');
    if (t) { switchTab(t.dataset.switch as MenuMode); return; }
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn) return;
    path = [...path, btn.dataset.path!];
    fill();
    slideContents(1);
    pane.scrollTop = 0;
    focusFirst();
  });

  back.addEventListener('click', () => {
    const from = path[path.length - 1];
    path = path.slice(0, -1);
    fill();
    slideContents(-1);
    pane.scrollTop = 0;
    // Focus the item you came back from, so you can see where you were
    (list.querySelector<HTMLElement>(`button.menu-item[data-path="${CSS.escape(from)}"]`) ?? list.querySelector<HTMLElement>('.menu-item'))?.focus();
  });

  // Search: results as you type; Enter goes to the first one
  input.addEventListener('input', () => results());
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const first = list.querySelector<HTMLAnchorElement>('a.search-result');
    if (first) leave(first.href);
  });

  // Page links in the pane: slide the pane away, then go to the page
  let leaving = false;
  async function leave(url: string) {
    if (leaving) return;
    leaving = true;
    await (isCompact() && sidebar ? setDrawer(false, '--motion-menu-exit-duration') : setOpen(false, '--motion-menu-exit-duration'));
    window.location.href = url;
  }
  pane.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    leave(link.href);
  });
  window.addEventListener('pageshow', () => { leaving = false; });

  // ---------- H, compact: the drawer, with the pane on it ----------
  let drawer = false;
  async function setDrawer(next: boolean, closeDuration = '--motion-drawer-duration') {
    if (!sidebar || next === drawer) return;
    drawer = next;
    const frames = [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }];
    if (drawer) {
      [sidebar, pane].forEach(el => el.getAnimations().forEach(a => a.cancel()));
      sidebar.classList.add('is-open');
      if (scrim) scrim.hidden = false;
      document.documentElement.classList.add('menu-open');
      open = true;
      closing = false;
      fill();
      syncBar();
      pane.hidden = false;
      pane.scrollTop = 0;
      focusAfterOpen();
      await Promise.all([sidebar, pane].map(el => play(el, frames, '--motion-drawer-duration', '--motion-drawer-easing')));
    } else {
      open = false;
      fill();
      syncBar();
      const out = [...frames].reverse();
      await Promise.all([sidebar, pane].map(el => play(el, out, closeDuration, '--motion-drawer-easing')));
      if (drawer) return; // reopened mid-close
      resetAll();
    }
  }
  function syncBar() {
    barToggle?.setAttribute('aria-expanded', String(drawer && mode === 'menu'));
    barSearch?.setAttribute('aria-expanded', String(drawer && mode === 'search'));
  }
  function pressDrawer(next: Mode) {
    if (drawer && mode === next) { setDrawer(false); return; }
    reset(next);
    if (drawer) { fill(); syncBar(); slideContents(1); focusFirst(); return; }
    setDrawer(true);
  }
  barToggle?.addEventListener('click', () => pressDrawer('menu'));
  barSearch?.addEventListener('click', () => pressDrawer('search'));

  /** Close everything at once, without motion. */
  function resetAll() {
    drawer = false;
    if (sidebar) sidebar.classList.remove('is-open');
    if (scrim) scrim.hidden = true;
    document.documentElement.classList.remove('menu-open');
    [pane, ...(sidebar ? [sidebar] : [])].forEach(el => el.getAnimations().forEach(a => a.cancel()));
    open = false;
    closing = false;
    pane.hidden = true;
    path = [];
    fill();
    syncBar();
  }
  // Crossing between the compact and desktop layouts closes everything straight away
  onLayoutChange(() => resetAll());

  // Click anywhere outside the pane and the buttons closes the menu (H compact: outside the drawer)
  document.addEventListener('click', (e) => {
    const where = e.composedPath();
    if (isCompact() && sidebar) {
      if (!drawer) return;
      if (where.includes(sidebar) || where.includes(pane) || [barToggle, barSearch].some(b => b && where.includes(b))) return;
      setDrawer(false);
      return;
    }
    if (!open) return;
    if (where.includes(pane) || triggers.some(t => where.includes(t))) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (isCompact() && sidebar) {
      if (!drawer) return;
      const returnTo = mode === 'search' ? barSearch : barToggle;
      setDrawer(false);
      returnTo?.focus();
      return;
    }
    if (!open) return;
    const returnTo = (mode === 'search' ? searchToggles : menuToggles).find(b => b.offsetParent);
    setOpen(false);
    returnTo?.focus();
  });
}
