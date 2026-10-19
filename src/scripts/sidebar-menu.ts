/**
 * Sidebar menu behaviour (click only, no hover), for variants D and E.
 *
 * A drill-down pane opens to the right of the fixed sidebar. It shows one
 * level at a time: a heading (the chosen item, linking to its page) and that
 * item's children. Choosing a child that has children replaces the pane's
 * contents with the next level; a Back link steps up one level. All levels
 * are reachable.
 *   D (drilldown): the sidebar lists the top-level items. Choosing one opens
 *     the pane at its children; choosing it again closes the pane.
 *   E (menu-button): the sidebar has a Menu button. It opens the pane at the
 *     top-level items (no heading); choosing one drills down as in D.
 *
 * The menu always opens at the top, as on the homepage. Closes on: the
 * trigger again, Esc, or a click outside the pane and the trigger. Clicking a
 * page link slides the pane away first, then navigates.
 * Motion timings come from tokens.css (same tokens as the header variants).
 *
 * Co-branded site pages, behaviour option "Co-brand menu" = 2 (replaces core menu):
 *   D: the sidebar lists the site's sections (under two tabs, the site's
 *     abbreviation or name and UWA, then the site's name) in place of the
 *     top-level items; the UWA tab swaps them for the top level. Sections
 *     open the pane like top-level items. The sidebar starts on the site's list
 *     on every page load (CSS shows the right list before this script runs).
 *   E: Menu opens the pane on the site's sections, under the same tabs and
 *     site name; the tabs swap the pane between them and the top level.
 * Option 7 (alongside core menu):
 *   D: the sidebar list starts with the site's name and sections, then a
 *     divider and the top-level items. A section opens the pane at its pages.
 *   E: Menu opens the pane on the site's name and sections, above a divider
 *     and the normal top level.
 *
 * Compact layouts (mobile and tablet, src/breakpoints.ts): a top bar with a
 * hamburger replaces the sidebar's logos. The hamburger slides the sidebar in
 * from the left as a drawer, under the bar and over a scrim; it shows the
 * sidebar's contents as on desktop (D: search and the top-level items). The
 * drill-down pane opens over the drawer, sliding in from the right as a level
 * deeper, and always has Back: from its first level, Back slides it away to the
 * drawer again. E skips its Menu button step: the hamburger opens the drawer
 * with the pane already on it at the top level (no Back there, as the hamburger
 * closes it), and the pane drills down as on desktop. The hamburger
 * again, Esc or a tap outside the drawer closes everything; a page link closes
 * the drawer first, then navigates. Crossing between the compact and desktop
 * layouts closes the menu.
 */
import { indexTree, pagePath, cobrandTop, cobrandNode, type MenuNode, type CobrandData } from '../lib/menu-state';
import { getOption } from '../lib/options';
import { isCompact, onLayoutChange } from '../lib/breakpoints';
import { menuTabs, selectTab, tabArrowKeys, type MenuMode } from '../lib/menu-tabs';

const sidebar = document.querySelector<HTMLElement>('[data-sidebar]');
if (sidebar) init(sidebar);

