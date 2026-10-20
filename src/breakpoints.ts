/**
 * Breakpoints: the one place screen-size bands are defined.
 *
 * The early script in Base.astro reads these before the page paints and sets
 * two attributes on <html>, updated live as the window is resized:
 *   data-bp="mobile" | "tablet" | "desktop"   (which band the window is in)
 *   data-layout="compact" | "full"            (which menu layout that band uses)
 * CSS branches on them (tokens.css has a block of overrides per band;
 * components.css styles the compact layouts), and scripts read them with
 * getBreakpoint() / isCompact() from src/lib/breakpoints.ts.
 *
 * Values follow the common Tailwind CSS scale (sm 640, lg 1024): phones
 * (320–639, including 412–440px large phones), tablets (iPad mini portrait
 * 744/768, phones in landscape) and desktop from 1024 (iPads in landscape,
 * laptops). Change a number here and CSS and scripts both follow.
 */
export const BREAKPOINTS = {
  /** Tablet from this width (px); below it is mobile. */
  tablet: 640,
  /** Desktop from this width (px). */
  desktop: 1024,
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Bands that use the compact menu layouts (A–C: full-screen takeover under the
 * header; D, E: a drawer from the left under a top bar). The other bands use
 * the desktop layouts.
 */
export const COMPACT: Breakpoint[] = ['mobile', 'tablet'];

/**
 * CONTROL-1 copies the live UWA site, whose header switches between its menu
 * bar (mega menus) and its mobile menu at its own width, not at the bands above:
 * the bar from this width (px), the mobile menu below it. The header's early
 * script sets data-control-bar="bar" | "mobile" on <html> from it.
 */
export const CONTROL_BAR_FROM = 768;
