# UWA Main Navigation Prototype: Build Plan

**Owner:** Hugo Jenkins (design) · **Build:** Claude · **Fidelity:** Wireframe · **Status:** prototype v0.30.0 (19 Oct 2026): six variants (A–F) on desktop, mobile and tablet (Section 7e); behaviour options for co-branded sites (7d); C's "In this section" grid (7b); animated index background. Latest changes: top of `CHANGELOG.md`.

---

## 1. Purpose

Build a coded, clickable prototype of the proposed UWA main website navigation for two rounds of user testing:

1. **Unmoderated task-based testing** (Maze or Lyssna): measure task success, paths and time on task.
2. **Moderated 1:1 sessions**: look into the issues the unmoderated round brings up.

We're building it in code because the number of menu states is too large to maintain as a Figma prototype. If the nav is driven by data, every state comes from the sitemap automatically, and none has to be wired up by hand.

From 15 Oct, the prototype hosts **several nav concepts (variants)** side by side, all built from the same IA (Section 4a).

## 2. Ground rules

- **Implementation only.** Claude builds what is in Figma and the sitemap. Claude makes no design or IA decisions, invents no labels and doesn't change the structure.
- **Figma is the source of truth** for components, layout and states. The **sitemap is the source of truth** for structure and labels.
- **Close enough is fine for v1.** Spacing doesn't need to be pixel-exact to the mockups for the first build. Every value Hugo will want to tune lives in one hand-editable tokens file (Section 5).
- **Gaps get flagged.** Anything ambiguous goes in the open-questions list (Section 11) for Hugo to decide. Claude doesn't guess.
- **Wireframe fidelity** throughout, but with the real UWA typefaces (Section 6).

## 3. Inputs

