import { Hono } from 'hono';
import { renderLayout } from '../views/layout';

export const homeRoutes = new Hono();

homeRoutes.get('/', (c) => {
  const body = `
    <section class="hero">
      <h1 class="hero-title">The Steaz-i-verse</h1>
      <p class="hero-tagline">Stylish + Easy</p>
      <p class="hero-intro">A free interface platform for humanity. Skills, Affordances, Theme Packs — and the story that connects them.</p>
    </section>

    <section class="nav-cards grid">
      <a href="/skills" class="card">
        <h2 class="card-title">Skills</h2>
        <p class="card-desc">Browse the skills gallery — reusable prompt-driven capabilities.</p>
      </a>
      <a href="/affordances" class="card">
        <h2 class="card-title">Affordances</h2>
        <p class="card-desc">Gifts of the journey. Interface patterns that emerge from use.</p>
      </a>
      <a href="/theme-packs" class="card">
        <h2 class="card-title">Theme Packs</h2>
        <p class="card-desc">Tune your council. Personality configurations for your AI team.</p>
      </a>
      <a href="/story" class="card">
        <h2 class="card-title">Story</h2>
        <p class="card-desc">The Steaz origin. How we got here and where we're headed.</p>
      </a>
    </section>`;

  return c.html(renderLayout('steaz.cloud', body));
});
