import { Hono } from 'hono';
import { renderLayout } from '../views/layout';

export const storyRoutes = new Hono();

storyRoutes.get('/story', (c) => {
  const body = `
    <section class="placeholder-section">
      <h1 class="section-title">Our Story</h1>
      <p class="placeholder-text">The Steaz story. Coming in Session 4.</p>
    </section>`;

  return c.html(renderLayout('Our Story | steaz.cloud', body));
});
