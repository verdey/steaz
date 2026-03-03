import { Hono } from 'hono';
import { renderLayout } from '../views/layout';
import { renderThemePacksIndex } from '../views/theme-packs/index';
import { renderTngPage } from '../views/theme-packs/tng';
import { loadAllThemePacks, loadThemePack } from '../data/theme-loader';

export const themePacksRoutes = new Hono();

themePacksRoutes.get('/theme-packs', (c) => {
  const packs = [...loadAllThemePacks().values()];
  return c.html(renderLayout('Theme Packs | steaz.cloud', renderThemePacksIndex(packs)));
});

themePacksRoutes.get('/theme-packs/tng', (c) => {
  const pack = loadThemePack('tng');
  if (!pack) {
    return c.html(
      renderLayout('Not Found | steaz.cloud', `
        <section class="placeholder-section">
          <h1 class="section-title">404</h1>
          <p class="placeholder-text">TNG theme pack not found.</p>
          <a href="/theme-packs" style="color: var(--tron-cyan);">&larr; Back to Theme Packs</a>
        </section>`),
      404
    );
  }
  return c.html(renderLayout('TNG Theme Pack | steaz.cloud', renderTngPage(pack)));
});
