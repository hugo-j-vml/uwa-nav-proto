# Changelog

## 0.13.2 (15 Oct 2026)

- Browser tab titles on variant pages start with the variant letter, without the prototype name, for example "A | Homepage" or "C | About us". The index page keeps "Variants | UWA navigation prototype".
- A, B and C: the horizontal logo is vertically centred in the header band (28.5px above and below), with or without the grey background. It was sitting 8px high, level with the old placeholder's top edge.

## 0.13.1 (15 Oct 2026)

- D and E: page placeholders (the boxes with a cross) are inset 50px on both sides, so they line up with the breadcrumb and title and sit clear of the sidebar and menu pane. On landing pages the title moves in by the same amount so it stays over the image. Token: `--placeholder-inset` (0 in A, B and C, which are unchanged).

## 0.13.0 (15 Oct 2026)

- Index page and password screen use Snowflake Sans: Medium for the variant links, the Enter button and the password screen title; Book for all other text. Light, Book, Medium and Bold are in `public/fonts/` as `.woff2` (converted from the supplied `.otf` files) and registered in `fonts.css`. Weights are the `--index-weight-copy` and `--index-weight-link` tokens.
- Password screen title is 28px (was 32px) so it stays on one line in the wider typeface.

## 0.12.0 (15 Oct 2026)

- Password screen redesigned to match the index page: dark background, VML mark and white rule at the top, and the title, intro text, password field and Enter button centred, with more space around them. The field has a white outline, the button is white with dark text, and the error message is a light red so it reads on the dark background. Same on every page. Sizes and spacing are `--gate-*` tokens in `tokens.css`.
- The VML mark is now a shared component (`VmlMark.astro`), used by the index page and the password screen.

## 0.11.2 (15 Oct 2026)

- Password screen: the text in the white box is black. On the index page it had picked up the page's light text colour and was unreadable.

## 0.11.1 (15 Oct 2026)

- D and E: the logo is centred in the sidebar.
- D and E: the drill-down pane is wider, 540px (was 440px, `--drill-pane-width`), so fewer items wrap onto two lines. Labels in the pane also use its full width (they were capped at 330px).

## 0.11.0 (15 Oct 2026)

Two sidebar variants, and the real UWA logo.

