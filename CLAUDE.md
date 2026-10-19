# Working notes for Claude sessions

Clickable, wireframe-fidelity Astro prototype of the proposed UWA website navigation, for user testing. Owner: Hugo Jenkins (VML). Start with `README.md` (what to edit, behaviour, options), `plan.md` (specs per variant, open questions) and the top of `CHANGELOG.md` (latest changes).

## How Hugo works

- **UK English** everywhere (copy, docs, commit messages). Money in **Australian dollars**.
- **Work straight on `main`.** No branches or PRs; it isn't a production system.
- **Hugo also edits from VS Code**, so `git pull --rebase origin main` before starting and again before pushing.
- **Do exactly what's asked.** Don't add features, menus or visual changes nobody asked for (e.g. don't recolour things to match a mockup unless asked; don't build menus when asked to add IA). If something looks worth doing, suggest it instead.
- **Ask when a design is ambiguous**, but only when it's needed; otherwise pick the sensible default and say so.
- When asked to plan, plan only; build after a go-ahead.
- Report back briefly: what changed, what was verified, anything flagged. Keep decisions in `plan.md` (open questions in section 11).

## Every change

1. Make the change. Tunable values go in `src/styles/tokens.css` as tokens, not hard-coded.
2. `npm run build` (runs the sitemap script first). Type-check with `npx tsc --noEmit -p .` (`astro check` asks to install a package; skip it).
3. Verify in a browser (below), in every variant the change touches.
4. Add a `CHANGELOG.md` entry with a new version number. **The top heading is the version shown on the index page.**
5. Update `README.md` / `plan.md` if behaviour or structure changed.
6. Commit (end the message with the attribution lines from the session), pull --rebase, push to `main`. GitHub Actions deploys to https://hugo-j-vml.github.io/uwa-nav-proto/ in 1–2 minutes; check with `gh run list -R hugo-j-vml/uwa-nav-proto` / `gh run watch`.

## Gotchas

- `src/data/sitemap.json` is regenerated on every build with a new timestamp. If the IA didn't change, `git checkout -- src/data/sitemap.json` before committing.
- `gh` needs the repo attached with push access (add_repo, access "push") in cloud sessions.
- Don't `pkill -f` servers by pattern (it can kill the session's own shell); use `kill $(lsof -t -i:PORT)`.
- Behaviour options are applied by an inline script in `Base.astro` before paint (`data-opt-<id>` on `<html>`). Menus read them once on load, which is why the Shift+O panel reloads the page.
- Co-brand menu items use synthetic keys starting with `~` (`src/lib/menu-state.ts`) so the open-path logic (depth = number of `/`) works; links use the real page path (`h`).

## Verifying in a browser

Chromium is pre-installed.

Playwright isn't a project dependency: install it in the scratchpad (`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright`) and import it from there.

```js
import { chromium } from '<scratchpad>/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
// Skip the password screen:
await ctx.addInitScript(() => localStorage.setItem('uwa-nav-proto-auth', '32b508d92c4ced2e61e0d98211675c073912d1de673dac8e920fae16a59fdb50'));
```

Serve `dist/` under the base path, e.g. a folder containing a symlink `uwa-nav-proto -> /home/user/uwa-nav-proto/dist`, then `python3 -m http.server 4402` in that folder and open `http://localhost:4402/uwa-nav-proto/`. Keep scripts and screenshots in the session scratchpad, not the repo.

Check every change at **phone, tablet and desktop widths** (e.g. 320 and 390, 768, 1440): the compact layouts (`plan.md` 7e) take over below 1024px. Breakpoints are in `src/breakpoints.ts`; per-size tokens in the "SCREEN SIZES" blocks of `tokens.css`.

Playwright's full-page screenshots briefly resize the window; the menus ignore brief layout flips (they react 150ms after a change settles), so take the screenshot after the menu state is set.

For changes that shouldn't affect other variants, compare full-page screenshots against the previous commit: `git worktree add <dir> HEAD`, symlink `node_modules`, build there, serve on another port, and check the screenshots are byte-identical. Remove the worktree afterwards.
