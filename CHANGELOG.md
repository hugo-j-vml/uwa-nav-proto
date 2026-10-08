# Changelog

## 0.1.0 (8 Oct 2026)

First build: desktop menu system from Figma section *Core menu opens with submenu journey* (5 frames).

- Astro static site, one page per sitemap item, deployed to GitHub Pages.
- Header: logo, Menu button (open state: Ironbark 80 / white), Search (shows a "not available" message), shortcuts to the Study, Impact and Research landing pages.
- Core pane and dynamic pane, built from `data/sitemap.csv`, with the open path nested in the core pane, a selected state, whole-row click targets, and Esc to close.
- All tunable values in `src/styles/tokens.css`.
- Simple password screen and `noindex`.
- **Stand-in data:** the sitemap only contains the labels visible in the Figma frames (Study → Explore courses → Study areas). The other top-level items have no children yet, so they link straight to their pages.
- **Stand-in pages:** content pages reuse the homepage wireframe (title + placeholders) until templates arrive. Impact and Research aren't in the sitemap, so they have stand-in landing pages.
