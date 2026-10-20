import type { Variant } from './types';

/**
 * CONTROL-1 (phase 2): the control for user testing. The live UWA site's
 * navigation (www.uwa.edu.au, recorded 20 Oct 2026) at wireframe fidelity,
 * with the prototype's IA, so it can be benchmarked against G and H on the
 * same pages and tasks. Menu bar with a mega menu per section (L2 and L3),
 * a small "More" dropdown, a search panel; below 768px the live mobile menu
 * (drill-down with accordions). Co-branded sites get the live co-brand header
 * (their own sections, plus an "All UWA" mega menu). The menu reaches L3, as on
 * the live site; deeper pages are reached from their parent's "In this section".
 * No behaviour options. Header: ControlHeader.astro; behaviour: control-menu.ts.
 */
export const control1: Variant = {
  id: 'control-1',
  letter: 'CONTROL-1',
  name: 'Current site navigation',
  phase: 2,
  status: 'ready',
  shell: 'header',
  menu: 'mega',
  menuDepth: 3,
  noOptions: true,
  // The live "More" dropdown holds News, Events, Library, Current students, Staff and Giving: their IA equivalents
  mega: { more: ['students', 'login', 'about-us/news'], lockups: ['our-research/institutes-and-centres/centres-and-other-entities/oceans-institute'] },
  motion: 'a',
};
