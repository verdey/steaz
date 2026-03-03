import type { ThemePack } from '../../data/theme-loader';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderTngPage(pack: ThemePack): string {
  const chars = pack.characters.map((char) => {
    const attrs = Object.entries(char.attributes).map(([key, val]) => `
      <div class="tng-char__attr">
        <span class="tng-char__attr-label">${escapeHtml(key)}</span>
        <div class="tng-char__attr-track">
          <div class="tng-char__attr-bar" style="--stat-width: ${val}%"></div>
        </div>
      </div>`).join('');

    const resonanceBadge = char.skillResonance
      ? `<a href="/skills/${encodeURIComponent(char.skillResonance)}" class="tng-char__resonance">/${escapeHtml(char.skillResonance)}</a>`
      : '';

    return `
    <div class="tng-char">
      <div class="tng-char__name">${escapeHtml(char.name)}</div>
      <div class="tng-char__rank">${escapeHtml(char.rank)} &middot; ${escapeHtml(char.role)}</div>
      ${char.bio ? `<div class="tng-char__bio">${escapeHtml(char.bio)}</div>` : ''}
      <div class="tng-char__attrs">${attrs}</div>
      ${resonanceBadge}
      ${char.catchphrase ? `<div class="tng-char__catchphrase">"${escapeHtml(char.catchphrase)}"</div>` : ''}
    </div>`;
  }).join('\n');

  return `
  <section class="tng-page">
    <div class="tng-page__header">
      <a href="/theme-packs" class="tng-page__back">&larr; All Theme Packs</a>
      <h1 class="tng-page__title">${escapeHtml(pack.meta.name)}</h1>
      <p class="tng-page__tagline">${escapeHtml(pack.meta.tagline)}</p>
      <p class="tng-page__desc">${escapeHtml(pack.meta.description)}</p>
    </div>

    <div class="tng-page__grid">
      ${chars}
    </div>
  </section>`;
}
