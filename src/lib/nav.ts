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
  /** Co-branded pages only: the site's own two-level menu (not in the main menu) */
  site?: SiteNode[];
}

/** A page in a co-branded site's own menu (data/cobranded/<slug>.csv). */
export interface SiteNode { label: string; slug: string; path: string; children: SiteNode[] }

/** Every co-branded site page, with its site's root page and its L1 parent (for L2 pages). */
export function sitePages(): { page: SiteNode; root: NavNode; parent?: SiteNode }[] {
  return flatten().flatMap(root => (root.site ?? []).flatMap(l1 => [
    { page: l1, root },
    ...l1.children.map(page => ({ page, root, parent: l1 })),
  ]));
}

export const nodes = sitemap.nodes as NavNode[];
export const shortcuts = header.shortcuts as { label: string; path: string }[];

/** Site base path with trailing slash, e.g. "/uwa-nav-proto/". */
export const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';

/** Root URL of a variant, e.g. "/uwa-nav-proto/a/". */
export const variantBase = (variant: string) => `${base}${variant}/`;

/** URL for a page path such as "study-at-uwa/explore-courses" in a variant ('' = the variant's homepage). */
export const href = (path: string, variant: string) => (path ? `${variantBase(variant)}${path}/` : variantBase(variant));

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
