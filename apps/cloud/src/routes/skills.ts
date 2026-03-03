import { Hono } from 'hono';
import { renderLayout } from '../views/layout';

export const skillsRoutes = new Hono();

skillsRoutes.get('/skills', (c) => {
  const body = `
    <section class="placeholder-section">
      <h1 class="section-title">Skills Gallery</h1>
      <p class="placeholder-text">Coming in Session 3</p>
    </section>`;

  return c.html(renderLayout('Skills | steaz.cloud', body));
});

skillsRoutes.get('/skills/featured', (c) => {
  return c.html(`
    <div class="grid">
      <div class="card">
        <h3 class="card-title">Forge</h3>
        <p class="card-desc">Full-session executor. Receives briefs, ships code.</p>
      </div>
      <div class="card">
        <h3 class="card-title">Oracle</h3>
        <p class="card-desc">PM/Orchestrator. Plans, scopes, writes session briefs.</p>
      </div>
      <div class="card">
        <h3 class="card-title">Reaper</h3>
        <p class="card-desc">Git specialist. Branching, committing, pushing, PR creation.</p>
      </div>
    </div>`);
});

skillsRoutes.get('/skills/:name', (c) => {
  const name = c.req.param('name');
  const body = `
    <section class="placeholder-section">
      <h1 class="section-title">${name}</h1>
      <p class="placeholder-text">Skill detail page for ${name}</p>
    </section>`;

  return c.html(renderLayout(`${name} | steaz.cloud`, body));
});
