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
 *     items are always links. Each panel starts with a heading naming the chosen
 *     item, which links to its page (as A's dynamic pane heading). Clicking an
 *     open item closes it.
 *     Arrows: the open item in the core pane and panel 1 has a →, lined up on the
 *     right as in A; every other item (headings, links, the site's name) shows
 *     its → only on hover or keyboard focus. The co-brand tabs have none.
 *   F (stack): C without the depth limit. Every chosen item opens its items in
 *     a new panel (made as needed) that stacks over the last, leaving a strip of
 *     each earlier pane showing (strips narrow to fit the window). Panels are
 *     tinted by distance from the topmost: lightest on top, darker further back.
 *     Items with children are always buttons, so every level is reachable.
 *     A new panel is laid on the stack: it comes in from a little to the right,
 *     fading in (and leaves the same way). Headings and arrows as C.
 *     The panes under the topmost one aren't menus any more: their items don't
 *     respond, and clicking anywhere on one (or Enter on it from the keyboard)
 *     goes back to it, closing the panels above it (the core pane: back to the
 *     core menu alone).
 *   B, C and F have no black highlights (no selected or current-page block).
 *
 * State is an "open path": the chain of items whose sub-menus are open,
 * e.g. ["study", "study/study-areas"].
 *   - Core pane: the top-level items, with the open path nested inline
 *     under its top-level item (indented one step per level).
 *   - Dynamic pane: the children of the last item in the open path.
 *   - Selected: only the last item in the open path (its sub-menu is showing).
 *
 * The menu always opens at the top level with nothing chosen, as on the
 * homepage, wherever you are in the prototype (all variants).
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
 *
 * Co-branded site pages (e.g. Oceans Institute), behaviour option "Co-brand menu"
 * (src/options.ts):
 *   1 (menu bar on page): the menu is unchanged; the site's menu is a bar on the page.
 *   2 (replaces core menu): the menu opens on the site's sections in place of the
 *     top-level items, under two tabs (the site's abbreviation or name, and UWA)
 *     and the site's name (a link to its home). The UWA tab swaps to the normal
 *     top level; the tabs stay put. Each opening starts on the site's tab.
 *     The sections behave like top-level items in each variant.
 *   7 (alongside core menu): both menus at once.
 *     A: the site's name and sections in a block above a divider and the
 *       normal top level.
 *     B and C: the site's name and sections fill the white pane when the menu
 *       opens; choosing a top-level item shows that instead, and closing it
 *       again brings the site back.
 *
 * Compact layouts (mobile and tablet, src/breakpoints.ts): the menu takes over
 * the screen under the header (the header stays at the top), sliding down as on
 * desktop. Each variant keeps its desktop behaviour in one screen:
 *   A: one list, the core pane. The selected item's sub-menu (its heading link and
 *     children) opens under it, inside the list, instead of in the dynamic pane.
 *   B: one list. The chosen section's items open under it as an accordion (the
 *     white pane's behaviour, inline); open items get a ↓.
 *   C (and F, to any depth): the core pane, panel 1 and panel 2 are full-screen layers: choosing an item
 *     slides the next panel in from the right, over the last; each panel starts
 *     with a Back row, then its heading as on desktop. Arrows: Back's ←, and a →
 *     on the open item and on the item you came Back from (no hover arrows).
 *     The menu still stops at L3.
 *   Option 7 in B and C: the site's block sits above a divider and the top level,
 *   as in A (there's no white pane beside the core pane to fill). F uses A's
 *   layout for option 7 at every size, so the core pane isn't covered at rest.
 * Crossing between the compact and desktop layouts closes the menu.
 */

import { indexTree, choose, toggle as toggleBranch, selected, pagePath, cobrandTop, cobrandNode, type MenuNode, type CobrandData } from '../lib/menu-state';
import { getOption } from '../lib/options';
import { isCompact, onLayoutChange } from '../lib/breakpoints';
import { menuTabs, tabArrowKeys, type MenuMode } from '../lib/menu-tabs';

const header = document.querySelector<HTMLElement>('.primary-nav-header');
if (header) init(header);

function init(header: HTMLElement) {
  const dataEl = header.querySelector<HTMLScriptElement>('[data-nav-data]')!;
  const { base, tree, cobrand } = JSON.parse(dataEl.textContent || '{}') as { base: string; tree: MenuNode[]; cobrand?: CobrandData };
  const currentPath = header.dataset.currentPath || '';
  const layout = header.dataset.menuLayout;
  const accordion = layout === 'panels'; // variant B
  const stack = layout === 'stack';      // variant F
  const columns = layout === 'columns' || stack; // variants C and F (F differs where `stack` is checked)
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

  // Co-brand menu option 2: the site's sections stand in for the top level (see above)
  const option = cobrand ? getOption('cobrand-menu') : '';
  const replaces = option === '2';
  const alongside = option === '7';
  const cbTop = cobrand ? cobrandTop(cobrand) : [];
  const cbNode = cobrand ? cobrandNode(cobrand) : undefined;
  // Option 7 in A and F (and in B and C on compact screens): site block above the top level
  const stackedBlock = () => alongside && ((!accordion && !columns) || stack || isCompact());
  // Option 7 in B and C on desktop: the site fills the white pane by default
  const siteInPane = () => alongside && (accordion || columns) && !stack && !isCompact();
  // Compact screens: A and B show everything in one list; C stacks its panels as layers
  const oneList = () => isCompact() && !columns;
  const layers = () => isCompact() && columns;
  let mode: MenuMode = 'core';
  const topLevel = (): MenuNode[] => {
    if (mode === 'cobrand') return cbTop;
    return tree;
  };

  const byPath = indexTree([...tree, ...cbTop, ...(cbNode ? [cbNode] : [])]);

  const href = (p: string) => `${base}${p}/`;
  let open = false;
  let path: string[] = [];
  let returned = ''; // compact C: the item you last came Back from (it keeps its →)
  /** A pane whose contents slide out and back in when they change. */
  type Slot = { pane: HTMLElement; list: HTMLUListElement; shown: string; seq: number; fill: (target: string) => void };

  // ---------- Motion helpers ----------
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
  function row(node: MenuNode, opts: { depth?: number; heading?: boolean; core?: boolean; leaf?: boolean; inline?: boolean } = {}): HTMLLIElement {
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
      (el as HTMLAnchorElement).href = href(pagePath(node));
    }
    if (pagePath(node) === currentPath) {
      el.setAttribute('aria-current', 'page');
      // Highlight the page you're on in the sub-menu; in the core pane only when nothing
      // else is selected there, so the core pane never shows two black blocks
      if (highlight && !opts.heading && (!opts.core || opts.inline || path.length === 0)) el.classList.add('is-current');
    }
    const label = document.createElement('span');
    label.className = 'menu-item-label';
    label.textContent = node.l;
    el.append(label);
    if (highlight) el.append(arrowTpl.content.cloneNode(true));
    else if (columns) {
      // C: the open item's → (compact: and the one you came Back from). Desktop: every other item has one too,
      // hidden until hover (components.css), so its space is kept and nothing moves; compact has no hover
      const on = hasChildren && (path.includes(node.p) || node.p === returned);
      if (on || !layers()) {
        const arrow = arrowTpl.content.cloneNode(true) as DocumentFragment;
        if (on) arrow.querySelector('svg')?.classList.add('is-open');
        el.append(arrow);
      }
    } else if (hasChildren && path.includes(node.p) && (!opts.core || oneList())) {
      // B: an open parent in the white pane gets a ↓ on the right of its row (compact: in the one list, top level too).
      const arrow = arrowTpl.content.cloneNode(true) as DocumentFragment;
      arrow.querySelector('svg')?.classList.add('is-down');
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
    if (replaces) coreList.append(...switchRows());
    const addTop = (top: MenuNode) => {
      coreList.append(row(top, { core: true }));
      if (highlight && path[0] === top.p) {
        path.slice(1).forEach((p, i) => { const n = byPath.get(p); if (n) coreList.append(row(n, { depth: i + 1, core: true })); });
        // Compact A: the selected item's sub-menu (heading link, then children) opens under it
        const sel = oneList() ? byPath.get(selected(path)) : undefined;
        if (sel) {
          coreList.append(row(sel, { depth: path.length, heading: true, inline: true }));
          sel.c.forEach(child => coreList.append(row(child, { depth: path.length, inline: true })));
        }
      }
      // Compact B: the chosen section's items open under it as an accordion
      if (accordion && oneList() && path[0] === top.p) {
        (function branch(list: MenuNode[], depth: number) {
          for (const n of list) {
            coreList.append(row(n, { depth, inline: true }));
            if (path.includes(n.p)) branch(n.c, depth + 1);
          }
        })(top.c, 1);
      }
    };
    if (stackedBlock()) {
      // Option 7 in A: the site's block, then a divider and the University's top level
      coreList.append(siteTitleRow());
      cbTop.forEach(addTop);
      coreList.append(groupDivider());
    }
    topLevel().forEach(addTop);
    if (animate) animateRowChanges(coreList, oldRows, before);
  }

  /**
   * Option 2: tabs for the site's menu and the UWA main menu (src/lib/menu-tabs.ts),
   * and (in the site's menu) the site's name linking to its home.
   */
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
    title.dataset.path = '~title';
    title.href = href(cobrand!.h);
    if (cobrand!.h === currentPath) title.setAttribute('aria-current', 'page');
    const label = document.createElement('span');
    label.className = 'menu-item-label';
    label.textContent = cobrand!.l;
    title.append(label);
    if (columns && !layers()) title.append(arrowTpl.content.cloneNode(true)); // desktop C: → on hover, as other items
    li.append(title);
    return li;
  }

  /** A divider between the site's items and the University's top level (option 7 in A). */
  function groupDivider(): HTMLLIElement {
    const li = document.createElement('li');
    li.setAttribute('role', 'separator');
    const el = document.createElement('span');
    el.className = 'menu-group-divider';
    el.dataset.path = '~divider';
    li.append(el);
    return li;
  }

  /** Option 2: swap between the site's menu and the UWA main menu. */
  function switchMode(next: MenuMode) {
    mode = next;
    path = [];
    returned = '';
    renderCore();
    renderDynamic(true);
    const duration = ms('--motion-submenu-in-duration');
    if (duration) {
      // The list slides in from the side of the chosen tab (UWA: left); the tabs themselves stay put
      const offset = token('--motion-drill-offset') || '24px';
      ([...coreList.children] as HTMLElement[]).slice(1).forEach(li =>
        li.animate([{ transform: `translateX(${next === 'core' ? `-${offset}` : offset})`, opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }],
          { duration, easing: token('--motion-submenu-in-easing') || 'ease-out' }));
    }
    coreList.querySelector<HTMLElement>('.menu-tab[aria-selected="true"]')?.focus();
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
    if (layers()) dynamicList.append(backRow()); // compact C: Back first
    if (siteInPane() && current === cbNode) dynamicList.append(siteTitleRow()); // option 7 in B and C: the site's name on top
    else if (columns) dynamicList.append(row(current, { heading: true })); // C: a heading linking to the section's page
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

  /** Compact C: the Back row at the top of a panel. */
  function backRow(): HTMLLIElement {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-back';
    btn.dataset.back = '';
    btn.dataset.path = '~back';
    const text = document.createElement('span');
    text.textContent = 'Back';
    btn.append(arrowTpl.content.cloneNode(true), text);
    li.append(btn);
    return li;
  }

  /**
   * A panel after the first: a heading linking to the chosen item's page, then its items.
   * C's panel 2: all links (`leaf`), as the menu stops at L3. F's deeper panels: items with children open the next panel.
   */
  function fillLevel(pane: HTMLElement, list: HTMLUListElement, target: string, leaf: boolean) {
    const current = byPath.get(target);
    list.replaceChildren();
    if (!current || !current.c.length) { pane.hidden = true; return; }
    if (layers()) list.append(backRow()); // compact: Back first
    list.append(row(current, { heading: true }));
    for (const child of current.c) list.append(row(child, { leaf }));
    pane.setAttribute('aria-label', current.l);
    pane.hidden = false;
  }

  const dynamicSlot: Slot = { pane: dynamicPane, list: dynamicList, shown: '', seq: 0, fill: fillDynamic };
  // The panes after the dynamic pane (C: panel 2; F: one per deeper level, added as needed)
  const levelSlots: Slot[] = [];
  if (panel2 && panel2List) levelSlots.push({ pane: panel2, list: panel2List, shown: '', seq: 0, fill: t => fillLevel(panel2, panel2List, t, true) });
  const slots = [dynamicSlot, ...levelSlots];
  /** F: add a panel for the next level down. */
  function addLevelSlot() {
    const pane = document.createElement('div');
    pane.className = 'pane stack-pane';
    pane.hidden = true;
    const list = document.createElement('ul');
    list.className = 'menu-list';
    pane.append(list);
    panes.append(pane);
    const slot: Slot = { pane, list, shown: '', seq: 0, fill: t => fillLevel(pane, list, t, false) };
    levelSlots.push(slot);
    slots.push(slot);
  }
  /**
   * F: each pane paints over the one before; panels are tinted by how far they are from the topmost one.
   * Desktop: the panes under the topmost one become "go back here" targets (their items stop responding).
   */
  const corePane = coreList.parentElement!;
  const stackPanes = () => [corePane, ...slots.map(s => s.pane)];
  function stackDepths() {
    const top = path.length; // index of the topmost pane (0: the core pane)
    panes.style.setProperty('--stack-count', String(top + 1));
    stackPanes().forEach((pane, i) => {
      pane.style.zIndex = String(i + 1);
      if (i) pane.style.setProperty('--stack-depth', String(Math.max(0, top - i)));
      const under = i < top && !layers();
      pane.classList.toggle('is-under', under);
      pane.querySelector('ul')!.inert = under;
      if (under) {
        pane.tabIndex = 0;
        pane.setAttribute('role', 'button');
        pane.setAttribute('aria-label', `Back to ${i ? byPath.get(path[i - 1])?.l : 'the main menu'}`);
      } else if (pane.hasAttribute('role')) {
        pane.removeAttribute('tabindex');
        pane.removeAttribute('role');
        if (i) pane.setAttribute('aria-label', byPath.get(path[i - 1])?.l ?? '');
        else pane.removeAttribute('aria-label');
      }
    });
  }
  /** F: go back to a pane under the topmost one, closing the panels above it. */
  function backToPane(pane: HTMLElement) {
    const i = stackPanes().indexOf(pane);
    returned = '';
    path = path.slice(0, i);
    render(true);
    pane.querySelector<HTMLElement>('.menu-item')?.focus();
  }
  if (stack) {
    // Capture phase, so the click never reaches the (inert) items or the other handlers
    panes.addEventListener('click', (e) => {
      const pane = (e.target as HTMLElement).closest<HTMLElement>('.pane.is-under');
      if (!pane) return;
      e.preventDefault();
      e.stopPropagation();
      backToPane(pane);
    }, true);
    panes.addEventListener('keydown', (e) => {
      const pane = e.target as HTMLElement;
      if (!pane.classList?.contains('is-under') || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      backToPane(pane);
    });
  }

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
    const slide = animate;
    // The pane is clipped at its resting left edge (the right edge of the pane it slides from under) while it
    // moves, so it seems to come out from behind that pane, as in A, even when it's wider (B, C)
    // F: panels sit on top of the pane before, so each one is laid on the stack instead: in from a little to the right, fading in
    const hiddenFrame: Keyframe = stack ? { transform: `translateX(${token('--motion-drill-offset') || '24px'})`, opacity: 0 } : { transform: 'translateX(-100%)', clipPath: 'inset(0 0 0 100%)' };
    const shownFrame: Keyframe = stack ? { transform: 'translateX(0)', opacity: 1 } : { transform: 'translateX(0)', clipPath: 'inset(0 0 0 0)' };
    // If a slide is already running (fast clicking), drop it and go straight to the new contents
    const busy = pane.getAnimations().length > 0;
    pane.getAnimations().forEach(a => a.cancel());
    if (slide && slot.shown && !busy) {
      await play(pane, [shownFrame, hiddenFrame],
        '--motion-submenu-out-duration', '--motion-submenu-out-easing');
      if (mine !== slot.seq) return; // a newer click has taken over
    }
    slot.shown = target;
    slot.fill(target);
    if (slide && target) {
      await play(pane, [hiddenFrame, shownFrame],
        '--motion-submenu-in-duration', '--motion-submenu-in-easing');
    }
  }

  /**
   * Compact C: show `target`'s items in a full-screen layer. A layer that opens
   * slides in from the right over the one before; one that closes slides back out.
   */
  async function layerTo(slot: Slot, target: string, animate: boolean) {
    const { pane } = slot;
    const mine = ++slot.seq;
    pane.getAnimations().forEach(a => a.cancel());
    const frames = [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }];
    if (!target) {
      if (animate && slot.shown && !pane.hidden) {
        await play(pane, [...frames].reverse(), '--motion-layer-duration', '--motion-layer-easing');
        if (mine !== slot.seq) return;
      }
      slot.shown = '';
      slot.fill('');
      return;
    }
    const opening = !slot.shown;
    slot.shown = target;
    slot.fill(target);
    if (opening) pane.scrollTop = 0;
    if (animate && opening) await play(pane, frames, '--motion-layer-duration', '--motion-layer-easing');
  }

  /** Update the panes to the right of the core pane. */
  function renderDynamic(animate: boolean) {
    if (oneList()) { slots.forEach(s => { s.seq++; s.shown = ''; s.pane.hidden = true; }); return Promise.resolve([]); }
    if (stack) while (slots.length < path.length) addLevelSlot();
    if (layers()) { const jobs = Promise.all(slots.map((s, i) => layerTo(s, path[i] ?? '', animate))); if (stack) stackDepths(); return jobs; }
    // A: the selected item's sub-menu. B and C: the chosen section (B's branches open and close in place).
    const target = accordion || columns ? (path[0] ?? '') : selected(path);
    const jobs = [slideTo(dynamicSlot, target, animate)];
    levelSlots.forEach((s, i) => jobs.push(slideTo(s, path[i + 1] ?? '', animate)));
    if (stack) stackDepths(); // after the panes have refreshed their contents (which resets their labels)
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
      path = []; // always open at the top level, as on the homepage
      returned = '';
      mode = replaces ? 'cobrand' : 'core'; // option 2: start on the co-branded site's menu
      if (siteInPane()) path = [cbNode!.p]; // option 7 in B and C: the site is already chosen
      document.documentElement.classList.toggle('menu-open', isCompact()); // compact: lock the page behind the takeover
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
      document.documentElement.classList.remove('menu-open');
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
  tabArrowKeys(coreList, (next) => { if (next !== mode) switchMode(next); }); // option 2's tabs

  coreList.addEventListener('click', (e) => {
    const tab = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-tab');
    if (tab) { if (tab.dataset.switch !== mode) switchMode(tab.dataset.switch as MenuMode); return; }
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn) return;
    const p = btn.dataset.path!;
    returned = '';
    // A: clicking the selected item closes its sub-menu; any other item opens its own.
    // B and C: clicking the chosen section closes it (and everything open under it).
    path = accordion || columns ? toggleBranch(path, p) : choose(path, p);
    if (siteInPane() && !path.length) path = [cbNode!.p]; // option 7 in B and C: closing a section brings the site back
    render(true);
    focusPath(p);
  });

  // Compact C: Back closes the top layer
  panes.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('button.menu-back')) return;
    const from = path[path.length - 1];
    path = path.slice(0, -1);
    returned = from ?? '';
    render(true);
    if (from) focusPath(from);
  });

  // Items in the panes to the right of the core pane (F: any of its panels)
  panes.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn || e.composedPath().includes(coreList)) return; // (the core list's own handler may have re-rendered it already)
    const p = btn.dataset.path!;
    returned = '';
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

  // Crossing between the compact and desktop layouts: close the menu straight away, without motion
  onLayoutChange(() => {
    if (!open) return;
    open = false;
    closing = false;
    toggle.setAttribute('aria-expanded', 'false');
    slots.forEach(s => { s.seq++; s.shown = ''; s.pane.getAnimations().forEach(a => a.cancel()); s.pane.hidden = true; });
    panes.getAnimations().forEach(a => a.cancel());
    panes.hidden = true;
    document.documentElement.classList.remove('menu-open');
    path = [];
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
