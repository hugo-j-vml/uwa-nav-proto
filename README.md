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
| Fonts | Put the files in `public/fonts/` (names in `src/styles/fonts.css`) |
| Layout/structure of components | `src/styles/components.css` and `src/components/` |
| Menu behaviour | `src/scripts/menu.ts` |

Every push to `main` rebuilds and republishes the site automatically (see the **Actions** tab). It usually takes 1–2 minutes.

### The sitemap CSV

One column per level (`L1`, `L2`, `L3`, …). Each row has its label in exactly one column, and its parent is the nearest row above it one level up:

```
L1,L2,L3
Study,,
,Explore courses,
,,Find a course
Life at UWA,,
```

Page URLs come from the labels (e.g. `study/explore-courses/find-a-course/`). Items with children open a sub-menu; items without children link to their page. The build stops with a clear message if the CSV has problems (e.g. a row with two columns filled, or a level skipped).

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
