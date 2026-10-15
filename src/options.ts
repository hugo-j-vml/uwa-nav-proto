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
export interface OptionChoice { id: string; label: string }
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
    label: 'Co-brand menu',
    description: 'How a co-branded site’s own menu (e.g. Oceans Institute) behaves on its pages.',
    choices: [
      { id: '1', label: 'Menu bar on page' },
      { id: '2', label: 'Replaces core menu' },
      { id: '7', label: 'Alongside core menu' },
    ],
    default: '1',
  },
];

/** localStorage key for the chosen options ({ [id]: choice }). */
export const OPTIONS_KEY = 'uwa-nav-proto-options';
