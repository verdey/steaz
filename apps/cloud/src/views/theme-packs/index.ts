import type { ThemePack } from '../../data/theme-loader';

export function renderThemePacksIndex(packs: ThemePack[]): string {
  const packCards = packs.map((pack) => `
    <a href="/theme-packs/${pack.meta.id}" class="theme-pack-card theme-pack-card--${pack.meta.id}">
      <span class="theme-pack-card__badge">${escapeHtml(pack.meta.shortName)}</span>
      <span class="theme-pack-card__name">${escapeHtml(pack.meta.name)}</span>
      <span class="theme-pack-card__tagline">${escapeHtml(pack.meta.tagline)}</span>
    </a>`).join('\n');

  return `
  <section class="theme-packs-page">
    <h1 class="theme-packs-page__title">Theme Packs</h1>
    <p class="theme-packs-page__sub">Tune your council. Dress the interface.</p>

    <div class="theme-packs-page__grid">
      ${packCards}
      <div class="theme-pack-card theme-pack-card--locked">
        <span class="theme-pack-card__lock">&#128274;</span>
        <span class="theme-pack-card__name">Arcane</span>
        <span class="theme-pack-card__soon">Coming Soon</span>
      </div>
      <div class="theme-pack-card theme-pack-card--locked">
        <span class="theme-pack-card__lock">&#128274;</span>
        <span class="theme-pack-card__name">Miyazaki</span>
        <span class="theme-pack-card__soon">Coming Soon</span>
      </div>
      <div class="theme-pack-card theme-pack-card--locked">
        <span class="theme-pack-card__lock">&#128274;</span>
        <span class="theme-pack-card__name">More packs coming</span>
        <span class="theme-pack-card__soon">Stay tuned</span>
      </div>
    </div>
  </section>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
