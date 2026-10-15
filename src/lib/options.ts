/**
 * Browser side of the behaviour options (definitions in src/options.ts).
 * The early script in Base.astro has already set data-opt-<id> on <html>
 * before the page painted; these helpers read and change it.
 */
import { OPTIONS, OPTIONS_KEY } from '../options';

function stored(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(OPTIONS_KEY) || '{}') || {}; } catch { return {}; }
}

/** The current choice for an option (falls back to its default). */
export function getOption(id: string): string {
  const def = OPTIONS.find(o => o.id === id);
  const attr = document.documentElement.getAttribute(`data-opt-${id}`);
  if (attr && def?.choices.some(c => c.id === attr)) return attr;
  return def?.default ?? '';
}

/** Choose an option: remembered in this browser and applied to <html> straight away. */
export function setOption(id: string, choice: string) {
  const all = stored();
  all[id] = choice;
  try { localStorage.setItem(OPTIONS_KEY, JSON.stringify(all)); } catch { /* private mode: applies to this page only */ }
  document.documentElement.setAttribute(`data-opt-${id}`, choice);
  document.dispatchEvent(new CustomEvent('optionchange', { detail: { id, choice } }));
}
