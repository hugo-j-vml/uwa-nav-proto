import type { Variant } from './types';

/**
 * G (phase 2): A–C's header, with E's menu behaviour. The Menu button opens one
 * drill-down pane under the header: one level at a time, the chosen item as a
 * heading, Back to step up. Search opens the same pane with a search field.
 * Co-branded pages always use the tabs (co-brand menu option 2).
 */
export const g: Variant = {
  id: 'g',
  letter: 'G',
  name: 'Header with menu pane',
  phase: 2,
  status: 'ready',
  shell: 'header',
  menu: 'pane',
  fixedOptions: { 'cobrand-menu': '2' },
  motion: 'a',
};
