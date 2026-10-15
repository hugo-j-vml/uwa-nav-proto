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
 */
import { indexTree, type MenuNode } from '../lib/menu-state';

const sidebar = document.querySelector<HTMLElement>('[data-sidebar]');
if (sidebar) init(sidebar);

function init(sidebar: HTMLElement) {
  const dataEl = document.querySelector<HTMLScriptElement>('[data-nav-data]')!;
  const { base, tree } = JSON.parse(dataEl.textContent || '{}') as { base: string; tree: MenuNode[] };
  const currentPath = sidebar.dataset.currentPath || '';
  const menuButton = sidebar.dataset.menuLayout === 'menu-button'; // variant E
  const pane = document.querySelector<HTMLElement>('#drill-pane')!;
  const list = pane.querySelector<HTMLUListElement>('[data-drill-list]')!;
  const back = pane.querySelector<HTMLButtonElement>('[data-drill-back]')!;
  const arrowTpl = document.querySelector<HTMLTemplateElement>('[data-arrow]')!;
  const sideList = sidebar.querySelector<HTMLUListElement>('[data-sidebar-list]');   // D
  const toggle = sidebar.querySelector<HTMLButtonElement>('[data-menu-toggle]');      // E
  const trigger = (sideList ?? toggle)!;

  const byPath = indexTree(tree);
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
    else (el as HTMLAnchorElement).href = href(node.p);
    if (node.p === currentPath) el.setAttribute('aria-current', 'page');
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
      for (const top of tree) list.append(row(top)); // E: the top level
      pane.setAttribute('aria-label', 'Main menu');
    }
    // D starts the pane at a top-level item's children, so Back appears from the second level
    back.hidden = menuButton ? path.length === 0 : path.length <= 1;
    // D: mark the open top-level item in the sidebar
    sideList?.querySelectorAll<HTMLElement>('.sidebar-item').forEach(item => {
      const on = open && item.dataset.path === path[0];
      item.classList.toggle('is-open', on);
      if (item.tagName === 'BUTTON') item.setAttribute('aria-expanded', String(on));
    });
    toggle?.setAttribute('aria-expanded', String(open));
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
  // D: a top-level item opens the pane at its children; the open one closes it
  sideList?.addEventListener('click', (e) => {
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
    setOpen(true);
  });

  // Drill down
  list.addEventListener('click', (e) => {
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
    if (where.includes(pane) || where.includes(trigger)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !open) return;
    const returnTo = sideList?.querySelector<HTMLElement>(`[data-path="${CSS.escape(path[0] ?? '')}"]`) ?? toggle;
    setOpen(false);
    returnTo?.focus();
  });

  // Search field: not wired up in this prototype
  sidebar.querySelector<HTMLFormElement>('[data-sidebar-search]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.alert('Search is not available in this prototype.');
  });
}
