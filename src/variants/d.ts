import type { Variant } from './types';

/**
 * D: a fixed sidebar instead of the header: logo, search field, then the
 * top-level items. Choosing one opens a drill-down pane to the right with its
 * children; each deeper level replaces the pane's contents, with a Back link.
 */
export const d: Variant = {
  id: 'd',
  letter: 'D',
  name: 'Sidebar with drill-down',
  phase: 1,
  status: 'ready',
  shell: 'sidebar',
  menu: 'drilldown',
  motion: 'a',
};
