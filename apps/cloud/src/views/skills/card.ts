import type { SkillData } from '../../types';

const STATS = ['diplomacy', 'craft', 'precision', 'empathy', 'command'] as const;

/** Pseudo-random 40-95 seeded from skill name + stat label */
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

export function renderSkillCard(skill: SkillData): string {
  const emoji = skill.emoji ?? '?';
  const statsHtml = STATS.map((stat) => {
    const val = statValue(skill.name, stat);
    return `
        <div class="skill-card__stat">
          <span class="skill-card__stat-label">${stat}</span>
          <div class="skill-card__stat-track">
            <div class="skill-card__stat-bar skill-card__stat-bar--visible"
                 style="--stat-width: ${val}%"></div>
          </div>
        </div>`;
  }).join('');

  const tngBadge = skill.tngResonance
    ? `<span class="skill-card__tng-badge">${escapeHtml(skill.tngResonance)}</span>`
    : `<span class="skill-card__tng-badge" style="border-color: var(--cloud-border); color: var(--star-white); opacity: 0.3">Council</span>`;

  const descSnippet = skill.description.length > 120
    ? escapeHtml(skill.description.slice(0, 120)) + '...'
    : escapeHtml(skill.description);

  return `
  <div class="skill-card"
    x-data="{ flipped: false, tiltX: 0, tiltY: 0 }"
    @mouseenter="$el.classList.add('skill-card--hover')"
    @mouseleave="$el.classList.remove('skill-card--hover'); tiltX = 0; tiltY = 0"
    @mousemove="tiltX = ($event.offsetY / $el.offsetHeight - 0.5) * 15; tiltY = ($event.offsetX / $el.offsetWidth - 0.5) * -15"
    @click="flipped = !flipped"
  >
    <div class="skill-card__inner"
      :style="\`transform: perspective(1000px) rotateX(\${tiltX}deg) rotateY(\${tiltY + (flipped ? 180 : 0)}deg)\`"
    >
      <!-- Front -->
      <div class="skill-card__front">
        <div class="skill-card__header">
          <span class="skill-card__emoji">${emoji}</span>
          <h3 class="skill-card__name">${escapeHtml(skill.name)}</h3>
          <span class="skill-card__badge">/${escapeHtml(skill.name)}</span>
        </div>
        <div class="skill-card__portrait">
          <span class="skill-card__portrait-emoji">${emoji}</span>
        </div>
        <div class="skill-card__stats">${statsHtml}
        </div>
        <div class="skill-card__footer">
          ${tngBadge}
          <span class="skill-card__council-label">Steaz Council</span>
        </div>
      </div>

      <!-- Back -->
      <div class="skill-card__back">
        <div class="skill-card__bio">
          ${skill.archetype ? `<div class="skill-card__archetype">${escapeHtml(skill.archetype)}</div>` : ''}
          ${skill.earthlyOverlay ? `<div class="skill-card__overlay">${escapeHtml(skill.earthlyOverlay)}</div>` : ''}
        </div>
        <div class="skill-card__description">${descSnippet}</div>
        <div class="skill-card__meta">Council Member · Free · Open Source</div>
      </div>
    </div>
  </div>`;
}
