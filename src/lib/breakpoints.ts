/**
 * Browser side of the breakpoints (definitions in src/breakpoints.ts).
 * The early script in Base.astro has already set data-bp and data-layout on
 * <html> and keeps them up to date on resize, firing a "layoutchange" event
 * on document when the layout (compact / full) changes.
 */
import type { Breakpoint } from '../breakpoints';

/** The band the window is in now. */
export const getBreakpoint = () => (document.documentElement.dataset.bp || 'desktop') as Breakpoint;

/** True when the compact menu layouts apply (takeover / drawer). */
export const isCompact = () => document.documentElement.dataset.layout === 'compact';

/** Run `fn` whenever the window crosses between the compact and full layouts. */
export function onLayoutChange(fn: (compact: boolean) => void) {
  document.addEventListener('layoutchange', () => fn(isCompact()));
}
