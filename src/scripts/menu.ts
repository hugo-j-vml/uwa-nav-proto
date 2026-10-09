/**
 * Menu behaviour (click only, no hover).
 *
 * State is an "open path": the chain of items whose sub-menus are open,
 * e.g. ["study", "study/study-areas"].
 *   - Core pane: the top-level items, with the open path nested inline
 *     under its top-level item (indented one step per level).
 *   - Dynamic pane: the children of the last item in the open path.
 *   - Selected: only the last item in the open path (its sub-menu is showing).
 *
 * Opening the menu on a page deep in the IA starts with that page's parents
 * open, so the current section is nested and selected.
 *
 * Motion (timings in tokens.css):
 *   - the whole menu slides down from the header's bottom edge on open, and back up on close
 *     (clipped at that edge, so it also works when the header is transparent)
 *   - when the sub-menu changes, the old one retreats left under the core pane
 *     and the new one slides back out
 *   - parents nested in / removed from the core pane open up or close up smoothly
 *
 * Closes on: Menu button, Esc, or a click anywhere outside the menu panes.
 * Whole rows are click targets. Items with children are <button>s that open
 * their sub-menu; items without children are links to their page.
 */

type MenuNode = { l: string; p: string; c: MenuNode[] };

const header = document.querySelector<HTMLElement>('.primary-nav-header');
if (header) init(header);

