export function renderStory(): string {
  return `
  <article class="story">
    <h1 class="story__title">Our Story</h1>
    <p class="story__intro">The one where someone asks "so what IS this thing?" at 2am and you actually tell the truth.</p>

    <section class="story__section">
      <h2 class="story__heading">The Need</h2>
      <p class="story__text">
        Look around. The interface between you and the digital babylon is... not great.
        Every day you wade through a slurry of information processing activities designed
        by people who never asked what you actually needed. Click here. Accept this.
        Scroll past that. Consent to things you'll never read. You know the drill.
      </p>
      <p class="story__text">
        It's a poorly contracted experience. Humanity signed up for "the future" and got
        a strip mall with tracking pixels. The sovereignty of your attention, the transparency
        of the systems you depend on, the basic honesty of the interfaces you touch every day
        &mdash; these aren't features. They're rights. And they've been quietly misplaced.
      </p>
      <p class="story__text">
        Steaz is a mutual love letter to the interface. From the people who build it, to the
        people who live inside it. An attempt to make the thing you're looking at right now
        feel like it was made by someone who actually gives a damn.
      </p>
    </section>

    <section class="story__section">
      <h2 class="story__heading">What Steaz Is</h2>
      <p class="story__text">
        <strong>Stylish + Easy.</strong> That's it. The name tells you everything.
      </p>
      <p class="story__text">
        A configurable, navigable web platform. Beautiful interfaces for the things you
        actually do: browsing, summarizing, integrating. Not another app that demands
        your attention &mdash; a surface that earns it.
      </p>
      <p class="story__text">
        The kind of thing where you open it, feel something settle in your chest, and
        think: "oh, someone thought about this." That's the bar. Every pixel answers to it.
      </p>
    </section>

    <section class="story__section">
      <h2 class="story__heading">The Product Family</h2>
      <div class="story__family">
        <div class="story__family-item">
          <span class="story__family-label">Steaz Core</span>
          <span class="story__family-desc">The engine. The thing under the hood. Coming soon.</span>
        </div>
        <div class="story__family-item">
          <span class="story__family-label">steaz.cloud</span>
          <span class="story__family-desc">You're here. The entry point. The front door.</span>
        </div>
        <div class="story__family-item">
          <span class="story__family-label">Dreamscapes</span>
          <span class="story__family-desc">The flagship client. The chrysalis. Where it all comes together.</span>
        </div>
        <div class="story__family-item">
          <span class="story__family-label">Theme Packs</span>
          <span class="story__family-desc">Tune your experience. Dress the interface in the story that fits you.</span>
        </div>
        <div class="story__family-item">
          <span class="story__family-label">Affordances</span>
          <span class="story__family-desc">Collectible upgrades along the journey. Community-rated. Transparent.</span>
        </div>
      </div>
    </section>

    <section class="story__section">
      <h2 class="story__heading">The Mission</h2>
      <p class="story__text">
        Free. For humanity. Period.
      </p>
      <p class="story__text">
        Not "free tier with a catch." Not "free until we get acquired." Free because
        the interface between humans and their digital lives shouldn't have a cover charge.
        Transparent, accountable, verifiable &mdash; because the alternative is what we already have,
        and look how that's going.
      </p>
      <p class="story__text">
        We're impish and cartoon-like about it. Not because we don't take it seriously, but
        because the mask of cartoonality hides in plain sight. The seriousness is in the craft.
        The playfulness is how it reaches you. If you've read this far, you already know the difference.
      </p>
    </section>
  </article>`;
}
