# UWA navigation prototype

A coded, clickable prototype of the proposed UWA main website navigation, for user testing (Maze/Lyssna and 1:1 sessions). Wireframe fidelity. **Not a production build.**

- **Live site:** https://hugo-j-vml.github.io/uwa-nav-proto/
- **Password:** set in `src/config.ts` (simple screen only; not real security, the site files are public).
- **Design source:** Figma "THEUVP0058 – IA – Nav Refresh", section *Core menu opens with submenu journey*.

## What to edit

| To change… | Edit… |
|---|---|
| Spacing, sizes, colours, type, indent, selected style | `src/styles/tokens.css` (all values in one place) |
| The IA / menu structure and labels | `data/sitemap.csv` (one column per level; see below) |
| Header shortcut buttons (Study / Impact / Research) | `src/data/header.json` |
| Password | `src/config.ts` (see below) |
| Fonts | Put the files in `public/fonts/` (names in `src/styles/fonts.css`). Novel Pro falls back to Crimson Pro (free). |
| Layout/structure of components and templates | `src/styles/components.css`, `src/components/` and `src/templates/` |
| Menu behaviour | `src/scripts/menu.ts` |

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

Page URLs come from the labels (e.g. `study/explore-courses/find-a-course/`). Items with children open a sub-menu; items without children link to their page. The build stops with a clear message if the CSV has problems (e.g. a row with two level columns filled, a level skipped, or an unknown template).

Optional columns, in any order:

| Column | Values | Notes |
|---|---|---|
| `template` | `landing`, `content`, `course`, `cobranded` | Blank = `landing` for L1, `content` for everything else |
| `eyebrow` | text | Course pages: small heading above the title (e.g. Undergraduate) |
| `intro` | text | Course pages: line under the title |
| `body` | text | Course pages: paragraph under the in-page tabs |

Blank course fields fall back to the Landscape Architecture Studies copy from Figma.

```
L1,L2,L3,L4,template,eyebrow,intro,body
Oceans Institute,,,,cobranded,,,
,,,Landscape Architecture Studies,course,Undergraduate,"Grow your creative...","In the Landscape..."
```

### Page templates (Figma section *Page templates*)

- **Landing**: placeholder with the title over it. Also used for the homepage.
- **Content**: breadcrumbs, title, then placeholders.
- **Course**: hero with eyebrow, title, intro, Enquire/Apply; in-page tabs bar, body copy, 3-column cards.
- **Co-branded site**: breadcrumbs, sage hero with the site name (Novel Pro), sage tiles.

### Changing the password

Generate the SHA-256 hash of the new password and paste it into `PASSWORD_SHA256` in `src/config.ts`:

- with Node installed: `npm run hash-password -- "new password"`
- or any SHA-256 generator (lower-case hex output).

## Behaviour (v1)

- Click only, no hover. The whole row (label, space and arrow) is the click target.
- **Menu** opens the core pane. Clicking an item with children shows them in the dynamic pane and nests the item under its parent in the core pane.
- Only the item whose sub-menu is showing is selected (black block, white text).
- Clicking the selected item closes its sub-menu. **Menu** again, or **Esc**, closes everything.
- The dynamic pane heading links to that section's landing page.
- No animation yet (planned).

## Running locally (optional)

Requires Node 20+.

```
npm install
npm run dev      # http://localhost:4321/uwa-nav-proto/
npm run build    # outputs to dist/
```
