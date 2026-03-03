import type { SkillData } from '../../types';

const STATS = ['diplomacy', 'craft', 'precision', 'empathy', 'command'] as const;

function statValue(name: string, stat: string): number {
  let hash = 0;
  const seed = name + stat;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return 40 + Math.abs(hash % 56);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderSkillDetail(skill: SkillData): string {
  const emoji = skill.emoji ?? '?';

  const statsHtml = STATS.map((stat) => {
    const val = statValue(skill.name, stat);
    return `
      <div class="skill-detail__stat">
        <span class="skill-detail__stat-label">${stat}</span>
        <div class="skill-detail__stat-track">
          <div class="skill-detail__stat-bar" style="width: ${val}%"></div>
        </div>
      </div>`;
  }).join('');

  const bodyPreview = escapeHtml(skill.rawBody.slice(0, 2000));

  return `
  <section class="skill-detail">
    <a href="/skills" class="skill-detail__back">&larr; The Council</a>

    <div class="skill-detail__hero">
      <div class="skill-detail__portrait">${emoji}</div>
      <h1 class="skill-detail__name">${escapeHtml(skill.name)}</h1>
      <div class="skill-detail__command">/${escapeHtml(skill.name)}</div>
    </div>

    <div class="skill-detail__stats">${statsHtml}
    </div>

    ${skill.tngResonance ? `<div class="skill-detail__tng-badge">${escapeHtml(skill.tngResonance)}</div>` : ''}

    ${skill.archetype ? `
    <div class="skill-detail__section">
      <h2 class="skill-detail__section-title">Archetype</h2>
      <p class="skill-detail__section-text">${escapeHtml(skill.archetype)}</p>
    </div>` : ''}

    ${skill.earthlyOverlay ? `
    <div class="skill-detail__section">
      <h2 class="skill-detail__section-title">Earthly Overlay</h2>
      <p class="skill-detail__section-text">${escapeHtml(skill.earthlyOverlay)}</p>
    </div>` : ''}

    <div class="skill-detail__section">
      <h2 class="skill-detail__section-title">Description</h2>
      <p class="skill-detail__section-text">${escapeHtml(skill.description)}</p>
    </div>

    <div class="skill-detail__section">
      <h2 class="skill-detail__section-title">Full Profile</h2>
      <pre class="skill-detail__body">${bodyPreview}</pre>
    </div>
  </section>`;
}
