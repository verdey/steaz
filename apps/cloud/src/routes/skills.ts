import { Hono } from 'hono';
import { renderLayout } from '../views/layout';
import { renderGallery } from '../views/skills/gallery';
import { renderSkillDetail } from '../views/skills/detail';
import { renderSkillCard } from '../views/skills/card';
import type { SkillData } from '../types';
import skillsManifest from '../data/skills-manifest.json';

const skills = skillsManifest as SkillData[];

export const skillsRoutes = new Hono();

skillsRoutes.get('/skills', (c) => {
  return c.html(renderLayout('Skills | steaz.cloud', renderGallery(skills)));
});

skillsRoutes.get('/skills/featured', (c) => {
  // Pick 3 random cards (Fisher-Yates partial shuffle)
  const pool = [...skills];
  const picked: SkillData[] = [];
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return c.html(picked.map(renderSkillCard).join('\n'));
});

skillsRoutes.get('/skills/:name', (c) => {
  const name = c.req.param('name');
  const skill = skills.find((s) => s.name === name);
  if (!skill) {
    return c.html(
      renderLayout('Not Found | steaz.cloud', `
        <section class="placeholder-section">
          <h1 class="section-title">404</h1>
          <p class="placeholder-text">Skill "${name}" not found.</p>
          <a href="/skills" style="color: var(--tron-cyan);">&larr; Back to The Council</a>
        </section>`),
      404
    );
  }
  return c.html(renderLayout(`${skill.name} | steaz.cloud`, renderSkillDetail(skill)));
});