function init(header: HTMLElement) {
  const dataEl = header.querySelector<HTMLScriptElement>('[data-nav-data]')!;
  const { base, tree } = JSON.parse(dataEl.textContent || '{}') as { base: string; tree: MenuNode[] };
  const currentPath = header.dataset.currentPath || '';
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]')!;
  const panes = header.querySelector<HTMLElement>('#menu-panes')!;
  const coreList = header.querySelector<HTMLUListElement>('[data-core-list]')!;
  const dynamicPane = header.querySelector<HTMLElement>('.dynamic-pane')!;
  const dynamicList = header.querySelector<HTMLUListElement>('[data-dynamic-list]')!;
  const arrowTpl = header.querySelector<HTMLTemplateElement>('[data-arrow]')!;
  const search = header.querySelector<HTMLButtonElement>('[data-search]');

  const byPath = new Map<string, MenuNode>();
  (function index(list: MenuNode[]) { for (const n of list) { byPath.set(n.p, n); index(n.c); } })(tree);

  const href = (p: string) => `${base}${p}/`;
  let open = false;
  let path: string[] = [];
  let shownSubmenu = '';  // which item's children the dynamic pane is showing ('' = hidden)
  let seq = 0;            // guards against overlapping sub-menu animations

  // ---------- Motion helpers ----------
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stacked = window.matchMedia('(max-width: 1024px)'); // interim small-screen layout: panes stack
  function token(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
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
  function row(node: MenuNode, opts: { depth?: number; heading?: boolean; core?: boolean } = {}): HTMLLIElement {
    const li = document.createElement('li');
    const hasChildren = node.c.length > 0 && !opts.heading;
    const el = hasChildren ? document.createElement('button') : document.createElement('a');
    el.className = 'menu-item' + (opts.heading ? ' dynamic-heading' : '');
    el.dataset.path = node.p;
    if (opts.depth) el.style.setProperty('--depth', String(opts.depth));
    if (hasChildren) {
      (el as HTMLButtonElement).type = 'button';
      el.setAttribute('aria-expanded', String(path.includes(node.p)));
      if (node.p === path[path.length - 1]) el.classList.add('is-selected');
    } else {
      (el as HTMLAnchorElement).href = href(node.p);
    }
    if (node.p === currentPath) {
      el.setAttribute('aria-current', 'page');
      // Highlight the page you're on in the sub-menu; in the core pane only when nothing
      // else is selected there, so the core pane never shows two black blocks
      if (!opts.heading && (!opts.core || path.length === 0)) el.classList.add('is-current');
    }
    const label = document.createElement('span');
    label.className = 'menu-item-label';
    label.textContent = node.l;
    el.append(label, arrowTpl.content.cloneNode(true));
    li.append(el);
    return li;
  }

  function renderCore(animate = false) {
    // Snapshot the rows on screen (ignoring any rows still collapsing from a previous change)
    const oldRows = ([...coreList.children] as HTMLLIElement[]).filter(li => !li.dataset.ghost);
    const before = oldRows.map(li => (li.firstElementChild as HTMLElement).dataset.path!);
    coreList.replaceChildren();
    for (const top of tree) {
      coreList.append(row(top, { core: true }));
      if (path[0] === top.p) {
        path.slice(1).forEach((p, i) => { const n = byPath.get(p); if (n) coreList.append(row(n, { depth: i + 1, core: true })); });
      }
    }
    if (animate) animateRowChanges(oldRows, before);
  }

  /** Clip a row while its height animates, keeping the selected block's side bleed visible. */
  function clipRow(li: HTMLLIElement, on: boolean) {
    li.style.overflow = on ? 'clip' : '';
    if (on) li.style.setProperty('overflow-clip-margin', 'var(--item-selected-bleed-x)');
    else li.style.removeProperty('overflow-clip-margin');
  }

  /**
   * Smooth changes to the nested rows in the core pane:
   *   - added rows open up (items below glide down) while their text and arrow slide down into place
   *   - removed rows stay briefly as non-interactive "ghosts" that close up while their text slides up and fades
   * When one row replaces another, the two happen together, so the list height changes smoothly.
   */
  function animateRowChanges(oldRows: HTMLLIElement[], before: string[]) {
    const duration = ms('--motion-core-item-duration');
    if (!duration) return;
    const easing = token('--motion-core-item-easing') || 'ease-out';
    const offset = token('--motion-core-item-offset') || '12px';
    const gap = parseFloat(getComputedStyle(coreList).rowGap) || 0;
    const rows = [...coreList.children] as HTMLLIElement[];
    const pathOf = (li: HTMLLIElement) => (li.firstElementChild as HTMLElement).dataset.path!;
    const after = new Set(rows.map(pathOf));
    const textFrames = (dir: 1 | -1): Keyframe[] => dir === 1
      ? [{ transform: `translateY(-${offset})`, opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }]
      : [{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(-${offset})`, opacity: 0 }];

    // Removed rows: re-insert the old row as a ghost where it was, then close it up
    oldRows.forEach((oldLi, i) => {
      if (after.has(before[i])) return;
      const nextKept = before.slice(i + 1).find(p => after.has(p));
      const anchor = nextKept ? rows.find(li => pathOf(li) === nextKept) ?? null : null;
      const ghost = oldLi; // detached by replaceChildren, safe to reuse
      ghost.dataset.ghost = 'true';
      ghost.setAttribute('aria-hidden', 'true');
      ghost.style.pointerEvents = 'none';
      const item = ghost.firstElementChild as HTMLElement;
      item.removeAttribute('data-path');
      item.tabIndex = -1;
      coreList.insertBefore(ghost, anchor);
      const h = ghost.getBoundingClientRect().height;
      clipRow(ghost, true);
      for (const part of item.children as HTMLCollectionOf<HTMLElement>) {
        part.animate(textFrames(-1), { duration, easing, fill: 'forwards' });
      }
      ghost.animate([{ height: `${h}px`, marginTop: '0px' }, { height: '0px', marginTop: `${-gap}px` }],
        { duration, easing, fill: 'forwards' }).finished.then(() => ghost.remove(), () => {});
    });

    // Added rows: open up and slide the text down into place
    rows.forEach(li => {
      if (before.includes(pathOf(li))) return;
      const item = li.firstElementChild as HTMLElement;
      for (const part of item.children as HTMLCollectionOf<HTMLElement>) {
        part.animate(textFrames(1), { duration, easing, fill: 'backwards' });
      }
      const h = li.getBoundingClientRect().height;
      clipRow(li, true);
      li.animate([{ height: '0px', marginTop: `${-gap}px` }, { height: `${h}px`, marginTop: '0px' }],
        { duration, easing }).finished.then(() => clipRow(li, false), () => {});
    });
  }

  function fillDynamic(target: string) {
    const current = byPath.get(target);
    dynamicList.replaceChildren();
    if (!current) { dynamicPane.hidden = true; return; }
    dynamicList.append(row(current, { heading: true }));
    for (const child of current.c) dynamicList.append(row(child));
    dynamicPane.setAttribute('aria-label', current.l);
    dynamicPane.hidden = false;
  }

  /** Update the dynamic pane, sliding the old sub-menu out and the new one in. */
  async function renderDynamic(animate: boolean) {
    const target = path[path.length - 1] ?? '';
    const mine = ++seq; // any earlier, still-running update is now stale
    if (target === shownSubmenu) {
      // Same sub-menu as on screen: stop any slide in progress and refresh in place
      dynamicPane.getAnimations().forEach(a => a.cancel());
      fillDynamic(target);
      return;
    }
    const slide = animate && !stacked.matches;
    // If a slide is already running (fast clicking), drop it and go straight to the new sub-menu
    const busy = dynamicPane.getAnimations().length > 0;
    dynamicPane.getAnimations().forEach(a => a.cancel());
    if (slide && shownSubmenu && !busy) {
      await play(dynamicPane, [{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }],
        '--motion-submenu-out-duration', '--motion-submenu-out-easing');
      if (mine !== seq) return; // a newer click has taken over
    }
    shownSubmenu = target;
    fillDynamic(target);
    if (slide && target) {
      await play(dynamicPane, [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
        '--motion-submenu-in-duration', '--motion-submenu-in-easing');
    }
  }

  function render(animate: boolean) {
    renderCore(animate);
    return renderDynamic(animate);
  }

  /** The open path for the page we're on: its ancestors, plus itself if it has children. */
  function pathForCurrentPage(): string[] {
    if (!currentPath || !byPath.has(currentPath)) return [];
    const parts = currentPath.split('/');
    const result: string[] = [];
    for (let i = 1; i <= parts.length; i++) {
      const p = parts.slice(0, i).join('/');
      const n = byPath.get(p);
      if (n && n.c.length) result.push(p);
    }
    return result;
  }

  // ---------- Open / close ----------
  let closing = false;
  async function setOpen(next: boolean) {
    if (next === open) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    seq++; // cancel any sub-menu animation in flight
    if (open) {
      closing = false;
      path = pathForCurrentPage();
      shownSubmenu = '';
      dynamicPane.getAnimations().forEach(a => a.cancel());
      renderCore();
      await renderDynamic(false);
      panes.hidden = false;
      await play(panes, [{ transform: 'translateY(-100%)', clipPath: 'inset(100% 0 0 0)' }, { transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' }],
        '--motion-core-duration', '--motion-core-easing');
    } else {
      closing = true;
      await play(panes, [{ transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' }, { transform: 'translateY(-100%)', clipPath: 'inset(100% 0 0 0)' }],
        '--motion-core-duration', '--motion-core-easing');
      if (!closing) return; // reopened mid-close
      panes.hidden = true;
      path = [];
      shownSubmenu = '';
      closing = false;
    }
  }

  function focusPath(p: string) {
    coreList.querySelector<HTMLElement>(`[data-path="${CSS.escape(p)}"]`)?.focus();
  }

  // ---------- Events ----------
  toggle.addEventListener('click', () => setOpen(!open));

  coreList.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn) return;
    const p = btn.dataset.path!;
    const depth = p.split('/').length - 1;
    // Clicking the selected item closes its sub-menu; any other item opens its own.
    path = p === path[path.length - 1] ? path.slice(0, depth) : [...path.slice(0, depth), p];
    render(true);
    focusPath(p);
  });

  dynamicList.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn) return;
    const p = btn.dataset.path!;
    path = [...path, p];
    render(true);
    focusPath(p);
  });

  // Click anywhere outside the menu panes (and not on the Menu button) closes the menu
  document.addEventListener('click', (e) => {
    if (!open) return;
    // composedPath() is fixed at click time, so it still works after a click re-renders the menu
    const where = e.composedPath();
    if (where.includes(panes) || where.includes(toggle)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) { setOpen(false); toggle.focus(); }
  });

  search?.addEventListener('click', () => {
    window.alert('Search is not available in this prototype.');
  });
}
