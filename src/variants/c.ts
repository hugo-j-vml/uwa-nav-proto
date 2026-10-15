import type { Variant } from './types';

/**
 * C: a more static version of B. Same header and static core pane; the chosen
 * section opens panel 1 (its L2 items) and a chosen L2 opens panel 2 (its L3
 * items) to the right. One IA level per panel; the menu goes down to L3.
 */
export const c: Variant = {
  id: 'c',
  letter: 'C',
  name: 'Static core with two panels',
  status: 'ready',
  shell: 'header',
  menu: 'columns',
  motion: 'a',
};
