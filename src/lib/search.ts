/**
 * Phase 2's basic search (G, H and CONTROL-1): a text match on the names of
 * the pages in the IA (index from searchIndex() in nav.ts). A page matches when
 * its name contains every word typed; names starting with the text come first,
 * then names with a word starting with it, then the rest, each in IA order.
 */
export type SearchEntry = { l: string; h: string; t: string };

export function matchPages(index: SearchEntry[], typed: string): SearchEntry[] {
  const q = typed.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!q) return [];
  const words = q.split(' ');
  const startsWord = (label: string) => label.split(/[^a-z0-9]+/).some(w => w.startsWith(words[0]));
  return index
    .map((e, i) => ({ e, i, l: e.l.toLowerCase() }))
    .filter(x => words.every(w => x.l.includes(w)))
    .map(x => ({ ...x, score: x.l.startsWith(q) ? 0 : startsWord(x.l) ? 1 : 2 }))
    .sort((a, b) => a.score - b.score || a.i - b.i)
    .map(x => x.e);
}
