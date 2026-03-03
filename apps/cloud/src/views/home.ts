export function renderHome(): string {
  return `
  <section class="hero" x-data="{
    emojis: ['🐺','🌀','🛡','🔮','⚡','🐬','💿','⚕️','📚'],
    current: 0,
    init() { setInterval(() => { this.current = (this.current + 1) % this.emojis.length }, 2000) }
  }">
    <div class="hero__totem-ring">
      <template x-for="(e, i) in emojis" :key="i">
        <span class="hero__totem"
              :class="{ 'hero__totem--active': current === i }"
              x-text="e"></span>
      </template>
    </div>
    <h1 class="hero-title">The Steaz-i-verse</h1>
    <p class="hero-tagline-mono">Stylish + Easy. The interface humanity deserves.</p>
    <div class="hero__ctas">
      <a href="/skills" class="hero__cta hero__cta--primary">Enter the Skills Gallery</a>
      <a href="/story" class="hero__cta hero__cta--secondary">Our Story</a>
    </div>
  </section>

  <section class="home-section">
    <h2 class="home-section__title">The Council</h2>
    <div class="home-section__featured"
         hx-get="/skills/featured"
         hx-trigger="load"
         hx-swap="innerHTML">
      <div class="home-section__loading">Loading council members...</div>
    </div>
    <div class="home-section__link-row">
      <a href="/skills" class="home-section__link">See all skills &rarr;</a>
    </div>
  </section>

  <section class="home-section">
    <h2 class="home-section__title">Theme Packs</h2>
    <p class="home-section__sub">Tune your council. Dress the interface.</p>
    <div class="home-section__grid home-section__grid--packs">
      <a href="/theme-packs/tng" class="pack-card pack-card--tng">
        <span class="pack-card__badge">TNG</span>
        <span class="pack-card__name">Star Trek: The Next Generation</span>
        <span class="pack-card__tagline">Make it so.</span>
      </a>
      <div class="pack-card pack-card--locked">
        <span class="pack-card__lock">&#128274;</span>
        <span class="pack-card__name">Arcane</span>
        <span class="pack-card__soon">Coming Soon</span>
      </div>
      <div class="pack-card pack-card--locked">
        <span class="pack-card__lock">&#128274;</span>
        <span class="pack-card__name">Miyazaki</span>
        <span class="pack-card__soon">Coming Soon</span>
      </div>
    </div>
  </section>

  <section class="home-section">
    <h2 class="home-section__title">Affordances</h2>
    <p class="home-section__sub">Gifts of the journey.</p>
    <p class="home-section__concept">Collectible upgrades. Community-rated. Transparent.</p>
    <div class="home-section__grid home-section__grid--affordances">
      <div class="afford-card afford-card--locked">
        <span class="afford-card__lock">&#128274;</span>
        <span class="afford-card__name">Speed Boost</span>
        <span class="afford-card__soon">Coming Soon</span>
      </div>
      <div class="afford-card afford-card--locked">
        <span class="afford-card__lock">&#128274;</span>
        <span class="afford-card__name">Context Expand</span>
        <span class="afford-card__soon">Coming Soon</span>
      </div>
      <div class="afford-card afford-card--locked">
        <span class="afford-card__lock">&#128274;</span>
        <span class="afford-card__name">Pattern Library</span>
        <span class="afford-card__soon">Coming Soon</span>
      </div>
    </div>
  </section>`;
}
