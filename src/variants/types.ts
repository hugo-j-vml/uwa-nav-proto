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
  /** 'coming-soon' variants are listed on the index page but not built */
  status: 'ready' | 'coming-soon';
  /** Page shell: header across the top (A, B, C, F) or a fixed sidebar on the left (D, E) */
  shell: 'header' | 'sidebar';
  /** Menu layout inside the shell */
  menu: 'core-expanding' | 'panels' | 'columns' | 'stack' | 'drilldown' | 'menu-button';
  /**
   * How many IA levels the menu shows (C: 3). Omit when the menu reaches every
   * level. Pages at this level or deeper that have children get an "In this
   * section" area linking to them, so deeper pages stay reachable.
   * (The menu script stops at this depth on its own; keep the two in step.)
   */
  menuDepth?: number;
  /** Motion preset (timings live in tokens.css); all variants start on 'a' */
  motion: 'a';
}
