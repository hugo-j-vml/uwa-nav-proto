import type { Variant } from './types';

/**
 * E: a simpler sidebar than D: logo, search field, a Menu button and the
 * Study / Impact / Research shortcuts. The Menu button opens the drill-down
 * pane at the top-level items; choosing one drills down as in D.
 */
export const e: Variant = {
  id: 'e',
  letter: 'E',
  name: 'Sidebar menu button',
  status: 'ready',
  shell: 'sidebar',
  menu: 'menu-button',
  motion: 'a',
};
