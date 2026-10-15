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
 *   D: the sidebar lists the site's sections (under a "UWA main menu" switch and
 *     the site's name) in place of the top-level items; the switch swaps them,
 *     and the top-level list then has an "<site> menu" switch back. Sections
 *     open the pane like top-level items. The sidebar starts on the site's list
 *     on every page load (CSS shows the right list before this script runs).
 *   E: Menu opens the pane on the site's sections, under the same switch and
 *     site name; the switch swaps the pane to the top level and back.
 * Option 7 (alongside core menu):
 *   D: the site is an extra first item in the sidebar list; it opens the pane
 *     on the site's sections, which drill down to their pages.
 *   E: Menu opens the pane on the site's name and sections, above a "University
 *     of Western Australia" heading and the normal top level.
 */
import { indexTree, pagePath, cobrandTop, cobrandNode, type MenuNode, type CobrandData } from '../lib/menu-state';
import { getOption } from '../lib/options';

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
  const triggers: HTMLElement[] = sideList ? [...sidebar.querySelectorAll<HTMLElement>('.sidebar-list, [data-sidebar-switch]')] : [toggle!];

  // Co-brand menu option 2: the site's sections stand in for the top level (see above)
  const option = cobrand ? getOption('cobrand-menu') : '';
  const replaces = option === '2';
  const alongside = option === '7';
  const cbTop = cobrand ? cobrandTop(cobrand) : [];
  const cbNode = cobrand ? cobrandNode(cobrand) : undefined; // option 7 in D: the sidebar's extra item
  let mode: 'core' | 'cobrand' = replaces ? 'cobrand' : 'core';
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
      // E: the top level (option 2: the site's sections, or the top level, under the switch)
      if (replaces) list.append(...switchRows());
      if (alongside) {
        // Option 7: the site's block, then the University's top level under its own heading
        list.append(siteTitleRow());
        for (const sec of cbTop) list.append(row(sec));
        list.append(groupHeading('University of Western Australia'));
      }
      for (const top of topLevel()) list.append(row(top));
      pane.setAttribute('aria-label', mode === 'cobrand' ? `${cobrand!.l} menu` : 'Main menu');
    }
    // D starts the pane at a top-level item's children, so Back appears from the second level
    back.hidden = menuButton ? path.length === 0 : path.length <= 1;
    // D: mark the open top-level item in the sidebar
    sidebar.querySelectorAll<HTMLElement>('.sidebar-item').forEach(item => {
      const on = open && item.dataset.path === path[0];
      item.classList.toggle('is-open', on);
      if (item.tagName === 'BUTTON') item.setAttribute('aria-expanded', String(on));
    });
    toggle?.setAttribute('aria-expanded', String(open));
  }

  /** E, option 2: the switch between the site's menu and the top level, and the site's name. */
  function switchRows(): HTMLLIElement[] {
    const toCore = mode === 'cobrand';
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-switch' + (toCore ? '' : ' is-back');
    btn.dataset.switch = toCore ? 'core' : 'cobrand';
    const label = document.createElement('span');
    label.textContent = toCore ? 'UWA main menu' : `${cobrand!.l} menu`;
    btn.append(label, arrowTpl.content.cloneNode(true));
    li.append(btn);
    if (!toCore) return [li];
    return [li, siteTitleRow()];
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

  /** A small heading between groups of items (option 7 in E). Not interactive. */
  function groupHeading(text: string): HTMLLIElement {
    const li = document.createElement('li');
    const el = document.createElement('span');
    el.className = 'menu-group-heading';
    el.textContent = text;
    li.append(el);
    return li;
  }

  /** Option 2: swap between the site's menu and the top level (D: the sidebar list; E: the pane). */
  function switchMode(next: 'core' | 'cobrand') {
    mode = next;
    if (sideList) {
      sidebar.dataset.mode = next;
      if (open) setOpen(false);
      const first = sidebar.querySelector<HTMLElement>(next === 'core' ? '[data-sidebar-switch="cobrand"]' : '[data-sidebar-switch="core"]');
      first?.focus();
    } else {
      path = [];
      fill();
      slideContents(next === 'core' ? 1 : -1);
      list.querySelector<HTMLElement>('.menu-switch')?.focus();
    }
  }

  /** Slide the pane's contents in from the right (deeper) or the left (Back). */
  function slideContents(dir: 1 | -1) {
    const duration = ms('--motion-submenu-in-duration');
    if (!duration) return;
    const offset = token('--motion-drill-offset') || '24px';
    const from = dir === 1 ? offset : `-${offset}`;
    list.getAnimations().forEach(a => a.cancel());
    list.animate([{ transform: `translateX(${from})`, opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }],
      { duration, easing: token('--motion-submenu-in-easing') || 'ease-out' });
  }

  function focusFirst() {
    list.querySelector<HTMLElement>('.menu-item')?.focus();
  }

  // ---------- Open / close ----------
  let closing = false;
  async function setOpen(next: boolean, closeDuration = '--motion-core-duration') {
    if (next === open) return;
    open = next;
    if (open) {
      closing = false;
      pane.getAnimations().forEach(a => a.cancel());
      fill();
      pane.hidden = false;
      await play(pane, [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
        '--motion-core-duration', '--motion-core-easing');
    } else {
      closing = true;
      fill(); // drop the sidebar's open marker straight away
      await play(pane, [{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }],
        closeDuration, '--motion-core-easing');
      if (!closing) return; // reopened mid-close
      pane.hidden = true;
      path = [];
      closing = false;
    }
  }

  // ---------- Events ----------
  // D, option 2: the sidebar switches between the site's list and the top level
  sidebar.querySelectorAll<HTMLButtonElement>('[data-sidebar-switch]').forEach(b =>
    b.addEventListener('click', () => switchMode(b.dataset.sidebarSwitch as 'core' | 'cobrand')));

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
    const sw = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-switch');
    if (sw) { switchMode(sw.dataset.switch as 'core' | 'cobrand'); return; }
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn) return;
    path = [...path, btn.dataset.path!];
    fill();
    slideContents(1);
    focusFirst();
  });

  back.addEventListener('click', () => {
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
    await setOpen(false, '--motion-menu-exit-duration');
    window.location.href = link.href;
  });
  window.addEventListener('pageshow', () => { leaving = false; });

  // Click anywhere outside the pane and the trigger closes the menu
  document.addEventListener('click', (e) => {
    if (!open) return;
    const where = e.composedPath();
    if (where.includes(pane) || triggers.some(t => where.includes(t))) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !open) return;
    const returnTo = sideList ? sidebar.querySelector<HTMLElement>(`.sidebar-item[data-path="${CSS.escape(path[0] ?? '')}"]`) : toggle;
    setOpen(false);
    returnTo?.focus();
  });

  // Search field: not wired up in this prototype
  sidebar.querySelector<HTMLFormElement>('[data-sidebar-search]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.alert('Search is not available in this prototype.');
  });
}
