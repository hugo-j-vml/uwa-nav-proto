/**
 * Menu state shared by every variant: an "open path", the chain of items whose
 * sub-menus are open, e.g. ["study-at-uwa", "study-at-uwa/explore-courses"].
 * Pure functions only; each variant's menu script renders the state its own way.
 */

/** l = label, p = key in the menu (a sitemap path for core items), c = children, h = page path when it differs from p. */
export type MenuNode = { l: string; p: string; c: MenuNode[]; h?: string };

/** Page path of a menu item. */
export const pagePath = (n: MenuNode) => n.h ?? n.p;

/** A co-branded site's IA as sent to the menu scripts (h = page path). */
export type CobrandData = { l: string; h: string; s: string; c: { l: string; h: string; c: { l: string; h: string }[] }[] };

/*
 * Co-brand menu items get their own keys, starting with "~" so they never clash
 * with core sitemap paths, and with one "/" per level so the open-path logic
 * below (depth = number of "/") works on them unchanged.
 */

/** Behaviour option 2: the site's sections as a top-level list (keys ~0, ~0/3 …). */
export function cobrandTop(cb: CobrandData): MenuNode[] {
  return cb.c.map((s, i) => ({ l: s.l, h: s.h, p: `~${i}`, c: s.c.map((x, j) => ({ l: x.l, h: x.h, p: `~${i}/${j}`, c: [] })) }));
}

/** Behaviour option 7: the site as one item with its sections beneath it (keys ~, ~/0, ~/0/3 …). */
export function cobrandNode(cb: CobrandData): MenuNode {
  return { l: cb.l, h: cb.h, p: '~', c: cb.c.map((s, i) => ({ l: s.l, h: s.h, p: `~/${i}`, c: s.c.map((x, j) => ({ l: x.l, h: x.h, p: `~/${i}/${j}`, c: [] })) })) };
}

/** Every node by its path. */
export function indexTree(tree: MenuNode[]): Map<string, MenuNode> {
  const byPath = new Map<string, MenuNode>();
  (function walk(list: MenuNode[]) { for (const n of list) { byPath.set(n.p, n); walk(n.c); } })(tree);
  return byPath;
}

/**
 * Choose an item that has children. Choosing the selected item (the last in
 * the path) steps back one level; any other item opens its own sub-menu,
 * replacing whatever was open at its level and below.
 */
export function choose(path: string[], p: string): string[] {
  const depth = p.split('/').length - 1;
  return p === path[path.length - 1] ? path.slice(0, depth) : [...path.slice(0, depth), p];
}

/** The item whose sub-menu is showing ('' if none). */
export const selected = (path: string[]) => path[path.length - 1] ?? '';

/**
 * Accordion click (variant B's white pane): an open item closes, along with
 * everything open below it; a closed item opens, closing any other open item
 * at its level and below.
 */
export function toggle(path: string[], p: string): string[] {
  const depth = p.split('/').length - 1;
  return path.includes(p) ? path.slice(0, depth) : [...path.slice(0, depth), p];
}
