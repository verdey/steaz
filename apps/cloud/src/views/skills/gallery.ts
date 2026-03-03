import type { SkillData } from '../../types';
import { renderSkillCard } from './card';

export function renderGallery(skills: SkillData[]): string {
  const cards = skills.map(renderSkillCard).join('\n');

  return `
  <section class="skills-gallery">
    <h1 class="skills-gallery__heading">The Council</h1>
    <p class="skills-gallery__intro">Nine seats. Nine instruments. One system.</p>
    <div class="skills-gallery__grid">
      ${cards}
    </div>
  </section>`;
}
