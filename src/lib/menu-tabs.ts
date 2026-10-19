/**
 * Co-brand menu option 2 ("Replaces core menu"): two tabs at the top of the
 * menu, UWA's (always on the left) and the co-branded site's (its abbreviation,
 * or its name; selected when a co-branded page loads), to
 * swap between the UWA main menu and the site's menu. Shared by the header
 * menus (menu.ts) and the sidebar menus (sidebar-menu.ts; D's tabs are in
 * Sidebar.astro with the same markup).
 */
export type MenuMode = 'core' | 'cobrand';

/** The tab row, with `active` selected. Each tab carries data-switch="cobrand" | "core". */
export function menuTabs(siteTab: string, siteName: string, active: MenuMode): HTMLElement {
  const row = document.createElement('div');
  row.className = 'menu-tabs';
  row.setAttribute('role', 'tablist');
  row.setAttribute('aria-label', 'Menus');
  row.dataset.path = '~tabs';
  const tab = (mode: MenuMode, label: string, title?: string) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'menu-tab';
    b.setAttribute('role', 'tab');
    b.dataset.switch = mode;
    b.textContent = label;
    if (title && title !== label) b.setAttribute('aria-label', title);
    return b;
  };
  row.append(tab('core', 'UWA', 'UWA main menu'), tab('cobrand', siteTab, siteName)); // UWA always on the left
  selectTab(row, active);
  return row;
}

/** Mark `active` as the selected tab (only the selected one is in the Tab order). */
export function selectTab(row: Element, active: MenuMode) {
  row.querySelectorAll<HTMLButtonElement>('.menu-tab').forEach(b => {
    const on = b.dataset.switch === active;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  });
}

/** Left / Right arrow keys move between the tabs (and switch), as tabs do. Call once per container. */
export function tabArrowKeys(container: Element, onSwitch: (mode: MenuMode) => void) {
  container.addEventListener('keydown', (e) => {
    const ke = e as KeyboardEvent;
    const tab = (ke.target as HTMLElement).closest?.<HTMLButtonElement>('.menu-tab');
    if (!tab || (ke.key !== 'ArrowLeft' && ke.key !== 'ArrowRight')) return;
    const other = [...tab.parentElement!.querySelectorAll<HTMLButtonElement>('.menu-tab')].find(b => b !== tab);
    if (!other) return;
    ke.preventDefault();
    onSwitch(other.dataset.switch as MenuMode);
  });
}
