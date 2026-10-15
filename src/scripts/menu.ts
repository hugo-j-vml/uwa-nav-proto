/**
 * Menu behaviour (click only, no hover), for the header variants:
 *   A (core-expanding): described below.
 *   B (panels): the core pane only ever lists the top-level items, with the
 *     chosen one selected. The white pane lists that section's items as an
 *     accordion: a parent opens inline (↓ arrow, children indented beneath it),
 *     one branch open at a time; clicking an open parent closes it. No heading
 *     and no → arrows. Same motion, closing and reopen behaviour as A.
 *   C (columns): the same static core pane as B. The chosen section's items
 *     (L2) fill panel 1; a chosen L2 opens its items (L3) in panel 2, which
 *     slides out to the right from under panel 1. One level per panel; L3
 *     items are always links. The open item in the core pane and panel 1 gets
 *     a → after its label. Clicking an open item closes it.
 *   B and C have no black highlights (no selected or current-page block).
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
 * Clicking a page link in the menu slides the menu away first, then navigates;
 * the page change itself is a cross-fade (CSS view transitions, components.css).
 * Whole rows are click targets. Items with children are <button>s that open
 * their sub-menu; items without children are links to their page.
 */

import { indexTree, pathForPage, choose, toggle as toggleBranch, selected, type MenuNode } from '../lib/menu-state';

const header = document.querySelector<HTMLElement>('.primary-nav-header');
if (header) init(header);

