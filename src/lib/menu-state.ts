/**
 * Menu state shared by every variant: an "open path", the chain of items whose
 * sub-menus are open, e.g. ["study-at-uwa", "study-at-uwa/explore-courses"].
 * Pure functions only; each variant's menu script renders the state its own way.
 */

export type MenuNode = { l: string; p: string; c: MenuNode[] };

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