- **Logo:** the "UWA Logo" placeholder box in the A, B and C headers is now the horizontal UWA logo (`public/logos/uwa-horizontal.svg`, 216 × 71). D and E use the vertical logo (`public/logos/uwa-vertical.svg`).
- **New: variant D, "Sidebar with drill-down"**, at `/d/`. A fixed sidebar replaces the header: logo, a search field, then the top-level items. Choosing one opens a pane to the right with its children (heading linking to that section's page). Choosing an item with children replaces the pane's contents with the next level, with a Back link at the top; all levels are reachable. The open top-level item gets a →; choosing it again closes the pane.
- **New: variant E, "Sidebar menu button"**, at `/e/`. A simpler sidebar: logo, search field, a Menu button, then the Study / Impact / Research shortcuts. The Menu button opens the same pane at the top-level items; choosing one drills down as in D.
- **D and E:** the search field is a real input; pressing Enter shows "not available in this prototype". The pane slides out from under the sidebar (A's menu motion) and each level slides in from the side. Closes on the trigger, Esc or a click outside. Content and co-branded pages start higher (`--breadcrumb-top: 60px`), as there's no header band. Sidebar tokens are in their own block in `tokens.css`. Below 640px wide the sidebar sits above the page (interim).
- The index page lists all five variants.

## 0.10.0 (15 Oct 2026)

- **All variants:** the menu now always opens at the top level with nothing chosen, as it does on the homepage, wherever you are in the prototype. (Before, it opened at the current page's section with its parents open.) In A, the page you're on is still highlighted if you open its sub-menu.

## 0.9.2 (15 Oct 2026)

- Index page: intro text sits 12px below the line divider (was 30px), `--index-intro-top`.

## 0.9.1 (15 Oct 2026)

- Variant C: panel 1 (the middle panel) has a light grey background, #d4d4d4 (`--panel-1-bg`), so the three panes step from dark to light.

## 0.9.0 (15 Oct 2026)

Variant C, and changes to B.

- **New: variant C, "Static core with two panels"**, at `/c/` (and on the index page). Same header and static core pane as B. Choosing a section opens panel 1 with its L2 items; choosing an L2 opens panel 2, to the right, with its L3 items. One IA level per panel, so the menu goes down to L3 (L3 items are always links; deeper pages are reached from those pages). Panel 2 slides out from under panel 1 with A's sub-menu motion. The open item in the core pane and panel 1 has a → after its label. Clicking an open item closes it. No black highlights.
- **B renamed** "Static core with dynamic panel".
- **B has no black highlights** any more: not on the chosen section, not on the page you're on.
- **B and C:** clicking the chosen section in the core pane closes everything (before, in B, it only closed the open branch).
- Variant A is unchanged (screenshots match the previous build exactly).

## 0.8.0 (15 Oct 2026)

Variant B, at `/b/` (and now a link on the index page).

- Same header, shortcuts, content pages and motion as A.
- The core pane is narrower and static: top-level items only, never nested. The chosen item gets the black block; clicking it again closes the menu's white pane.
- The white pane is wider (core and white pane split about 40/60, same total width as A) and has no heading. It lists the chosen section's items as an accordion: clicking a parent opens it inline, with a ↓ next to its label and its children indented beneath it. One branch is open at a time; clicking an open parent closes it. Rows open and close with A's row motion.
- No → arrows in B. The page you're on is highlighted in the white pane, and the menu reopens with your page's branch open, as in A.
- Tokens: B's widths, label width and ↓ colour are in the `[data-variant="b"]` block at the end of `tokens.css`.
- Variant A is unchanged (screenshots match the previous build exactly).

## 0.7.1 (15 Oct 2026)

- Index page: the VML mark replaces the "UWA" text top left, as in the reference (30px, `--index-mark-size`).

## 0.7.0 (15 Oct 2026)

Variants: the prototype now hosts several nav concepts, each under its own path.

- Variant A (the prototype so far) has moved to `/a/`, e.g. `/uwa-nav-proto/a/study-at-uwa/`. Nothing else about it has changed: screenshots of the old and new builds match exactly. The old root URLs are gone (no redirects).
- New index page at `/uwa-nav-proto/` listing the variants: A links to its homepage; B and C are greyed out as "Coming soon". Dark layout from Hugo's reference, with a plain stand-in typeface (`--index-font`). All its values are `--index-*` tokens.
- Each variant has a config file in `src/variants/` and its own block for token overrides at the end of `tokens.css` (`[data-variant="b"]` etc.).
- Menu state (open path, step back, reopen at the current page) moved into `src/lib/menu-state.ts`, to be shared by B and C.
- `plan.md` added to the repo.

## 0.6.0 (15 Oct 2026)

New IA from the reviewed 2026 Information Architecture spreadsheet.

- Sitemap replaced: 251 pages, 7 top-level items (Study at UWA, Life at UWA, Students, Partners and community, Our research, About us, Login), up to 5 levels deep.
- The Figma-only top-level items (Current students, News, Events, Library, Staff) are gone. News, Events and Libraries now sit inside sections.
- Each of the 11 study areas has a "Specific course pages" page (course template).
- Labels as written, with obvious typos fixed ("Opportunites", "Our History") and the alternatives in brackets dropped ("Applicants", "Agents").
- Header shortcuts: Study goes to Study at UWA, Research to Our research. Impact still has a stand-in page.
- Page headings are Vivid Blue (`--page-title-colour`).

## 0.5.1 (12 Oct 2026)

- Header shortcuts (Study / Impact / Research) are hidden when the window is under 800px wide.

## 0.5.0 (9 Oct 2026)

Softer page changes.

- Clicking a page link in the menu now shows that row as selected, slides the menu away (350ms, `--motion-menu-exit-duration`), then goes to the page. Cmd/Ctrl-click still opens a new tab.
- Pages cross-fade into each other (300ms, `--motion-page-duration`) while the header stays in place. Uses the browser's built-in view transitions (Chrome, Edge, Safari); other browsers change page instantly as before.
- Both are off on devices set to reduce motion.

## 0.4.2 (9 Oct 2026)

- Homepage and landing pages now have a transparent header (no grey band), matching the updated Figma landing template; the hero shows through. Content, course and co-branded pages keep the band. Token: `--header-bg-transparent`.
- The core pane only ever shows one black block: the item you've just chosen. The page you're on is still highlighted in its sub-menu, and in the core pane only when nothing else is selected there.
- The menu's slide down/up is now clipped at the bottom edge of the header, so it never shows through a transparent header.

## 0.4.1 (9 Oct 2026)

- Removed nested rows now close up smoothly too: the row shrinks away while its text slides up and fades (same `--motion-core-item-*` tokens). When one row replaces another, both happen together.
- Parents newly nested in the core pane no longer pop in: the row opens up so items below glide down, and its text and arrow slide down into place (300ms, ease-out, 12px; tokens `--motion-core-item-*`).
- The page you're on is highlighted (black block, white text) wherever it appears in the menu, e.g. Accommodation in the Life at UWA sub-menu when you're on that page. Sub-menu headings are not highlighted.

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
