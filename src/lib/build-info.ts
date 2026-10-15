/**
 * Version and build time, shown in the footer of the index page and password
 * screen. The version is the latest heading in CHANGELOG.md, so bumping the
 * changelog is enough. The time is when the site was built (each deploy),
 * in Perth time.
 */
import changelog from '../../CHANGELOG.md?raw';

export const VERSION = changelog.match(/^## (\d+\.\d+\.\d+)/m)?.[1] ?? '';

const built = new Date();
const part = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Perth', ...opts }).format(built);
/** For example "15 Oct 2026, 4:05pm AWST" */
export const BUILT_AT = `${part({ day: 'numeric', month: 'short', year: 'numeric' })}, ${part({ hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s/g, '').toLowerCase()} AWST`;
export const BUILT_AT_ISO = built.toISOString();
