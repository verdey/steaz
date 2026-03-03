export function renderAffordances(): string {
  return `
  <section class="affordances-page">
    <h1 class="affordances-page__title">Affordances</h1>
    <p class="affordances-page__sub">Gifts of the journey</p>

    <div class="affordances-page__concept">
      <p>Collectible upgrades that enhance the base functions of Steaz.</p>
      <p>Community-rated by a living, true, transparent, public, accountable, verifiable rating system.</p>
      <p>Based on well-researched norms that facilitate forthright truthfulness.</p>
    </div>

    <div class="affordances-page__principles">
      <div class="principle-card">
        <span class="principle-card__name">Transparent</span>
        <span class="principle-card__desc">Every rating visible. Every score accountable.</span>
      </div>
      <div class="principle-card">
        <span class="principle-card__name">Verifiable</span>
        <span class="principle-card__desc">The data speaks. The community confirms.</span>
      </div>
      <div class="principle-card">
        <span class="principle-card__name">Accountable</span>
        <span class="principle-card__desc">Real people. Real feedback. Real consequences.</span>
      </div>
    </div>

    <div class="affordances-page__grid">
      <div class="afford-page-card">
        <span class="afford-page-card__lock">&#128274;</span>
        <span class="afford-page-card__name">Speed Boost</span>
        <span class="afford-page-card__soon">Coming Soon</span>
      </div>
      <div class="afford-page-card">
        <span class="afford-page-card__lock">&#128274;</span>
        <span class="afford-page-card__name">Context Expand</span>
        <span class="afford-page-card__soon">Coming Soon</span>
      </div>
      <div class="afford-page-card">
        <span class="afford-page-card__lock">&#128274;</span>
        <span class="afford-page-card__name">Pattern Library</span>
        <span class="afford-page-card__soon">Coming Soon</span>
      </div>
      <div class="afford-page-card">
        <span class="afford-page-card__lock">&#128274;</span>
        <span class="afford-page-card__name">Community Voice</span>
        <span class="afford-page-card__soon">Coming Soon</span>
      </div>
    </div>
  </section>`;
}
