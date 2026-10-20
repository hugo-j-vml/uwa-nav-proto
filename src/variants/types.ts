/**
 * A nav concept ("variant"). Every variant builds the full page tree from the
 * same sitemap under its own path (/a/, /b/, /c/). A new variant is a new
 * config file in this folder, registered in index.ts.
 */
export interface Variant {
  /** Path segment and data-variant value, e.g. 'a' */
  id: string;
  /** Shown on the index page, e.g. 'A' */
  letter: string;
  /** Shown on the index page */
  name: string;
  /** Prototyping phase: which index page lists it (1: A–F, kept for reference; 2: G, H, CONTROL-1) and which behaviour options apply to it */
  phase: 1 | 2;
  /** 'coming-soon' variants are listed on the index page but not built */
  status: 'ready' | 'coming-soon';
  /** Page shell: header across the top (A, B, C, F, G, CONTROL-1) or a fixed sidebar on the left (D, E, H) */
  shell: 'header' | 'sidebar';
  /** Menu layout inside the shell (pane: phase 2's single drill-down pane, G and H; mega: the live site's mega menus, CONTROL-1) */
  menu: 'core-expanding' | 'panels' | 'columns' | 'stack' | 'drilldown' | 'menu-button' | 'pane' | 'mega';
  /**
   * How many IA levels the menu shows (C: 3). Omit when the menu reaches every
   * level. Pages at this level or deeper that have children get an "In this
   * section" area linking to them, so deeper pages stay reachable.
   * (The menu script stops at this depth on its own; keep the two in step.)
   */
  menuDepth?: number;
  /** No behaviour options at all (CONTROL-1: it copies the live site, so nothing is switchable; no Shift+O panel) */
  noOptions?: true;
  /**
   * Mega menu (CONTROL-1) only. more: sitemap paths listed in the live site's small
   * "More" dropdown instead of getting a mega menu of their own. lockups: co-branded
   * sites (sitemap paths) shown with a logo lockup next to UWA's, as Oceans Institute
   * is on the live site; the others show their name under UWA's logo.
   */
  mega?: { more: string[]; lockups: string[] };
  /** Behaviour options fixed for this variant (not switchable), e.g. { 'cobrand-menu': '2' } */
  fixedOptions?: Record<string, string>;
  /** Motion preset (timings live in tokens.css); all variants start on 'a' */
  motion: 'a';
}
