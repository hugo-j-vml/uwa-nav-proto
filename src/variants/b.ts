import type { Variant } from './types';

/**
 * B: same header as A. A static core pane of top-level items (no nesting); the
 * chosen section's items fill the wider white pane, where parents expand inline
 * as an accordion (one branch open at a time).
 */
export const b: Variant = {
  id: 'b',
  letter: 'B',
  name: 'Static core with dynamic panel',
  phase: 1,
  status: 'ready',
  shell: 'header',
  menu: 'panels',
  motion: 'a',
};