function init(sidebar: HTMLElement) {
  const dataEl = document.querySelector<HTMLScriptElement>('[data-nav-data]')!;
  const { base, tree, cobrand } = JSON.parse(dataEl.textContent || '{}') as { base: string; tree: MenuNode[]; cobrand?: CobrandData };
  const currentPath = sidebar.dataset.currentPath || '';
  const menuButton = sidebar.dataset.menuLayout === 'menu-button'; // variant E
  const pane = document.querySelector<HTMLElement>('#drill-pane')!;
  const list = pane.querySelector<HTMLUListElement>('[data-drill-list]')!;
  const back = pane.querySelector<HTMLButtonElement>('[data-drill-back]')!;
  const arrowTpl = document.querySelector<HTMLTemplateElement>('[data-arrow]')!;
  const sideList = sidebar.querySelector<HTMLUListElement>('[data-sidebar-list]');   // D
  const toggle = sidebar.querySelector<HTMLButtonElement>('[data-menu-toggle]');      // E
  // D: the item lists (top level and, on co-branded pages, the site's list); E: the Menu button
  const sideTabs = sidebar.querySelector<HTMLElement>('[data-sidebar-tabs]'); // D, option 2
  const triggers: HTMLElement[] = sideList ? [...sidebar.querySelectorAll<HTMLElement>('.sidebar-list, [data-sidebar-tabs]')] : [toggle!];

  // Co-brand menu option 2: the site's sections stand in for the top level (see above)
  const option = cobrand ? getOption('cobrand-menu') : '';
  const replaces = option === '2';
  const alongside = option === '7';
  const cbTop = cobrand ? cobrandTop(cobrand) : [];
  const cbNode = cobrand ? cobrandNode(cobrand) : undefined;
  let mode: MenuMode = replaces ? 'cobrand' : 'core';
  const topLevel = () => (mode === 'cobrand' ? cbTop : tree);

  const byPath = indexTree([...tree, ...cbTop, ...(cbNode ? [cbNode] : [])]);
  const href = (p: string) => `${base}${p}/`;
  let open = false;
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
    el.append(label);
    // → on items that drill down, and on the heading (it links to that section's page)
    if (drills || heading) el.append(arrowTpl.content.cloneNode(true));
    li.append(el);
    return li;
  }

  function fill() {
    const target = path[path.length - 1];
    const node = target ? byPath.get(target) : undefined;
    list.replaceChildren();
    if (node) {
      list.append(row(node, true));
      for (const child of node.c) list.append(row(child));
      pane.setAttribute('aria-label', node.l);
    } else {
      // E: the top level (option 2: the site's sections, or the top level, under the tabs)
      if (replaces) list.append(...switchRows());
      if (alongside) {
        // Option 7: the site's block, then a divider and the University's top level
        list.append(siteTitleRow());
        for (const sec of cbTop) list.append(row(sec));
        list.append(groupDivider());
      }
      for (const top of topLevel()) list.append(row(top));
      pane.setAttribute('aria-label', mode === 'cobrand' ? `${cobrand!.l} menu` : 'Main menu');
    }
    // D starts the pane at a top-level item's children, so Back appears from the second level.
    // Compact D: always, as the pane covers the drawer (Back from the first level returns to it).
    back.hidden = menuButton ? path.length === 0 : !isCompact() && path.length <= 1;
    // D: mark the open top-level item in the sidebar
    sidebar.querySelectorAll<HTMLElement>('.sidebar-item').forEach(item => {
      const on = open && item.dataset.path === path[0];
      item.classList.toggle('is-open', on);
      if (item.tagName === 'BUTTON') item.setAttribute('aria-expanded', String(on));
    });
    toggle?.setAttribute('aria-expanded', String(open));
  }

  /** E, option 2: tabs for the site's menu and the top level (src/lib/menu-tabs.ts), and the site's name. */
  function switchRows(): HTMLLIElement[] {
    const li = document.createElement('li');
    li.append(menuTabs(cobrand!.s, cobrand!.l, mode));
    return mode === 'cobrand' ? [li, siteTitleRow()] : [li];
  }

  /** The co-branded site's name, linking to its home (options 2 and 7). */
  function siteTitleRow(): HTMLLIElement {
    const li = document.createElement('li');
    const title = document.createElement('a');
    title.className = 'menu-item menu-site-title';
    title.href = href(cobrand!.h);
    if (cobrand!.h === currentPath) title.setAttribute('aria-current', 'page');
    const label = document.createElement('span');
    label.className = 'menu-item-label';
    label.textContent = cobrand!.l;
    title.append(label);
    li.append(title);
    return li;
  }

  /** A divider between the site's items and the University's top level (option 7 in E). */
  function groupDivider(): HTMLLIElement {
    const li = document.createElement('li');
    li.setAttribute('role', 'separator');
    const el = document.createElement('span');
    el.className = 'menu-group-divider';
    li.append(el);
    return li;
  }

  /** Option 2: swap between the site's menu and the top level (D: the sidebar list; E: the pane). */
  function switchMode(next: MenuMode) {
    if (next === mode) return;
    mode = next;
    if (sideList) {
      sidebar.dataset.mode = next;
      if (sideTabs) { selectTab(sideTabs, next); sideTabs.querySelector<HTMLElement>('[aria-selected="true"]')?.focus(); }
      if (open) setOpen(false);
    } else {
      path = [];
      fill();
      slideContents(next === 'core' ? 1 : -1, true);
      list.querySelector<HTMLElement>('.menu-tab[aria-selected="true"]')?.focus();
    }
  }

  /** Slide the pane's contents in from the right (deeper) or the left (Back). `keepTabs`: option 2's tabs stay put. */
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
    list.querySelector<HTMLElement>('.menu-item')?.focus();
  }

  // ---------- Open / close ----------
  // Desktop: the pane slides out from under the sidebar. Compact: it slides in from the right
  // over the drawer, clipped to the drawer's width so it never shows over the page.
  const paneIn = (): [Keyframe[], string, string] => isCompact()
    ? [[{ transform: 'translateX(100%)', clipPath: 'inset(0 100% 0 0)' }, { transform: 'translateX(0)', clipPath: 'inset(0 0 0 0)' }], '--motion-layer-duration', '--motion-layer-easing']
    : [[{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }], '--motion-core-duration', '--motion-core-easing'];
  let closing = false;
  async function setOpen(next: boolean, closeDuration?: string) {
    if (next === open) return;
    open = next;
    const [frames, duration, easing] = paneIn();
    if (open) {
      closing = false;
      pane.getAnimations().forEach(a => a.cancel());
      fill();
      pane.hidden = false;
      pane.scrollTop = 0;
      await play(pane, frames, duration, easing);
    } else {
      closing = true;
      fill(); // drop the sidebar's open marker straight away
      await play(pane, [...frames].reverse(), closeDuration ?? duration, easing);
      if (!closing) return; // reopened mid-close
      pane.hidden = true;
      path = [];
      closing = false;
    }
  }

  // ---------- Events ----------
  // D, option 2: the tabs switch the sidebar between the site's list and the top level
  sideTabs?.querySelectorAll<HTMLButtonElement>('.menu-tab').forEach(b =>
    b.addEventListener('click', () => switchMode(b.dataset.switch as MenuMode)));
  if (sideTabs) tabArrowKeys(sideTabs, switchMode);
  tabArrowKeys(list, switchMode); // E

  // D: a top-level item (or a co-branded site's section) opens the pane at its children; the open one closes it
  if (sideList) sidebar.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.sidebar-item');
    if (!btn) return;
    const p = btn.dataset.path!;
    if (open && path[0] === p) { setOpen(false); return; }
    const wasOpen = open;
    path = [p];
    if (wasOpen) { fill(); slideContents(1); } else setOpen(true);
  });

  // E: the Menu button opens the pane at the top level, or closes it
  toggle?.addEventListener('click', () => {
    if (open) { setOpen(false); return; }
    path = [];
    mode = replaces ? 'cobrand' : 'core'; // option 2: start on the co-branded site's menu
    setOpen(true);
  });

  // Drill down (E, option 2: or switch menus)
  list.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-tab');
    if (tab) { switchMode(tab.dataset.switch as MenuMode); return; }
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn) return;
    path = [...path, btn.dataset.path!];
    fill();
    slideContents(1);
    focusFirst();
  });

  back.addEventListener('click', () => {
    // Compact D, at the pane's first level: slide the pane away, back to the drawer
    if (isCompact() && !menuButton && path.length <= 1) {
      const returnTo = sidebar.querySelector<HTMLElement>(`.sidebar-item[data-path="${CSS.escape(path[0] ?? '')}"]`);
      setOpen(false);
      returnTo?.focus();
      return;
    }
    path = path.slice(0, -1);
    fill();
    slideContents(-1);
    focusFirst();
  });

  // Page links in the pane: slide the pane away, then go to the page
  let leaving = false;
  pane.addEventListener('click', async (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a.menu-item');
    if (!link) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    await (isCompact() ? setDrawer(false, '--motion-menu-exit-duration') : setOpen(false, '--motion-menu-exit-duration'));
    window.location.href = link.href;
  });
  window.addEventListener('pageshow', () => { leaving = false; });

  // ---------- Compact: the drawer ----------
  const barToggle = document.querySelector<HTMLButtonElement>('[data-drawer-toggle]');
  const scrim = document.querySelector<HTMLElement>('[data-drawer-scrim]');
  let drawer = false;
  async function setDrawer(next: boolean, closeDuration = '--motion-drawer-duration') {
    if (next === drawer) return;
    drawer = next;
    barToggle?.setAttribute('aria-expanded', String(drawer));
    const frames = [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }];
    if (drawer) {
      sidebar.getAnimations().forEach(a => a.cancel());
      sidebar.classList.add('is-open');
      if (scrim) scrim.hidden = false;
      document.documentElement.classList.add('menu-open');
      sidebar.scrollTop = 0;
      if (menuButton) {
        // E: the pane is already on the drawer at the top level, and slides in with it
        path = [];
        mode = replaces ? 'cobrand' : 'core';
        open = true;
        closing = false;
        pane.getAnimations().forEach(a => a.cancel());
        fill();
        pane.hidden = false;
        pane.scrollTop = 0;
        await Promise.all([sidebar, pane].map(el => play(el, frames, '--motion-drawer-duration', '--motion-drawer-easing')));
        return;
      }
      await play(sidebar, frames, '--motion-drawer-duration', '--motion-drawer-easing');
    } else {
      const out = [...frames].reverse();
      const jobs = [play(sidebar, out, closeDuration, '--motion-drawer-easing')];
      if (open) jobs.push(play(pane, out, closeDuration, '--motion-drawer-easing')); // the pane leaves with the drawer
      await Promise.all(jobs);
      if (drawer) return; // reopened mid-close
      resetDrawer();
    }
  }
  /** Close the drawer and the pane at once, without motion. */
  function resetDrawer() {
    drawer = false;
    barToggle?.setAttribute('aria-expanded', 'false');
    sidebar.classList.remove('is-open');
    if (scrim) scrim.hidden = true;
    document.documentElement.classList.remove('menu-open');
    [sidebar, pane].forEach(el => el.getAnimations().forEach(a => a.cancel()));
    open = false;
    closing = false;
    pane.hidden = true;
    path = [];
    fill();
  }
  barToggle?.addEventListener('click', () => setDrawer(!drawer));
  document.querySelector<HTMLButtonElement>('[data-bar-search]')?.addEventListener('click', () => {
    window.alert('Search is not available in this prototype.');
  });
  // Page links in the drawer itself (D: items without children; E: shortcuts; the site's name): close it first
  sidebar.addEventListener('click', async (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!link || !drawer) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    await setDrawer(false, '--motion-menu-exit-duration');
    window.location.href = link.href;
  });
  // Crossing between the compact and desktop layouts closes everything straight away
  onLayoutChange(() => resetDrawer());

  // Click anywhere outside the pane and the trigger closes the menu (compact: outside the drawer closes the drawer)
  document.addEventListener('click', (e) => {
    if (isCompact()) {
      if (!drawer) return;
      const where = e.composedPath();
      if (where.includes(sidebar) || where.includes(pane) || (barToggle && where.includes(barToggle))) return;
      setDrawer(false);
      return;
    }
    if (!open) return;
    const where = e.composedPath();
    if (where.includes(pane) || triggers.some(t => where.includes(t))) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isCompact() && drawer) { setDrawer(false); barToggle?.focus(); return; }
    if (e.key !== 'Escape' || !open) return;
    // D: the sidebar item that opened the pane (the visible one: a site's section can be in both lists)
    const returnTo = sideList ? [...sidebar.querySelectorAll<HTMLElement>(`.sidebar-item[data-path="${CSS.escape(path[0] ?? '')}"]`)].find(el => el.offsetParent) : toggle;
    setOpen(false);
    returnTo?.focus();
  });

  // Search field: not wired up in this prototype
  sidebar.querySelector<HTMLFormElement>('[data-sidebar-search]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.alert('Search is not available in this prototype.');
  });
}