function init(header: HTMLElement) {
  const dataEl = header.querySelector<HTMLScriptElement>('[data-nav-data]')!;
  const { base, tree } = JSON.parse(dataEl.textContent || '{}') as { base: string; tree: MenuNode[] };
  const currentPath = header.dataset.currentPath || '';
  const layout = header.dataset.menuLayout;
  const accordion = layout === 'panels'; // variant B
  const columns = layout === 'columns';  // variant C
  const highlight = !accordion && !columns; // black selected / current-page blocks: A only
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]')!;
  const panes = header.querySelector<HTMLElement>('#menu-panes')!;
  const coreList = header.querySelector<HTMLUListElement>('[data-core-list]')!;
  const dynamicPane = header.querySelector<HTMLElement>('.dynamic-pane')!;
  const dynamicList = header.querySelector<HTMLUListElement>('[data-dynamic-list]')!;
  const panel2 = header.querySelector<HTMLElement>('.panel-2');            // C only
  const panel2List = header.querySelector<HTMLUListElement>('[data-panel2-list]');
  const arrowTpl = header.querySelector<HTMLTemplateElement>('[data-arrow]')!;
  const search = header.querySelector<HTMLButtonElement>('[data-search]');

  const byPath = indexTree(tree);

  const href = (p: string) => `${base}${p}/`;
  let open = false;
  let path: string[] = [];
  /** A pane whose contents slide out and back in when they change. */
  type Slot = { pane: HTMLElement; list: HTMLUListElement; shown: string; seq: number; fill: (target: string) => void };

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
  function row(node: MenuNode, opts: { depth?: number; heading?: boolean; core?: boolean; leaf?: boolean } = {}): HTMLLIElement {
    const li = document.createElement('li');
    const hasChildren = node.c.length > 0 && !opts.heading && !opts.leaf;
    const el = hasChildren ? document.createElement('button') : document.createElement('a');
    el.className = 'menu-item' + (opts.heading ? ' dynamic-heading' : '');
    el.dataset.path = node.p;
    if (opts.depth) el.style.setProperty('--depth', String(opts.depth));
    if (hasChildren) {
      (el as HTMLButtonElement).type = 'button';
      el.setAttribute('aria-expanded', String(path.includes(node.p)));
      // A: the item whose sub-menu is showing. B: only the chosen top-level item, in the core pane.
      if (highlight && node.p === selected(path)) el.classList.add('is-selected');
    } else {
      (el as HTMLAnchorElement).href = href(node.p);
    }
    if (node.p === currentPath) {
      el.setAttribute('aria-current', 'page');
      // Highlight the page you're on in the sub-menu; in the core pane only when nothing
      // else is selected there, so the core pane never shows two black blocks
      if (highlight && !opts.heading && (!opts.core || path.length === 0)) el.classList.add('is-current');
    }
    const label = document.createElement('span');
    label.className = 'menu-item-label';
    label.textContent = node.l;
    el.append(label);
    if (highlight) el.append(arrowTpl.content.cloneNode(true));
    else if (hasChildren && path.includes(node.p) && (columns || !opts.core)) {
      // B: an open parent in the white pane gets a ↓ next to its label.
      // C: the open item in the core pane and panel 1 gets a →. Nothing else has an arrow.
      const arrow = arrowTpl.content.cloneNode(true) as DocumentFragment;
      arrow.querySelector('svg')?.classList.add(columns ? 'is-open' : 'is-down');
      el.append(arrow);
    }
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
      if (highlight && path[0] === top.p) {
        path.slice(1).forEach((p, i) => { const n = byPath.get(p); if (n) coreList.append(row(n, { depth: i + 1, core: true })); });
      }
    }
    if (animate) animateRowChanges(coreList, oldRows, before);
  }

  /** Clip a row while its height animates, keeping the selected block's side bleed visible. */
  function clipRow(li: HTMLLIElement, on: boolean) {
    li.style.overflow = on ? 'clip' : '';
    if (on) li.style.setProperty('overflow-clip-margin', 'var(--item-selected-bleed-x)');
    else li.style.removeProperty('overflow-clip-margin');
  }

  /**
   * Smooth changes to the nested rows in a list (A: core pane; B: white pane):
   *   - added rows open up (items below glide down) while their text and arrow slide down into place
   *   - removed rows stay briefly as non-interactive "ghosts" that close up while their text slides up and fades
   * When one row replaces another, the two happen together, so the list height changes smoothly.
   */
  function animateRowChanges(list: HTMLUListElement, oldRows: HTMLLIElement[], before: string[]) {
    const duration = ms('--motion-core-item-duration');
    if (!duration) return;
    const easing = token('--motion-core-item-easing') || 'ease-out';
    const offset = token('--motion-core-item-offset') || '12px';
    const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
    const rows = [...list.children] as HTMLLIElement[];
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
      list.insertBefore(ghost, anchor);
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
    if (accordion || columns) {
      // B: the section's items, with the open branch expanded inline. C: the section's items only.
      (function branch(list: MenuNode[], depth: number) {
        for (const n of list) {
          dynamicList.append(row(n, { depth }));
          if (accordion && path.includes(n.p)) branch(n.c, depth + 1);
        }
      })(current.c, 0);
    } else {
      dynamicList.append(row(current, { heading: true }));
      for (const child of current.c) dynamicList.append(row(child));
    }
    dynamicPane.setAttribute('aria-label', current.l);
    dynamicPane.hidden = false;
  }

  /** C: panel 2 lists the chosen L2's items, all as links (the menu stops at L3). */
  function fillPanel2(target: string) {
    if (!panel2 || !panel2List) return;
    const current = byPath.get(target);
    panel2List.replaceChildren();
    if (!current || !current.c.length) { panel2.hidden = true; return; }
    for (const child of current.c) panel2List.append(row(child, { leaf: true }));
    panel2.setAttribute('aria-label', current.l);
    panel2.hidden = false;
  }

  const dynamicSlot: Slot = { pane: dynamicPane, list: dynamicList, shown: '', seq: 0, fill: fillDynamic };
  const panel2Slot: Slot | null = panel2 && panel2List ? { pane: panel2, list: panel2List, shown: '', seq: 0, fill: fillPanel2 } : null;
  const slots = [dynamicSlot, ...(panel2Slot ? [panel2Slot] : [])];

  /** Show `target`'s items in a pane, sliding the old contents out and the new ones in. */
  async function slideTo(slot: Slot, target: string, animate: boolean) {
    const { pane, list } = slot;
    const mine = ++slot.seq; // any earlier, still-running update is now stale
    if (target === slot.shown) {
      // Same contents as on screen: stop any slide in progress and refresh in place
      pane.getAnimations().forEach(a => a.cancel());
      const oldRows = ([...list.children] as HTMLLIElement[]).filter(li => !li.dataset.ghost);
      const before = oldRows.map(li => (li.firstElementChild as HTMLElement).dataset.path!);
      slot.fill(target);
      if (accordion && animate) animateRowChanges(list, oldRows, before);
      return;
    }
    const slide = animate && !stacked.matches;
    // If a slide is already running (fast clicking), drop it and go straight to the new contents
    const busy = pane.getAnimations().length > 0;
    pane.getAnimations().forEach(a => a.cancel());
    if (slide && slot.shown && !busy) {
      await play(pane, [{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }],
        '--motion-submenu-out-duration', '--motion-submenu-out-easing');
      if (mine !== slot.seq) return; // a newer click has taken over
    }
    slot.shown = target;
    slot.fill(target);
    if (slide && target) {
      await play(pane, [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
        '--motion-submenu-in-duration', '--motion-submenu-in-easing');
    }
  }

  /** Update the panes to the right of the core pane. */
  function renderDynamic(animate: boolean) {
    // A: the selected item's sub-menu. B and C: the chosen section (B's branches open and close in place).
    const target = accordion || columns ? (path[0] ?? '') : selected(path);
    const jobs = [slideTo(dynamicSlot, target, animate)];
    if (panel2Slot) jobs.push(slideTo(panel2Slot, path[1] ?? '', animate));
    return Promise.all(jobs);
  }

  function render(animate: boolean) {
    renderCore(animate);
    return renderDynamic(animate);
  }

  // ---------- Open / close ----------
  let closing = false;
  async function setOpen(next: boolean, closeDuration = '--motion-core-duration') {
    if (next === open) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    slots.forEach(s => s.seq++); // cancel any sub-menu animation in flight
    if (open) {
      closing = false;
      path = pathForPage(byPath, currentPath);
      if (columns) path = path.slice(0, 2); // C shows down to L3: at most the section and one L2 open
      slots.forEach(s => { s.shown = ''; s.pane.getAnimations().forEach(a => a.cancel()); });
      renderCore();
      await renderDynamic(false);
      panes.hidden = false;
      await play(panes, [{ transform: 'translateY(-100%)', clipPath: 'inset(100% 0 0 0)' }, { transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' }],
        '--motion-core-duration', '--motion-core-easing');
    } else {
      closing = true;
      await play(panes, [{ transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' }, { transform: 'translateY(-100%)', clipPath: 'inset(100% 0 0 0)' }],
        closeDuration, '--motion-core-easing');
      if (!closing) return; // reopened mid-close
      panes.hidden = true;
      path = [];
      slots.forEach(s => { s.shown = ''; });
      closing = false;
    }
  }

  function focusPath(p: string) {
    panes.querySelector<HTMLElement>(`[data-path="${CSS.escape(p)}"]`)?.focus();
  }

  // ---------- Events ----------
  toggle.addEventListener('click', () => setOpen(!open));

  coreList.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn) return;
    const p = btn.dataset.path!;
    // A: clicking the selected item closes its sub-menu; any other item opens its own.
    // B and C: clicking the chosen section closes it (and everything open under it).
    path = accordion || columns ? toggleBranch(path, p) : choose(path, p);
    render(true);
    focusPath(p);
  });

  dynamicList.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn) return;
    const p = btn.dataset.path!;
    path = accordion || columns ? toggleBranch(path, p) : choose(path, p);
    render(true);
    focusPath(p);
  });

  // Page links in the menu: show the clicked row as selected, slide the menu
  // away, then go to the page (the browser then cross-fades to it).
  let leaving = false;
  panes.addEventListener('click', async (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a.menu-item');
    if (!link) return;
    // Let new-tab / new-window clicks behave normally
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    const pane = link.closest('.pane');
    pane?.querySelectorAll('.is-selected, .is-current').forEach(el => el.classList.remove('is-selected', 'is-current'));
    link.classList.add('is-selected');
    await setOpen(false, '--motion-menu-exit-duration');
    window.location.href = link.href;
  });
  // Coming back with the browser's Back button can restore this page from cache: reset
  window.addEventListener('pageshow', () => { leaving = false; });

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
