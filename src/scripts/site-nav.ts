/**
 * Co-branded site menu (SiteNav.astro): click an item to open its dropdown,
 * click it again, press Esc or click elsewhere to close. One open at a time.
 */
const nav = document.querySelector<HTMLElement>('[data-site-nav]');
if (nav) {
  const buttons = [...nav.querySelectorAll<HTMLButtonElement>('.site-nav-button')];
  const dropdown = (b: HTMLButtonElement) => document.getElementById(b.getAttribute('aria-controls')!)!;
  const setOpen = (b: HTMLButtonElement, open: boolean) => {
    b.setAttribute('aria-expanded', String(open));
    dropdown(b).hidden = !open;
  };
  const closeAll = (except?: HTMLButtonElement) => buttons.forEach(b => { if (b !== except) setOpen(b, false); });

  buttons.forEach(b => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    closeAll(b);
    setOpen(b, open);
  }));
  document.addEventListener('click', (e) => {
    if (!e.composedPath().includes(nav)) closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = buttons.find(b => b.getAttribute('aria-expanded') === 'true');
    if (!open) return;
    closeAll();
    open.focus();
  });
}