| # | Input | Status | Notes |
|---|-------|--------|-------|
| 1 | Desktop menu states | ✅ Received | Figma section "Core menu opens with submenu journey" (`606:11615`), 5 frames at 1440px. Frame numbering fixed by Hugo. |
| 2 | Content page templates | ✅ Received | Figma section "Page templates" (`607:11926`): landing, content, course, co-branded site |
| 3 | Proposed sitemap / IA tree | ✅ Received 8 Oct | 137 pages, 5 levels. Built as v0.3 with a template column added; Figma extras (Current students, News, Events, Library, Staff) kept as top-level items |
| 4 | Tablet and mobile frames | ⏳ Not needed to start | 19 Oct: Hugo asked for first versions built from each variant's desktop behaviour (Section 7e), to iterate on; frames to follow only where needed |
| 5 | Font files | ✅ Done 15 Oct | TT Norms Pro, Melun Display UWA and Inter, working in the prototype |
| 6 | Test tasks | ⏳ Later | Used to set start pages and target pages, not to shape the build |
| 7 | Variant B designs | ✅ Received 15 Oct | Desktop mockup (labels predate the new IA). Built as v0.8 |
| 8a | Variant D and E brief | ✅ Received 15 Oct | Sidebar screenshot for D; E described in chat. Vertical and horizontal UWA logo SVGs supplied |
| 8 | Variant C brief | ✅ Received 15 Oct | Described in chat (no mockup): B's core pane plus two panels to the right, one level each, down to L3 |
| 9 | Reviewed 2026 IA spreadsheet | ✅ Received 15 Oct | 251 pages, 7 top-level items. Loaded as v0.6 (rows after Login's children are notes; navigation label and URL columns ignored) |
| 10 | Index page design | ✅ Received 15 Oct | Reference image: dark page, mark and rule, intro top left, large list of variant links. Exact typeface to come |

**Figma file:** THEUVP0058 – IA – Nav Refresh (`FyL49cxiOkRJCimoBCF9kw`). Read access confirmed through Hugo's account.

## 4. Technical approach

### Stack (decided 8 Oct 2026)

This is a testing prototype, not a production build, so the stack is chosen for speed of change rather than long-term maintenance.

- **Astro**, static output: one real HTML page and URL per sitemap node, per variant. This supports URL-based task success in Maze/Lyssna and deep links.
- **Astro components** named and structured to match the Figma components one-to-one (e.g. `PrimaryNavHeader`, `CorePane`, `DynamicPane`, `MenuItem`).
- **Plain TypeScript** for menu behaviour: open/close, keyboard support and focus management.
- **One base tokens file** (`src/styles/tokens.css`) of CSS custom properties for every tunable value (Section 5), with per-variant overrides.
- **CSS transitions** for menu motion (Section 8).
- **A Node script** that converts the sitemap CSV/spreadsheet into `sitemap.json` and validates it (orphans, duplicate labels, depth).
- **Hosting (phase 1, decided 8 Oct):** GitHub Pages from the public repo `hugo-j-vml/uwa-nav-proto`, deployed by a GitHub Actions workflow on every push to `main`. URL: `https://hugo-j-vml.github.io/uwa-nav-proto/`. A simple client-side password screen and `noindex` keep casual visitors and search engines out. This is **not real security**: the files, including the fonts, are still publicly reachable. Hosting to be revisited before the prototype is shared with the client.

### Data-driven build

- **`sitemap.json`** is the single source for the nav and every page, in every variant. If you change the IA, you regenerate this file and all variants update.
- **Content pages** are generated from the template for every sitemap node, with the page title, breadcrumb and wireframe placeholder blocks. Every link resolves, so there are no dead ends in testing.
- **Extra menu content** (e.g. descriptions or teasers on items), if a variant ever needs it, is kept in a separate file, not in the sitemap CSV. Not needed yet.

### Testing-specific features

- **Deep-linkable start points:** each variant's pages have their own URLs, so tasks can start on any page in any variant.
- **Variants by path** (replaces the earlier `?variant=` idea): see Section 4a.
- **Clean state per task:** no persisted state between sessions.
- **Accessible basics:** keyboard operation and correct ARIA for menus.
- **Optional facilitator overlay** (`?debug`): shows the current node ID, path and variant.

## 4a. Variants (decided 15 Oct 2026)

One repo, one build, one IA. Each nav concept is a **variant** that builds the full page tree under its own neutral path.

### URLs

| Path | Variant | Description | Status |
|------|---------|-------------|--------|
| `/uwa-nav-proto/` | Index | A short list of the variants with links. Behind the password screen. Layout and colours from Hugo's reference (see below). | ✅ Built 15 Oct |
| `/uwa-nav-proto/a/…` | **A** | The current prototype (v0.4): header, indented core pane, dynamic pane, current motion. Behaviour and design unchanged. | ✅ Moved 15 Oct |
| `/uwa-nav-proto/b/…` | **B** | Same header layout as A. A static core menu on the left with no indents that shows parent nodes; the chosen section opens in the wider white pane, where parents expand inline. | ✅ Built 15 Oct (v0.8, Section 7a) |
| `/uwa-nav-proto/d/…` | **D** | A fixed sidebar instead of the header (logo, search field, top-level items). Choosing an item opens a drill-down pane to the right. | ✅ Built 15 Oct (v0.11, Section 7c) |
| `/uwa-nav-proto/e/…` | **E** | A simpler sidebar (logo, search field, Menu button, shortcuts). The Menu button opens the same drill-down pane at the top level. | ✅ Built 15 Oct (v0.11, Section 7c) |
| `/uwa-nav-proto/f/…` | **F** | C without the depth limit: each level opens a new panel that stacks over the last, leaving a strip of the earlier ones showing. | ✅ Built 19 Oct (v0.30, Section 7f) |
| `/uwa-nav-proto/c/…` | **C** | A more static version of B: the same header and static core pane, then two panels to the right, one IA level each (L2, then L3). The menu goes down to L3. *(Replaces the earlier sidebar idea, 15 Oct.)* | ✅ Built 15 Oct (v0.9, Section 7b) |

- Paths are **neutral letters** so participants aren't cued by the URL.
- **No redirects** from the old root URLs. The current build hasn't been distributed.

### Index page (added to scope 15 Oct 2026)

- **Layout and colours** follow Hugo's reference: dark page (`#1a1a1a`), off-white text, a mark top left with a full-width rule under it, a short intro top left, and a large lettered list on the left, with the behaviour options in a column to its right, tops aligned (below 1280px wide the options sit under the list).
- **Each list item is a variant link**, e.g. "A. Core with expanding parent nodes". Variants not built yet are greyed out with a "Coming soon" tag and aren't links.
- **Typeface:** Snowflake Sans (Medium for the intro and links, Book for other copy), `--index-font`. The password screen uses the same layout and font.
- **Background** (v0.29, from Hugo's VML template reference): a fine halftone dot grid with soft diagonal facets of brighter dots that drift and pulse very slowly (CSS only; still for reduced motion). Index page and password screen. `--index-bg-*` tokens.
- **Also on the index page:** the Options section (behaviour options, Section 7d) and a footer with the VML wordmark and the version and last-updated time.
- All values (colours, sizes, list position) are `--index-*` tokens in `tokens.css`.

### Structure

- **Variant config** per concept (`src/variants/a.ts`, `b.ts`, `c.ts`): which header/shell layout, which menu layout, the motion preset and the token overrides. A new variant is a new config file, not copied code.
- **Shared core:** `sitemap.json`, the menu state module (open, selected path, close, step back), keyboard/ARIA/focus handling, `MenuItem`, content page templates and breadcrumbs.
- **Variant-specific:** shell and menu layouts (e.g. `HeaderA`, `SidebarC`, `PanelsB`), swapped in through the config.
- **Tokens:** `tokens.css` stays the base. Each variant's overrides are scoped under `[data-variant="b"]` etc., in a clearly marked block, so tuning stays hand-editable in one place.
- **Motion:** named presets stored as tokens and chosen per variant. **All variants start on A's motion preset**; each is then tuned separately.

### Codebase notes (checked 15 Oct, commit `f5e3fd3` "Shortcuts responsiveness")

- The repo builds cleanly: 140 pages.
- `src/layouts/Base.astro` hard-codes `PrimaryNavHeader` inside `.site`. This is the main point where the variant shell has to be swapped in (header for A/B, sidebar for C).
- The templates (`src/templates/*.astro`) are already independent of the header: they render inside `main.page`, and the header is overlaid with absolute positioning. Header-dependent spacing is in tokens (`--header-height`, `--panes-top`, `--breadcrumb-top`, `--landing-title-top` etc.), so C only needs token overrides.
- Menu behaviour lives in `src/scripts/menu.ts` and nav helpers in `src/lib/nav.ts`. These are the starting point for the shared menu state module.
- Routing: `src/pages/[...page].astro` plus `src/pages/index.astro`. The variant prefix (`/a/`, `/b/`, `/c/`) goes here, e.g. `src/pages/[variant]/[...page].astro`, with `index.astro` becoming the variant list.
- `astro.config.mjs`: `base: '/uwa-nav-proto'`, `trailingSlash: 'always'`, directory format. Keep these.
- The password gate stores its flag in `localStorage` under `uwa-nav-proto-auth`. Keep it shared across variants so testers only enter it once.
- **No `.gitignore` in the repo.** Add one first (`node_modules/`, `dist/`, `.astro/`).
- Deploy: `.github/workflows/deploy.yml` on push to `main`.
- **Access:** the build session needs `hugo-j-vml/uwa-nav-proto` attached as a repository with push access. Read-only cloning isn't enough to deploy.

### Build order

1. ✅ **Done 15 Oct (v0.7).** Refactor: pull the menu state out into a shared module, add the variant config and path prefixes, and move the current build to `/a/` with no visible change. Add the index page. **Acceptance:** every A page at `/a/…` looks and behaves exactly like the current root build (menu states, motion, reopen state, Esc/click-outside, shortcuts hiding below 800px). The index lists A, B and C, with B and C marked "coming soon" until they're built. Log it in `CHANGELOG.md`.
   - **Optional, before B and C designs land:** a working skeleton of C (sidebar shell plus the existing templates, top-level items only, as in Hugo's sketch), clearly marked work in progress. Only if Hugo asks for it; otherwise wait for the designs.
2. ✅ **Done 15 Oct (v0.8).** Variant B (Section 7a).
3. ✅ **Done 15 Oct (v0.9).** Variant C (Section 7b).

## 5. Tokens file: hand-editable values

All values Hugo will want to iterate on live in `src/styles/tokens.css` as commented CSS custom properties, grouped by purpose. To retune the whole prototype, you edit this one file. Per-variant overrides sit in their own scoped blocks (Section 4a). The starting values come from the Figma variables and frame measurements:

| Group | Examples (starting values from Figma) |
|-------|---------------------------------------|
| **Colour** | `--colour-black: #0a0a0a`, `--colour-white: #ffffff`, `--colour-vivid-blue: #0032ff`, `--colour-ironbark-20: #e0e1e0`, `--colour-ironbark-80: #848585`, `--colour-dynamic-pane-bg: #efeded` |
| **Type** | Font families; H1 60/1.1 Melun Display UWA Bold; H3 28/1.3 and H4 22/1.3 TT Norms Pro Medium; header buttons 16px Inter |
| **Header** | Header padding (20px / 27px), logo size, gap between buttons (12px), button sizes |
| **Panes** | Core pane width (483px), dynamic pane width (481px), pane padding (50px / 57px), pane top offset, dynamic pane min-height |
| **Menu items** | Item gap (8px), item height, row padding, arrow size (24px), **indent per nesting level** (starting value measured from the frame, ~18px) |
| **Selected state** | Selected row background (black) and text colour (white) |
| **Breakpoints** | Bands in `src/breakpoints.ts`; values per band in the "SCREEN SIZES" blocks of `tokens.css` (Section 7e) |
| **Motion** | Durations and easing per preset (Section 8) |

Nesting indent is applied as real padding per level, not with spaces in the text, so it's controlled by a single value.

## 6. Fonts

- ✅ **Done (15 Oct):** the real typefaces are working in the prototype: TT Norms Pro, Melun Display UWA and Inter. Snowflake Sans (VML) for the index page and password screen.
- Self-hosted with the prototype as WOFF2. Claude can convert OTF/TTF files if needed.
- ✅ **Licences:** Hugo confirmed licensing is fine (15 Oct).

## 7. Interaction specification (desktop, v1, variant A)

- **Clicks only.** No hover behaviour, so the system works the same on desktop, tablet and mobile.
- **The whole row is the target.** On each menu item, the full rectangle (label, arrow and the space between them) is one clickable element. The label and the arrow do exactly the same thing.
- **Menu button** toggles the core menu (L1 core pane) open and closed. The button shows its open state (Ironbark 80 background, white text) while the menu is open.
- **Clicking an item that has children** opens its sub-menu in the dynamic pane. The clicked item is nested under its parent in the core pane, following the Figma frames.
- **Clicking an item without children** goes to that page.
- **Selected state:** only the item whose sub-menu is showing in the dynamic pane gets a full-row contrast reversal (black background, white text). Its ancestors are not marked as selected. For example, with Study areas open, only Study areas is reversed; Study and Explore courses are not. *(Confirmed 8 Oct.)*
- **Header shortcuts** (Study / Impact / Research) go to the L1 landing page for that area. They don't open the menu. *(Confirmed 8 Oct.)*
- **Closing:**
  - Sub-menus close back to the core menu.
  - The core menu closes completely when the menu button is pressed again.
  - Esc and clicking outside both close the menu (v0.4).

## 7a. Interaction specification (desktop, variant B)

Agreed 15 Oct 2026. Everything not listed here is as variant A (Section 7).

- **Panes:** same total width as A (964px), split about 40/60: core pane 386px, white pane 578px, so the white pane has room for indents. The core pane keeps its own height; the white pane grows with the open branch.
- **Core pane:** top-level items only, static (never nested or indented), no arrows. Clicking the chosen item again closes the white pane.
- **White pane:** no heading. Lists the chosen section's items. Clicking a parent opens it **inline** (accordion): a ↓ appears on the right of its row (v0.27.2; was right after the label) and its children appear indented beneath it, one indent per level. **One branch open at a time:** opening a parent closes any other open parent at its level. Clicking an open parent closes it and everything below it.
- **Arrows:** none, except the ↓ on an open parent (black, as the mockup).
- **Highlight:** none. *(Changed 15 Oct, v0.9: the black blocks on the chosen section and the current page were removed.)*
- **Closing, Esc, click-outside, page-link motion:** as A. Always opens at the top level (v0.10).
- **White pane motion:** slides out from behind the core pane as in A. It's wider than the core pane, so it's clipped at the core pane's right edge while it moves (v0.29.5; same in C), rather than being seen crossing the strip to the menu's left.

## 7b. Interaction specification (desktop, variant C)

Agreed 15 Oct 2026. "A more static version of B." Everything not listed here is as variant A (Section 7).

- **Panes:** core pane 386px (as B), panel 1 481px on light grey (#d4d4d4), panel 2 481px on the white pane colour.
- **Core pane:** as B: top-level items only, static, no black highlight.
- **Panel 1:** a heading naming the chosen section, linking to its landing page (as A's dynamic pane heading; Hugo, v0.29.8), then the section's items (L2), one level only. Option 7's site block keeps the site's name as its heading.
- **Panel 2:** opens to the right when an L2 parent is chosen; a heading linking to the L2's page, as panel 1, then its items (L3), one level only. L3 items are always links, even if they have children, so the menu stops at L3. Slides out from under panel 1 (A's sub-menu motion).
- **Arrows** (Hugo, v0.29.11): the → marks the selected (open) item in the core pane and panel 1, lined up on the right edge as in A. Every other clickable item (other items, panel headings, panel 2 links, option 7's site name) shows its → only on hover or keyboard focus; each keeps the arrow's space, so nothing moves on hover (a few long labels, e.g. "Partners and community", wrap a line earlier than before). The co-brand switch rows ("UWA main menu" / "<site> menu") have no arrow. No black highlights.
- **Closing:** clicking an open item closes it and everything to its right. Menu button, Esc and click-outside as A.
- **Opening:** always at the top level with nothing chosen, as on the homepage (v0.10).
- **"In this section"** (v0.28, Hugo's mockup, 19 Oct): the menu stops at L3, so content pages at L3 or deeper that have children show an "In this section:" heading and a grid of boxes under the title, one per **direct child**, each linking to that child's existing page (no new pages). Not shown on pages without children. 19 pages in the current IA (e.g. Study areas, Entry pathways to UWA). Driven by `menuDepth: 3` in `src/variants/c.ts`, so any variant whose menu shows fewer levels gets it the same way. Grid: 4 columns on desktop, 3 on tablet, 2 on phones (`--section-*` tokens).

## 7f. Interaction specification (variant F)

Hugo's mockups, 19 Oct 2026 (two frames: one panel open; three panels open). Behaves as C (7b) except:

- **No depth limit:** every item with children opens a new panel, down to the deepest level of the IA (L5 today, so up to five panes on screen). No "In this section" grid (no `menuDepth`).
- **Stacking (desktop):** each new panel (481px) sits **over** the pane before it, leaving a 152px strip of each earlier pane showing (their labels are cut off at the strip's edge, as in the mockup). When the strips and the topmost panel don't fit the window (e.g. five panes at 1024px), the strips narrow to fit. At rest only the core pane shows, full width, as in C.
- **Panes under the topmost one** (Hugo, v0.30.1): no longer menus. Their items don't respond (no links, no hover arrows), so a half-hidden label can't take you to a page; clicking anywhere on one goes back to it, closing the panels above it (the core pane's strip: back to the core menu alone). Pointer cursor over them; from the keyboard, each is a "Back to …" button (Enter or Space).
- **Colour by distance from the top:** the topmost panel is the lightest (`#efeded`); each panel further back is mixed 28% further towards the core pane's grey (mockup: `#cfcfcf`, then `#b5b5b5`), never quite reaching it. Colours change smoothly as panels open and close. The core pane keeps its grey.
- **Motion:** a new panel is laid on the stack, coming in from a little to the right and fading in (and leaving the same way), rather than sliding out from under the pane before, which looked wrong with panels on top.
- **Headings, arrows, closing:** as C (headings link to the chosen item's page; → on the selected items, every item shows its → on hover).
- **Mobile and tablet:** as C's full-screen layers (7e), to any depth: Back, the heading, the items. Every layer is the topmost when you see it, so it's the light colour.
- **Co-branded pages:** options 1 and 2 as C. **Option 7 uses A's layout** (the site's block above a divider and the top level, in the core pane), as filling the first panel at rest would cover the core pane.
- Tokens: the `[data-variant="f"]` block (`--stack-peek`, `--stack-panel-width`, `--stack-top-bg`, `--stack-far-bg`, `--stack-fade-step`, `--stack-fade-max`, `--motion-stack-duration`).

## 7c. Interaction specification (desktop, variants D and E)

Agreed 15 Oct 2026.

- **Shell:** a fixed, full-height sidebar (277px, light grey) replaces the header; the page sits to its right. Top to bottom: vertical UWA logo (centred), a search input (not wired up: Enter shows "not available in this prototype"), then:
  - **D:** the top-level items.
  - **E:** a Menu button, then the Study / Impact / Research shortcuts.
- **Drill-down pane:** 540px wide; opens to the right of the sidebar, full height, sliding out from under it. Shows one level at a time: a heading (the item's name, linking to its page) and its children. Children with children have a →; choosing one replaces the pane's contents with the next level, sliding in from the right. A **Back** link at the top steps up a level. All levels are reachable.
- **D:** choosing a top-level item opens the pane at its children; that item gets a →, lined up on the right of the sidebar (v0.27.1). Choosing it again closes the pane; choosing another switches to it.
- **E:** the Menu button opens the pane at the top-level items (no heading, no Back); choosing one drills down as in D. The Menu button shows its open state as in A.
- **Closing:** the trigger again, Esc, or a click outside the pane and the trigger. Clicking a page link slides the pane away, then goes to the page. The menu always opens at the top (v0.10).
- **Logo:** the horizontal UWA logo replaces the header placeholder in A, B and C.

## 7d. Behaviour options and co-branded sites

Alternative behaviours are switched across all variants with **behaviour options** (`src/options.ts`), not new variants: on the index page, with the hidden Shift+O panel on any variant page, or with `?<option>=<choice>` in a link (sets and remembers it; use to preset test sessions).

**Co-brand menu** (default 1). Co-branded sites (e.g. Oceans Institute) have their own two-level IA (`data/cobranded/<slug>.csv`), kept out of the core tree; the site is a single link in the core menu. On the site's pages, A–C show a co-brand logo placeholder next to the UWA logo; D and E show it under the vertical UWA logo.
- **1 · Menu bar on page:** a bar under the breadcrumb with the site's sections and dropdowns; Menu stays the core menu.
- **2 · Replaces core menu:** Menu (D: the sidebar list) shows the site's sections in place of the top level, with a "UWA main menu" switch and back.
- **7 · Alongside core menu:** both at once. A, E: the site's block above a divider and the top level. B, C: the site's name and sections fill the white pane on open; choosing a top-level item shows that instead, and closing it brings the site back. D: the site's name and sections at the top of the sidebar, above a divider and the top-level items; a section opens the pane at its pages.

**Breadcrumbs on co-branded pages** (default Show): Show or Hide the breadcrumb on the site's pages.

**Shortcuts on co-branded pages** (default Hide): Show or Hide the shortcut links on the site's pages (A–C header, E sidebar; D has none).

Options 2 and 7 break "the menu always opens at the top level", on co-branded pages only.

## 7e. Compact layouts: mobile and tablet (all variants)

Agreed 19 Oct 2026. First versions, built from each variant's desktop behaviour, to iterate on. Hugo's brief: keep the variants distinct and close to their desktop partners; keep configuration to a minimum; A–C keep the header with a full-screen takeover; D and E get a sliding drawer from the left with a hamburger, as on the Material Design site.

**Breakpoints** (`src/breakpoints.ts`, the only place they're set). Hugo proposed mobile up to 400px; that would put common large phones (Pixel 412px, iPhone Plus/Pro Max 430–440px) in the tablet band, so we use the standard Tailwind CSS scale (sm 640, lg 1024), which the code already used:

| Band | Width | Examples | Menus |
|------|-------|----------|-------|
| Mobile | below 640px (works at 320px) | all phones in portrait | compact |
| Tablet | 640–1023px | iPad mini portrait (744/768), phones in landscape | compact |
| Desktop | 1024px and up | iPads in landscape (1024–1180), laptops | desktop (Sections 7–7c) |

`COMPACT` in the same file lists which bands use the compact layouts. An early script sets `data-bp` (band) and `data-layout` (`compact`/`full`) on `<html>`; `tokens.css` has an override block per band ("SCREEN SIZES"), and compact-only values in "COMPACT LAYOUTS". Crossing between the layouts closes any open menu.

**Per variant:**

| Variant | Shell | Menu (compact) | Mirrors desktop by… |
|---|---|---|---|
| **A** | Header stays; menu takes over the screen under it, sliding down | One list (the core pane). Choosing an item nests the path under its top-level item as on desktop, and its sub-menu (heading link, then children) opens **under the selected item**, inside the list. Black block on the selected item and the current page. | the dynamic pane opening inline instead of to the right |
| **B** | As A | One list. The chosen section's items open under it as an **accordion** (the white pane, inline); open items get ↓; one branch open at a time. | the white pane opening inline |
| **C** | As A | The core pane, panel 1 (L2) and panel 2 (L3) are **full-screen layers**: choosing an item slides the next panel in from the right; each panel starts with "← Back", then the panel's heading, as on desktop (v0.29.1). Arrows (v0.29.11): Back's ←, and a → on the selected item and on the item you came Back from, so you can see where you were; nothing else. Stops at L3. Panel colours as desktop. | panels stacking instead of sitting side by side |
| **F** | As A | As C, to any depth (no L3 limit). Each layer is the light colour (it's always the topmost). | as C |
| **D** | Top bar: hamburger, horizontal UWA logo, search icon. Hamburger slides the sidebar in from the left as a **drawer** under the bar, over a scrim. | Drawer: search field and the top-level items (→ on those that drill down). Choosing one slides the drill-down pane in from the right **over the drawer**: heading, children, Back; Back from the first level returns to the drawer. | the sidebar becoming the drawer; the drill-down pane as on desktop |
| **E** | As D | The hamburger opens the drawer straight on the drill-down pane at the top level (no Menu button step, no Back at the top level, as the hamburger closes it); choosing an item drills down as on desktop. The drawer's Menu button and shortcuts aren't shown. | the sidebar becoming the drawer, Menu button step skipped (v0.29.6) |

**Common:** the hamburger again (D, E), the Menu button again (A–C), Esc, or a tap outside closes; a page link closes the menu first, then navigates; the page behind doesn't scroll while a menu is open.

**Co-branded pages:** A–C header: the co-brand logo placeholder is as tall as the smaller UWA logo (42px) and as wide as fits (56px at 320, up to 96px from 360), 16px from it (v0.29.7; same in D and E's top bar), and on mobile the Menu button shows just its icon so it all fits at 320px. D, E: the placeholder sits in the top bar after the UWA logo. Option 1's menu bar wraps onto more rows. Options 2 and 7 work as on desktop, except **option 7 in B and C** uses A's layout (the site's block above a divider and the top level), as there's no white pane beside the core pane to fill.

**Tablet** uses the same compact menus, with the desktop header (A–C) and a 400px drawer (D, E); only sizes differ (tokens).

## 8. Motion

Built in v0.4 for variant A, and saved as preset "A":

- The menu slides down to open and up to close (500ms, ease-out).
- Sub-menus close by retreating to the left, sliding underneath the core menu (200ms), and slide back out to open (300ms). A pane wider than the one it slides from (B's white pane, C's panels) is clipped at that pane's right edge while it moves, so it always seems to come from behind it (v0.29.5).

All variants start on preset A. Per-variant tweaks come as Figma notes.

## 9. Responsive behaviour

- The prototype responds live to the browser width, so the same build shows the desktop, tablet and mobile behaviour on real devices and by resizing a browser.
- **Built 19 Oct (v0.27):** compact layouts for mobile and tablet in all five variants (Section 7e). The interim stacked panes (rejected 12 Oct) are gone.
- Header shortcuts (A–C) still hide below 800px wide, where they don't fit beside the Menu button.

## 10. Phases

| Phase | Output | Checkpoint |
|-------|--------|------------|
| **0. Inputs and audit** | Inventory of components and states; gaps logged | ✅ Desktop menu section audited (8 Oct) |
| **1. Data model** | `sitemap.json` and validation report | Hugo checks it against the sitemap |
| **2. Desktop nav** | Header, core pane and dynamic pane in all states, click-only, with selected states and the tokens file | ✅ v0.1 built 8 Oct with stand-in sitemap (Figma labels only); awaiting Hugo review |
| **3. Content pages** | Generated pages for every node, with breadcrumbs and current-state indicators | ✅ v0.2 (8 Oct): landing, content, course and co-branded templates from Figma section *Page templates* (`607:11926`), assigned via a `template` column in the sitemap CSV |
| **4. Tablet and mobile** | Responsive layouts and breakpoints | ✅ First versions built 19 Oct (v0.27, Section 7e); Hugo reviews and iterates |
| **5. Motion** | Transitions per Section 8 | ✅ v0.4 (9 Oct): menu slides down/up 500ms ease-out; sub-menu retreats left under the core pane (200ms) and slides back out (300ms) |
| **5a. Variants** | Variant setup, index page, A moved to `/a/`, then B–E | ✅ All five built 15 Oct (v0.7–v0.11); behaviour options for cross-variant experiments (v0.18) |
| **6. Test readiness** | Deep links, hosting, and a pilot run in Maze/Lyssna | A pilot task completes cleanly in the testing tool |
| **7. Iteration** | Updates between test rounds via the Section 12 workflow | Ongoing |

## 11. Open questions

**Interaction**

1. ~~Is the selected style applied to ancestors too?~~ **Resolved:** only the item whose sub-menu is showing (Section 7).
2. ~~Esc / click outside?~~ **Resolved:** both close the menu (v0.4).
3. The dynamic pane heading (e.g. "Study areas" with an arrow): does clicking it go to that section's landing page?
4. ~~Reopen state?~~ **Resolved:** the menu opens at the current page's section, with its nearest parent selected (v0.4). **Changed 15 Oct (v0.10):** the menu always opens at the top level with nothing chosen, as on the homepage, in every variant.
5. ~~What do the header shortcuts do?~~ **Resolved:** they go to the L1 landing pages (Section 7).
6. Search button: should it work, or show a static "not available in this prototype" message?

7a. ~~Stand-in sitemap~~ **Resolved:** real IA loaded (v0.3). Agreed rules: skipped levels go under the most recent item one level up (the Strengths L5s sit under Indigenous research UWA); "Specific …" rows are built once each, as written, and "Specific course pages" uses the course template.
7a-ii. Sitemap content to revisit: the About block is a copy of Partners and Community. Convocation contains Animal care services and other copied items. Giving is not included.
7b. **Built as assumptions, to confirm:**
   - The dynamic pane heading (e.g. "Study areas" with arrow) links to that section's landing page.
   - Clicking the selected item closes its sub-menu, stepping back one level.
   - Closing the menu resets it; reopening starts at the top level.
   - Esc closes the menu.
   - Menu arrows match their label colour (`--item-arrow-colour`, v0.29.3; were Vivid Blue): white on the grey core pane and on selected rows, black on light panes.
7c. The closed-state frame (1) has a hidden 11th top-level item, **Giving**, that isn't in the open frames. Should it be in or out? (Currently out.)
7c-ii. ~~Co-branded breadcrumb~~ **Resolved (v0.15.1):** co-branded pages use the short form, UWA › site name; pages in the site's own IA continue from there.
7c-iii. Course page Enquire/Apply buttons and the in-page tabs bar are static (no action). Should they do anything in testing?
7d. The Impact and Research header shortcuts don't match any item in the menu, so they have stand-in landing pages. Should Research go to "Our research"?

7e. Reviewed IA (15 Oct), to confirm: "Campus initiatives or Campus development or Campus management" is built as written; which one? "Applicants (or apply portal…)" and "Agents (or International agents)" are built as Applicants and Agents. Students › Academic support has a child also called Academic support.
7f. Index page: B is "Static core with dynamic panel" (Hugo, 15 Oct); C's name ("Static core with two panels") and D/E's names are stand-ins. Intro copy: "UWA Navigation Prototyping System" (Hugo, v0.21.1).
7g. Co-branded sites, open: which Co-brand menu option goes forward (1, 2 or 7, being tested); whether search on co-branded pages covers the site, UWA or both; the co-brand menu's visual design (switch rows, headings and the option 1 bar are wireframe stand-ins).

7h. Compact layouts (v0.27), built as assumptions, to confirm:
   - A: the sub-menu's heading row repeats the selected item's name (as desktop's dynamic pane heading does), so the section's page stays reachable.
   - D: the → on every top-level item in the drawer (desktop shows it only on the open one).
   - E: the hamburger goes straight to the top level (Hugo, v0.29.6). The Study / Impact / Research shortcuts don't appear on mobile and tablet; Hugo: fine for now.
   - Co-branded pages on mobile, A–C: the Menu button shows only its icon. Option 7 in B and C uses A's layout.
   - Tablet uses the compact menus; landscape iPads (1024px and up) get desktop.
   - The Shift+O options panel needs a keyboard; on phones, preset options with a link (e.g. `?cobrand-menu=7`).

**Testing and hosting**

7. Which testing tool is primary for the unmoderated round: Maze or Lyssna?
8. ~~Is password protection needed?~~ **Phase 1:** simple password screen on GitHub Pages. Proper protection to be decided before client sharing.
9. Are utility nav, footer and audience gateways in scope, or only the global header and menu?
10. ~~Will we test more than one nav concept?~~ **Resolved 15 Oct:** yes, three variants by path (Section 4a).
10a. ~~Do C's content pages need their own layout?~~ **Superseded 15 Oct:** C now uses the header, so it uses the same templates and spacing as A. *(Earlier answer, for the sidebar idea:)* same templates. The sidebar sits on the left and the page column takes the remaining width; only spacing tokens (e.g. title and breadcrumb offsets that assumed the header band) are overridden for C. Hugo's first sketch: a grey sidebar with the 10 top-level items as plain text, vertically offset, with the hero running to the top of the page column.
10b. ~~Variant C sidebar details~~ **Superseded 15 Oct:** C is now a header variant with two panels (Section 7b).

**Fonts**

11. ~~Do the font licences allow web embedding?~~ **Resolved:** yes (Hugo, 15 Oct).

## 12. Figma handover conventions

- **Send sections, not single frames.** Select the section, then *Copy link to selection* (⌘L / Ctrl+L). One link per state journey.
- **Name frames in journey order,** e.g. `Desktop / Menu / 03 – Study open`. For variants, prefix with the variant letter, e.g. `B / Desktop / Menu / 03 – Study open`.
- **Use real nesting or padding** for indentation, not spaces in the text, where practical. (Claude will handle it in code either way.)
- **Put behaviour notes next to frames** (Dev Mode annotations or text layers) for anything the visuals don't show: interactions, closing behaviour, motion values.
- **Update workflow:**
  1. Hugo updates Figma or the sitemap and sends the changed section link.
  2. Claude pulls the updated specs and updates the tokens, components or `sitemap.json`.
  3. Claude logs the change in `CHANGELOG.md` (noting which variant) and republishes to the same URLs, so links in testing tools don't break.

## 13. Out of scope (v1)

- Visual or brand design beyond wireframe, real content and imagery
- Any IA or labelling recommendations from Claude
- Analytics beyond what the testing tools capture
- Extra menu content (descriptions, teasers) until a variant needs it
