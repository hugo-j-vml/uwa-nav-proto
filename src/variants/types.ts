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
  /** Page shell: header across the top (A, B, C) or a fixed sidebar on the left (D, E) */
  shell: 'header' | 'sidebar';
  /** Menu layout inside the shell */
  menu: 'core-expanding' | 'panels' | 'columns' | 'drilldown' | 'menu-button';
  /** Motion preset (timings live in tokens.css); all variants start on 'a' */
  motion: 'a';
}
