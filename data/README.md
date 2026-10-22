# The IA: the existing www.uwa.edu.au navigation

Every prototype (A–H and CONTROL-1) builds from the IA of the **existing** UWA website, as its navigation presents it (from v1.3.0, 22 Oct 2026; Hugo's team chose to test with the existing IA). The proposed IA used until then is kept, unused, in `proposed-ia/`.

Recorded from www.uwa.edu.au on 22 Oct 2026.

## What's in it

| File | Contents |
|---|---|
| `sitemap.csv` | The live IA: 345 rows (344 pages once a duplicate is merged), 11 top-level items, five levels deep (four in the live menu, plus the course pages below). The usual columns (README "The sitemap CSV"), plus `url` (the live page) and `notes`, which are for reference and not used. |
| `proposed-ia/` | The proposed IA (`sitemap.csv`, `cobranded/`) the prototypes used until v1.2.1. Not used. |
| `cobranded/*.csv` | The menus of the five pages that are sites with their own header on the live site, as two levels (L1, L2), plus `url`. |

Top level, in the live order: **Study** (69 pages), **Life at UWA** (13), **Our research** (29), **Partners and community** (63), **About us** (56), then the live "More" dropdown's links: **News** (20), **Events** (1), **Library** (own site), **Current students** (69), **Staff** (external), **Giving** (external).

## How it was put together

- **The homepage's mega menus** give each section's L2 and L3 pages.
- **Each section's own header row** was read on its landing page and on each of its L2 pages, because the row's dropdowns differ from page to page (e.g. Accommodation only has a dropdown on its own page). The dropdowns also hold a nested fourth level that the live menu doesn't show (e.g. Meet the Executive › each executive), so L4 pages come from there.
- These were merged by page address. The section row's order comes first, then anything only in the mega menu.
- A row only counts for an item when most of its links sit under that item's address. For example, Events lives at /study/events and shows Study's row, so it gets none.

## Decisions to know about

- **The one change from the live IA (Hugo, 22 Oct, v1.3.1):** Study › Explore courses › Study areas has the 11 study areas under it (the live Study areas page lists them, but the live menu doesn't), and each area has a **Course page** under it, using the course page template (a stand-in for that area's courses). Marked in `notes`.

- **Sites with their own header** use the co-branded template, with their menus in `cobranded/`:
  - **Sport and fitness**: Life at UWA › Sport and fitness goes to the UWA Sport site.
  - **Library**: a top-level item, from More.
  - **Oceans Institute, The UWA Institute of Agriculture, UWA Public Policy Institute**: the prototypes' co-branded examples. They aren't in the live menu (they're listed on the Institutes and centres page), so they sit under Our research › Institutes and centres, as in the proposed IA.
- **Site menus have two levels** in the prototype's format. The deeper pages in their live menus aren't kept: Sport 8, Library 9, Oceans Institute 1.
- **News › Latest news** lists the latest 40 articles on the live site. Those change daily, so the item is kept without them.
- **External links** (left uwa.edu.au) are kept as pages and marked in `notes`. They are: Staff (the intranet), Giving (both places), Our alumni, and Clubs and societies and Student Guild (both redirect to the UWA Student Guild site).
- **Pages that redirect elsewhere** are kept where the menu puts them, with the redirect in `notes`:
  - Life at UWA › Study abroad goes to Study › Discover UWA › Student Exchange.
  - Our research › Research degrees goes to Study › Higher Degree by Research.
  - About us › Contact us goes to /contact-us.
- **Labels are as live**, including their capitalisation (e.g. "About Us" in UWA Sport's menu, "music auditions").
- **Repeated labels:** the live IA repeats some names in different places: Accommodation (3 times), Events (3), Life at UWA, Our campus, UWA Albany, International students, Arts and culture, Clubs and societies, Industry partnerships, News, Giving, Contact us and Research internships. The build warns about these, but they're allowed.
- **One true duplicate:** Partners and community › Convocation › News lists "Food Drive" twice, so the build merges it.
- **Templates:** landing for the top level, content for everything else, except the five sites. No course pages (the live course pages sit behind the course search, not in the menu).

## Settings that name pages in this IA

- **Shortcuts** (`src/data/header.json`): Study → Study, Impact → News (the live site calls News "UWA Impact"), Research → Our research.
- **CONTROL-1's More list** (`mega.more` in `src/variants/control-1.ts`): News, Events, Library, Current students, Staff and Giving, as the live More dropdown.
- **CONTROL-1's logo lockups** (`mega.lockups`): Oceans Institute (`our-research/institutes-and-centres/oceans-institute`).

To go back to the proposed IA: copy `proposed-ia/sitemap.csv` and `proposed-ia/cobranded/` back to `data/`, and set those three back to their v1.2.1 values (Study → `study-at-uwa`, Impact → `about-us/news`; More → `students`, `login`, `about-us/news`; the lockup path in the proposed IA, `our-research/institutes-and-centres/centres-and-other-entities/oceans-institute`).

## Updating it

The live site changes, so this is a snapshot. To refresh it, re-run the extraction: a Playwright script that reads the homepage's mega menus and each section's header row on its pages. Ask Claude to re-extract the live IA. The scripts aren't kept in the repo.
