import type { Variant } from './types';

/**
 * CONTROL-1 (phase 2): the control for user testing. The live UWA site's
 * navigation (www.uwa.edu.au, recorded 20 Oct 2026) at wireframe fidelity,
 * on the same IA and pages as G and H (the existing site's IA, from v1.3.0),
 * so it can be benchmarked against them on the same tasks. Menu bar with a mega menu per section (L2 and L3),
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
  // The live "More" dropdown's links (top-level items in the existing IA)
  mega: { more: ['news', 'events', 'library', 'current-students', 'staff', 'giving'], lockups: ['our-research/institutes-and-centres/oceans-institute'] },
  motion: 'a',
};
