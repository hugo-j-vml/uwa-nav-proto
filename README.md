# UWA navigation prototype

A coded, clickable prototype of the proposed UWA main website navigation, for user testing (Maze/Lyssna and 1:1 sessions). Wireframe fidelity. **Not a production build.**

- **Live site:** https://hugo-j-vml.github.io/uwa-nav-proto/ (index of variants: opens on phase 2; phase 1 is https://hugo-j-vml.github.io/uwa-nav-proto/#phase-1)
- **Phase 2:** **G** https://hugo-j-vml.github.io/uwa-nav-proto/g/ · **H** https://hugo-j-vml.github.io/uwa-nav-proto/h/
- **Phase 1 (for reference):** [A](https://hugo-j-vml.github.io/uwa-nav-proto/a/) · [B](https://hugo-j-vml.github.io/uwa-nav-proto/b/) · [C](https://hugo-j-vml.github.io/uwa-nav-proto/c/) · [D](https://hugo-j-vml.github.io/uwa-nav-proto/d/) · [E](https://hugo-j-vml.github.io/uwa-nav-proto/e/) · [F](https://hugo-j-vml.github.io/uwa-nav-proto/f/)
- **Plan:** `plan.md`
- **Password:** set in `src/config.ts` (simple screen only; not real security, the site files are public).
- **Design source:** Figma "THEUVP0058 – IA – Nav Refresh", section *Core menu opens with submenu journey*.

## What to edit

| To change… | Edit… |
|---|---|
| Spacing, sizes, colours, type, indent, selected style | `src/styles/tokens.css` (all values in one place; per-variant overrides in the blocks at the end) |
| Breakpoints (mobile / tablet / desktop widths) and which sizes use the compact menus | `src/breakpoints.ts` (the only place they're set) |
| Sizes per screen size; compact-layout values (takeover, top bar, drawer, their motion) | `src/styles/tokens.css`: "SCREEN SIZES" blocks (one per band, after the variant blocks) and "COMPACT LAYOUTS" |
| Index page look (colours, font, sizes, the animated dot background) | `--index-*` tokens in `src/styles/tokens.css` (background: `--index-bg-*`, e.g. dot spacing, facet brightness, wave and pulse speed) |
| Variant names, and which variants are built | `src/variants/a.ts` … `h.ts` (`phase`: which index screen lists it, 1 or 2; `status: 'ready'` or `'coming-soon'`; `menuDepth`: how many levels the menu shows, which switches on "In this section" below that, e.g. C: 3; `fixedOptions`: options fixed for that variant, e.g. G and H's co-brand tabs) |
| The IA / menu structure and labels | `data/sitemap.csv` (one column per level; see below) |
| A co-branded site's own pages (e.g. Oceans Institute) | `data/cobranded/<page slug>.csv`, columns L1 and L2 (two levels). Kept out of the core menu tree; how they appear in the menus depends on the Co-brand menu option. |
| Behaviour options (alternative behaviours switched on the index page, with Shift+O on any variant page, or with `?<option>=<choice>` in a link) | `src/options.ts` (see below) |
| Header shortcut buttons (Study / Impact / Research) | `src/data/header.json` |
| Password | `src/config.ts` (see below) |
| Fonts | Put the files in `public/fonts/` (names in `src/styles/fonts.css`). Novel Pro falls back to Crimson Pro (free). Index page and password screen: Snowflake Sans (`--index-font`). |
| Layout/structure of components and templates | `src/styles/components.css`, `src/components/` and `src/templates/` |
| Menu behaviour (desktop and compact) | `src/scripts/menu.ts` (A, B, C, F), `src/scripts/sidebar-menu.ts` (D, E), `src/scripts/pane-menu.ts` (G, H: the menu pane and its search), shared state in `src/lib/menu-state.ts`; option 1's co-brand menu bar: `src/components/SiteNav.astro` + `src/scripts/site-nav.ts` |
| G and H's shells and pane | `src/components/PaneHeader.astro` (G), `PaneSidebar.astro` (H), `MenuPane.astro` (the pane, shared); sizes in the "Phase 2" tokens in `tokens.css` |
| Index page phases (the Phases control and the slide between phases) | `src/pages/index.astro`; `--index-phase-*` tokens |
| Logos | `public/logos/` (horizontal: header; vertical: sidebar). Co-brand logo: a placeholder box (`--cobrand-logo-*` tokens) |
| Version number on the index page | The latest heading in `CHANGELOG.md` (add an entry for each change). "Last updated" is the build time, in Perth time. |

Every push to `main` rebuilds and republishes the site automatically (see the **Actions** tab). It usually takes 1–2 minutes.

### The sitemap CSV

One column per level (`L1`, `L2`, `L3`, …). Two layouts work, and can be mixed:

- **Indented:** one label per row; its parent is the nearest item above it one level up.
- **Paths:** a row lists a chain left to right. Repeating a parent (e.g. `Study` on several rows) merges into one item.

```
L1,L2,L3
Study,Study areas,Architecture and Design
,,Business and Commerce
Study,Find a course,Undergraduate courses
Life at UWA,,
```

If a row skips a level (e.g. an L5 with no L4 on that row), the item goes under the most recent L4 above it, and the build log shows a warning.

Page URLs come from the labels, under each variant (e.g. `a/study-at-uwa/explore-courses/find-a-course/`). Items with children open a sub-menu; items without children link to their page. The build stops with a clear message if the CSV has problems (e.g. a row with two level columns filled, a level skipped, or an unknown template).

Optional columns, in any order:

| Column | Values | Notes |
|---|---|---|
| `template` | `landing`, `content`, `course`, `cobranded` | Blank = `landing` for L1, `content` for everything else |
| `eyebrow` | text | Course pages: small heading above the title (e.g. Undergraduate) |
| `intro` | text | Course pages: line under the title |
| `body` | text | Course pages: paragraph under the in-page tabs |
| `abbreviation` | text | Co-branded pages: short name for the site's tab in the menu (Co-brand menu option 2), for a long name, so it doesn't wrap. Blank = the full name |

Blank course fields fall back to the Landscape Architecture Studies copy from Figma.

```
L1,L2,L3,L4,template,eyebrow,intro,body
Oceans Institute,,,,cobranded,,,
,,,Landscape Architecture Studies,course,Undergraduate,"Grow your creative...","In the Landscape..."
```

### Page templates (Figma section *Page templates*)

- **Landing**: placeholder with the title over it. Also used for the homepage.
- **Content**: breadcrumbs, title, then placeholders. In variants whose menu stops short of the page's children (C, below L3), an "In this section" grid of boxes linking to the page's children sits under the title (`src/components/InThisSection.astro`, `--section-*` tokens).
- **Course**: hero with eyebrow, title, intro, Enquire/Apply; in-page tabs bar, body copy, 3-column cards.
- **Co-branded site**: short breadcrumb (UWA › site name), sage hero with the site name (Novel Pro), sage tiles. In A–C the header shows a co-brand logo placeholder next to the UWA logo (shortcuts per the option below); in D and E the placeholder sits under the vertical UWA logo.
- **Co-branded site pages** (the pages in a site's own IA): breadcrumb from the site (UWA › site › section › page), serif title, placeholders.

### Changing the password

Generate the SHA-256 hash of the new password and paste it into `PASSWORD_SHA256` in `src/config.ts`:

- with Node installed: `npm run hash-password -- "new password"`
- or any SHA-256 generator (lower-case hex output).

## Behaviour

Full specs per variant are in `plan.md` (sections 7–7d). In short:

- Click only, no hover; the whole row is the click target. **Esc**, the trigger again, or a click outside closes the menu. Page links slide the menu away, then navigate.
- The menu **always opens at the top level**, as on the homepage, wherever you are (except on co-branded pages with Co-brand menu options 2 and 7).
- **A** Core with expanding parent nodes: chosen parents nest in the core pane; their children show in the dynamic pane, with a heading linking to the section. Black block on the selected item and the current page.
- **B** Static core with dynamic panel: static core pane; the white pane shows the chosen section as an accordion.
- **C** Static core with two panels: core pane, panel 1 (L2), panel 2 (L3), each panel with a heading linking to the chosen item's page; stops at L3.
- **D** Sidebar with drill-down: fixed sidebar with the top-level items; a 540px pane drills down one level at a time, with Back.
- **E** Sidebar menu button: fixed sidebar with a Menu button and shortcuts; Menu opens the same pane at the top level.
- **F** Stacking panels: C without the L3 limit. Each level opens a panel that stacks over the last, leaving a strip of each earlier one showing; the topmost is lightest, earlier ones darker (`[data-variant="f"]` tokens).

**Phase 2** (from 20 Oct; `plan.md` Section 14):

- **G** Header with menu pane: A–C's header; Menu opens one pane under it that shows one level at a time, as E's: the chosen item as a heading (a link to its page), its children, and Back. Search opens the same pane with a search field.
- **H** Sidebar with menu pane: E's sidebar and pane, with search in the pane (the sidebar's search button looks like E's field).
- A promo placeholder sits at the bottom of the pane, at its top level only (design to come; `--pane-promo-*` tokens).
- Search lists the pages whose names contain every word typed (IA and co-branded sites' pages), with their trail; each links to its page.
- Co-branded pages always use the tabs (co-brand menu option 2).

### Mobile and tablet (compact layouts)

Below 1024px wide (bands in `src/breakpoints.ts`: mobile under 640, tablet 640–1023) each variant keeps its desktop behaviour in a compact form (full spec: `plan.md` 7e):

- **A–C, F** keep the header; the menu takes over the screen under it. **A**: one list, the selected item's sub-menu opens under it. **B**: one list, the chosen section opens under it as an accordion. **C**: the panels become full-screen layers that slide in from the right, each with Back and a heading linking to the chosen item's page. **F**: as C, to any depth.
- **D, E**: a top bar (hamburger, logo, search) replaces the sidebar; the hamburger slides the sidebar in from the left as a drawer. The drill-down pane slides in over the drawer, with Back. D's drawer lists the top-level items; in E the hamburger opens straight on the pane at the top level (no Menu button step).

## Behaviour options

Alternative behaviours that apply across every variant, without making new variants. Defined in `src/options.ts`; each choice is remembered per browser.

- **Index page:** in a column to the right of the variant links, starting level with the intro (under the links below 1280px wide), a headline per option and its choices; the filled-in choice is the current setting. Each phase's screen lists its own options.
- **Any variant page:** Shift+O shows a hidden panel (bottom right) with that variant's phase's options; choosing reloads the page.
- **Links:** `?cobrand-menu=7` (or `?cobrand-menu=7&cobrand-shortcuts=show`) on any URL sets and remembers a choice (for presetting test sessions); it's then dropped from the address.

Each option belongs to a phase (`phases` in `src/options.ts`) and only applies to that phase's variants. Current options:

**Phase 1 (A–F)**

| Option | Choices |
|---|---|
| Co-brand menu behaviour (`cobrand-menu`) | **1** Menu bar on page (default): a bar under the breadcrumb with the site's sections and dropdowns. **2** Replaces core menu: the menu shows the site's sections, with two tabs at the top (UWA on the left, the site's name or abbreviation on the right; the site's is selected on load) to swap between them and the UWA main menu. **7** Alongside core menu: both together (A, E: site block above a divider and the top level; B, C: the site's name and sections fill the white pane on open, until a top-level item is chosen; D: the site's name and sections at the top of the sidebar, above a divider and the top level; a section opens the pane). |
| Breadcrumbs on co-branded pages (`cobrand-breadcrumbs`) | **Show** (default) or **Hide** the breadcrumb on a co-branded site's pages, all variants. Hidden, the first thing on the page (hero or title) starts where the breadcrumb was; option 1's menu bar sits straight under the header instead (no gap). |
| Shortcuts on co-branded pages (`cobrand-shortcuts`) | **Show** or **Hide** (default) the shortcut links (Study, Impact, Research) on a co-branded site's pages: A–C header, E sidebar. D has none. Other pages always show them. |

**Phase 2 (G, H)**

| Option | Choices |
|---|---|
| Shortcuts (`shortcuts`) | **Show** (default) or **Hide** the shortcut links (Study, Impact, Research) on every page: G header, H sidebar. |
| Search (`search`) | **Show** (default) or **Hide** the search buttons. |
| Back button in the menu (`menu-back`) | **Back** (default) or **Previous level's name**: the name of the level Back goes to, e.g. "← Study at UWA" above the Explore courses heading ("Main menu" from a top-level item; the site's name on a co-branded site's tab). |
| Arrows in the menu (`menu-arrows`) | **All** (every item and the heading), **Only items with children**, **All except headings**, **None** (default). Back always keeps its arrow. |
| Breadcrumbs on co-branded pages (`cobrand-breadcrumbs`) | As phase 1 (shared). |

The co-brand menu is fixed to option 2 (the tabs) in G and H (`fixedOptions` in `src/variants/g.ts`, `h.ts`).

To add an option: add an entry to `src/options.ts` (with its `phases`), then branch on it in CSS (`[data-opt-<id>="<choice>"]` on `<html>`) or in scripts (`getOption('<id>')` from `src/lib/options.ts`).

## Running locally (optional)

Requires Node 20+.

```
npm install
npm run dev      # http://localhost:4321/uwa-nav-proto/
npm run build    # outputs to dist/
```
