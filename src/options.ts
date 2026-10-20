/**
 * Behaviour options: alternative behaviours that can be switched on any
 * variant without making new variants. Pick them on the index page, with the
 * hidden switcher on any variant page (Shift+O), or with a link such as
 * …/a/?cobrand-menu=7 (sets and remembers the choice; handy for test sessions).
 *
 * To add an option: add an entry here, then branch on it in CSS with
 * [data-opt-<id>="<choice>"] on <html>, or in scripts with getOption('<id>')
 * from src/lib/options.ts. The choice is remembered per browser.
 *
 * Each option belongs to one or more prototyping phases (`phases`): it's listed
 * on that phase's index page and in the Shift+O panel on that phase's variants,
 * and only applies to their pages (phase 1: A–F; phase 2: G, H).
 */
export interface OptionChoice { id: string; label: string; tag?: string } // tag: shown in bold before the label (e.g. the option's number)
export interface OptionDef {
  id: string;            // used in links (?id=choice) and as data-opt-<id> on <html>
  label: string;
  description: string;
  choices: OptionChoice[];
  default: string;
  phases: (1 | 2)[];
  /** Short option (e.g. Show / Hide): sits side by side with the short options next to it in the list */
  short?: boolean;
}

export const OPTIONS: OptionDef[] = [
  {
    id: 'cobrand-menu',
    label: 'Co-brand menu behaviour',
    description: 'How a co-branded site’s own menu (e.g. Oceans Institute) behaves on its pages.',
    choices: [
      { id: '1', tag: '1', label: 'Menu bar on page' },
      { id: '2', tag: '2', label: 'Replaces core menu' },
      { id: '7', tag: '7', label: 'Alongside core menu' },
    ],
    default: '1',
    phases: [1], // phase 2: always 2 (the tabs), fixed in src/variants/g.ts and h.ts
  },
  {
    id: 'cobrand-shortcuts',
    label: 'Shortcuts on co-branded pages',
    description: 'Whether the shortcut links (Study, Impact, Research) show on a co-branded site’s pages (A–C header, E sidebar).',
    choices: [
      { id: 'show', label: 'Show' },
      { id: 'hide', label: 'Hide' },
    ],
    default: 'hide',
    phases: [1],
    short: true,
  },
  // ---------- Phase 2 (G, H); Breadcrumbs on co-branded pages is in both phases ----------
  {
    id: 'shortcuts',
    label: 'Shortcuts',
    description: 'Whether the shortcut links (Study, Impact, Research) show, on every page (G header, H sidebar).',
    choices: [
      { id: 'show', label: 'Show' },
      { id: 'hide', label: 'Hide' },
    ],
    default: 'show',
    phases: [2],
    short: true,
  },
  {
    id: 'search',
    label: 'Search',
    description: 'Whether the Search button shows (it opens a search field in the menu pane).',
    choices: [
      { id: 'show', label: 'Show' },
      { id: 'hide', label: 'Hide' },
    ],
    default: 'show',
    phases: [2],
    short: true,
  },
  {
    id: 'cobrand-breadcrumbs',
    label: 'Breadcrumbs on co-branded pages',
    description: 'Whether the breadcrumb shows on a co-branded site’s pages.',
    choices: [
      { id: 'show', label: 'Show' },
      { id: 'hide', label: 'Hide' },
    ],
    default: 'show',
    phases: [1, 2],
    short: true,
  },
  {
    id: 'menu-back',
    label: 'Back button in the menu',
    description: 'What the Back button at the top of the menu pane says: Back, or the name of the level it goes back to.',
    choices: [
      { id: 'generic', label: 'Back' },
      { id: 'previous', label: 'Previous level’s name' },
    ],
    default: 'generic',
    phases: [2],
  },
  {
    id: 'menu-arrows',
    label: 'Arrows in the menu',
    description: 'Which items in the menu pane show a → (Back keeps its arrow).',
    choices: [
      { id: 'all', label: 'All' },
      { id: 'children', label: 'Only items with children' },
      { id: 'no-headings', label: 'All except headings' },
      { id: 'none', label: 'None' },
    ],
    default: 'none',
    phases: [2],
  },
];

/** The options that apply in a phase. */
export const optionsFor = (phase: 1 | 2) => OPTIONS.filter(o => o.phases.includes(phase));

/** localStorage key for the chosen options ({ [id]: choice }). */
export const OPTIONS_KEY = 'uwa-nav-proto-options';
