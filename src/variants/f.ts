import type { Variant } from './types';

/**
 * F: C without the depth limit. Same header and core pane; each chosen item
 * opens its items in a new panel that stacks over the last, leaving a strip of
 * each earlier panel showing, so every level of the IA is reachable from the
 * menu. The topmost panel is the lightest; panels further back get darker.
 */
export const f: Variant = {
  id: 'f',
  letter: 'F',
  name: 'Stacking panels',
  phase: 1,
  status: 'ready',
  shell: 'header',
  menu: 'stack',
  motion: 'a',
};
