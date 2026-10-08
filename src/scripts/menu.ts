/**
 * Menu behaviour (click only, no hover).
 *
 * State is an "open path": the chain of items whose sub-menus are open,
 * e.g. ["study", "study/explore-courses"].
 *   - Core pane: the top-level items, with the open path nested inline
 *     under its top-level item (indented one step per level).
 *   - Dynamic pane: the children of the last item in the open path.
 *   - Selected: only the last item in the open path (its sub-menu is showing).
 *
 * Whole rows are click targets. Items with children are <button>s that open
 * their sub-menu; items without children are links to their page.
 */

type Node = { l: string; p: string; c: Node[] };

const header = document.querySelector<HTMLElement>('.primary-nav-header');
if (header) init(header);

function init(header: HTMLElement) {
  const dataEl = header.querySelector<HTMLScriptElement>('[data-nav-data]')!;
  const { base, tree } = JSON.parse(dataEl.textContent || '{}') as { base: string; tree: Node[] };
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]')!;
  const panes = header.querySelector<HTMLElement>('#menu-panes')!;
  const coreList = header.querySelector<HTMLUListElement>('[data-core-list]')!;
  const dynamicPane = header.querySelector<HTMLElement>('.dynamic-pane')!;
  const dynamicList = header.querySelector<HTMLUListElement>('[data-dynamic-list]')!;
  const arrowTpl = header.querySelector<HTMLTemplateElement>('[data-arrow]')!;
  const search = header.querySelector<HTMLButtonElement>('[data-search]');

  const byPath = new Map<string, Node>();
  (function index(list: Node[]) { for (const n of list) { byPath.set(n.p, n); index(n.c); } })(tree);

  const href = (p: string) => `${base}${p}/`;
  let open = false;
  let path: string[] = [];

  function row(node: Node, opts: { depth?: number; heading?: boolean } = {}): HTMLLIElement {
    const li = document.createElement('li');
    const hasChildren = node.c.length > 0 && !opts.heading;
    const el = hasChildren ? document.createElement('button') : document.createElement('a');
    el.className = 'menu-item' + (opts.heading ? ' dynamic-heading' : '');
    el.dataset.path = node.p;
    if (opts.depth) el.style.setProperty('--depth', String(opts.depth));
    if (hasChildren) {
      (el as HTMLButtonElement).type = 'button';
      const expanded = path.includes(node.p);
      el.setAttribute('aria-expanded', String(expanded));
      if (node.p === path[path.length - 1]) el.classList.add('is-selected');
    } else {
      (el as HTMLAnchorElement).href = href(node.p);
    }
    const label = document.createElement('span');
    label.className = 'menu-item-label';
    label.textContent = node.l;
    el.append(label, arrowTpl.content.cloneNode(true));
    li.append(el);
    return li;
  }

  function render() {
    coreList.replaceChildren();
    for (const top of tree) {
      coreList.append(row(top));
      if (path[0] === top.p) {
        path.slice(1).forEach((p, i) => { const n = byPath.get(p); if (n) coreList.append(row(n, { depth: i + 1 })); });
      }
    }
    const current = byPath.get(path[path.length - 1] ?? '');
    dynamicList.replaceChildren();
    if (current) {
      dynamicList.append(row(current, { heading: true }));
      for (const child of current.c) dynamicList.append(row(child));
      dynamicPane.hidden = false;
      dynamicPane.setAttribute('aria-label', current.l);
    } else {
      dynamicPane.hidden = true;
    }
  }

  function setOpen(next: boolean) {
    open = next;
    if (!open) path = [];
    toggle.setAttribute('aria-expanded', String(open));
    panes.hidden = !open;
    render();
  }

  function focusPath(p: string) {
    coreList.querySelector<HTMLElement>(`[data-path="${CSS.escape(p)}"]`)?.focus();
  }

  toggle.addEventListener('click', () => setOpen(!open));

  coreList.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn) return;
    const p = btn.dataset.path!;
    const depth = p.split('/').length - 1;
    // Clicking the selected item closes its sub-menu; any other item opens its own.
    path = p === path[path.length - 1] ? path.slice(0, depth) : [...path.slice(0, depth), p];
    render();
    focusPath(p);
  });

  dynamicList.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.menu-item');
    if (!btn) return;
    const p = btn.dataset.path!;
    path = [...path, p];
    render();
    focusPath(p);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) { setOpen(false); toggle.focus(); }
  });

  search?.addEventListener('click', () => {
    window.alert('Search is not available in this prototype.');
  });
}
