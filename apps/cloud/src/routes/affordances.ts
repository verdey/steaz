import { Hono } from 'hono';
import { renderLayout } from '../views/layout';

export const affordancesRoutes = new Hono();

affordancesRoutes.get('/affordances', (c) => {
  const body = `
    <section class="placeholder-section">
      <h1 class="section-title">Affordances</h1>
      <p class="placeholder-text">Gifts of the journey. Coming soon.</p>
    </section>`;

  return c.html(renderLayout('Affordances | steaz.cloud', body));
});
