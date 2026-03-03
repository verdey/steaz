import { Hono } from 'hono';
import { renderLayout } from '../views/layout';

export const themePacksRoutes = new Hono();

themePacksRoutes.get('/theme-packs', (c) => {
  const body = `
    <section class="placeholder-section">
      <h1 class="section-title">Theme Packs</h1>
      <p class="placeholder-text">Tune your council. Coming soon.</p>
    </section>`;

  return c.html(renderLayout('Theme Packs | steaz.cloud', body));
});

themePacksRoutes.get('/theme-packs/tng', (c) => {
  const body = `
    <section class="placeholder-section">
      <h1 class="section-title">TNG Theme Pack</h1>
      <p class="placeholder-text">The Next Generation council configuration. Coming soon.</p>
    </section>`;

  return c.html(renderLayout('TNG Theme Pack | steaz.cloud', body));
});
