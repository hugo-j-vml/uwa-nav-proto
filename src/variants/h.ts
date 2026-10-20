import type { Variant } from './types';

/**
 * H (phase 2): E's sidebar (logo, Search, Menu button, shortcuts) and drill-down
 * pane. Search opens the pane with a search field instead of searching from
 * the sidebar. Co-branded pages always use the tabs (co-brand menu option 2).
 */
export const h: Variant = {
  id: 'h',
  letter: 'H',
  name: 'Sidebar with menu pane',
  phase: 2,
  status: 'ready',
  shell: 'sidebar',
  menu: 'pane',
  fixedOptions: { 'cobrand-menu': '2' },
  motion: 'a',
};
