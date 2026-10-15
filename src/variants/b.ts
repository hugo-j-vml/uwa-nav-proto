import type { Variant } from './types';

/** B: same header as A; static core menu, no indents; each level opens a new panel. Waiting for designs. */
export const b: Variant = {
  id: 'b',
  letter: 'B',
  name: 'Static core with level panels',
  status: 'coming-soon',
  shell: 'header',
  menu: 'panels',
  motion: 'a',
};
