import sitemap from '../data/sitemap.json';
import header from '../data/header.json';

export interface NavNode {
  id: string;
  label: string;
  slug: string;
  path: string;
  level: number;
  template: 'landing' | 'content' | 'course' | 'cobranded';
  eyebrow?: string;
  intro?: string;
  body?: string;
  children: NavNode[];
}

export const nodes = sitemap.nodes as NavNode[];
export const shortcuts = header.shortcuts as { label: string; path: string }[];

/** Site base path with trailing slash, e.g. "/uwa-nav-proto/". */
export const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';

/** URL for a page path such as "study/explore-courses". */
export const href = (path: string) => (path ? `${base}${path}/` : base);

/** Every node in the tree, depth first. */
export function flatten(list: NavNode[] = nodes, out: NavNode[] = []): NavNode[] {
  for (const n of list) { out.push(n); flatten(n.children, out); }
  return out;
}

/** Ancestors of a node (top level first), excluding the node itself. */
export function ancestors(path: string): NavNode[] {
  const parts = path.split('/');
  const result: NavNode[] = [];
  let level = nodes;
  for (let i = 0; i < parts.length - 1; i++) {
    const n = level.find(x => x.slug === parts[i]);
    if (!n) break;
    result.push(n);
    level = n.children;
  }
  return result;
}

/** Header shortcut paths that aren't pages in the sitemap (get a stand-in page). */
export function standalonePages(): { path: string; label: string }[] {
  const known = new Set(flatten().map(n => n.path));
  return shortcuts.filter(s => !known.has(s.path)).map(s => ({ path: s.path, label: s.label }));
}
