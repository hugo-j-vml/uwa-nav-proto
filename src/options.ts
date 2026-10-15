/**
 * Behaviour options: alternative behaviours that can be switched on any
 * variant without making new variants. Pick them on the index page, with the
 * hidden switcher on any variant page (Shift+O), or with a link such as
 * …/a/?cobrand-menu=7 (sets and remembers the choice; handy for test sessions).
 *
 * To add an option: add an entry here, then branch on it in CSS with
 * [data-opt-<id>="<choice>"] on <html>, or in scripts with getOption('<id>')
 * from src/lib/options.ts. The choice is remembered per browser.
 */
export interface OptionChoice { id: string; label: string; tag?: string } // tag: shown in bold before the label (e.g. the option's number)
export interface OptionDef {
  id: string;            // used in links (?id=choice) and as data-opt-<id> on <html>
  label: string;
  description: string;
  choices: OptionChoice[];
  default: string;
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
  },
];

/** localStorage key for the chosen options ({ [id]: choice }). */
export const OPTIONS_KEY = 'uwa-nav-proto-options';
