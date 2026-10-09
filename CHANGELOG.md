# Changelog

## 0.4.0 (9 Oct 2026)

Menu refinements.

- Clicking anywhere outside the menu panes closes the menu.
- Motion: the menu slides down from under the header band on open (500ms, ease-out) and back up on close. When the sub-menu changes, the old one retreats left under the core pane and the new one slides back out (200ms ease-in out, 300ms ease-out in). All timings are in `tokens.css`; reduced-motion devices get no animation.
- Core pane nesting indent increased 50% (18px to 27px).
- Menu panes now join the bottom of the header band (top 128px, was 131px).
- Opening the menu on a page deep in the IA starts with that page's section open: its parents nested in the core pane and the nearest parent selected.
- Selected item arrow is now white.

## 0.3.1 (9 Oct 2026)

- Real fonts added in `public/fonts/`: Melun Display UWA Bold (supplied as WOFF2) and TT Norms Pro Medium (converted from TTF to WOFF2).
- TT Norms Pro Regular (course body copy) and Bold (course eyebrow) added, converted from TTF.

## 0.3.0 (8 Oct 2026)

Real IA from Hugo's sitemap (replaces the stand-in built from Figma labels).

- 137 pages, 10 top-level items, up to 5 levels deep.
- The sitemap script now reads path-style rows (several levels on one row, repeated parents merged) as well as the indented style.
- Levels skipped in the Strengths block ("Locate our research", "Protocols resources", "Nature science journals") are placed under "Indigenous research UWA", as agreed.
- "Specific course pages" (under Architecture and Design and Undergraduate courses) use the course template. The other "Specific …" items are content pages.
- Current students, News, Events, Library and Staff from the Figma menu are kept as top-level items after the five in the sitemap. Giving is not included.
- Known placeholder content in the sitemap: the About block is a copy of Partners and Community.

## 0.2.0 (8 Oct 2026)

Page templates from Figma section *Page templates*.

- Four templates: landing, content, course, co-branded site. Chosen per page with a new `template` column in `data/sitemap.csv` (blank = landing for L1, content for the rest).
- Course pages take `eyebrow`, `intro` and `body` from optional CSV columns, falling back to the Figma example copy.
- Header now has the grey band (#c0c0c0, 128px) shown in the templates.
- New breadcrumbs (TT Norms Pro Medium 18, blue links, › separators) on content and co-branded pages.
- Placeholder strokes now 4px, matching Figma.
- Novel Pro (co-branded title) uses Crimson Pro as a free stand-in until a font file is supplied.
- The stand-in sitemap has no course or co-branded pages yet; they'll appear when the IA tree assigns them.

## 0.1.0 (8 Oct 2026)

First build: desktop menu system from Figma section *Core menu opens with submenu journey* (5 frames).

- Astro static site, one page per sitemap item, deployed to GitHub Pages.
- Header: logo, Menu button (open state: Ironbark 80 / white), Search (shows a "not available" message), shortcuts to the Study, Impact and Research landing pages.
- Core pane and dynamic pane, built from `data/sitemap.csv`, with the open path nested in the core pane, a selected state, whole-row click targets, and Esc to close.
- All tunable values in `src/styles/tokens.css`.
- Simple password screen and `noindex`.
- **Stand-in data:** the sitemap only contains the labels visible in the Figma frames (Study → Explore courses → Study areas). The other top-level items have no children yet, so they link straight to their pages.
- **Stand-in pages:** content pages reuse the homepage wireframe (title + placeholders) until templates arrive. Impact and Research aren't in the sitemap, so they have stand-in landing pages.
