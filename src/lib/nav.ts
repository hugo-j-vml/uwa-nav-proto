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
  /** Co-branded pages only: short name for the site's menu tab (sitemap CSV column "abbreviation") */
  abbreviation?: string;
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

/** URL for a page path such as "study/explore-courses" in a variant ('' = the variant's homepage). */
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

/** A co-branded site, for the pages that belong to it (its home and the pages in its own IA). */
export interface Cobrand { label: string; path: string; href: string; site: SiteNode[]; abbreviation?: string }

/** Compact co-brand data for the menu scripts: l = label, h = page path, c = children, s = tab label (abbreviation or label). */
export const cobrandData = (cb: Cobrand) => ({
  l: cb.label, h: cb.path, s: cb.abbreviation || cb.label,
  c: cb.site.map(s => ({ l: s.label, h: s.path, c: s.children.map(x => ({ l: x.label, h: x.path, c: [] })) })),
});

/**
 * Phase 2's search (G, H): every page in the IA and in the co-branded sites' own
 * menus, for a simple text match on the label. l = label, h = page path,
 * t = the trail above it (e.g. "Study at UWA › Explore courses").
 */
export function searchIndex(): { l: string; h: string; t: string }[] {
  const core = flatten().map(n => ({ l: n.label, h: n.path, t: ancestors(n.path).map(a => a.label).join(' › ') }));
  const sites = sitePages().map(({ page, root, parent }) => {
    const trail = [...ancestors(root.path).map(a => a.label), root.label, ...(parent ? [parent.label] : [])];
    return { l: page.label, h: page.path, t: trail.join(' › ') };
  });
  return [...core, ...sites];
}
