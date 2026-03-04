export function renderLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0a0a0f">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/reset.css">
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/layout.css">
  <link rel="stylesheet" href="/css/cards.css">
  <link rel="stylesheet" href="/css/animations.css">
  <link rel="stylesheet" href="/css/home.css">
</head>
<body>
  <nav x-data="{ mobileOpen: false }">
    <div class="nav-inner">
      <!-- holo-nav trigger injects into nav.firstChild -->
      <button class="nav-toggle" @click="mobileOpen = !mobileOpen" aria-label="Toggle menu">
        <span class="nav-toggle__bar"></span>
        <span class="nav-toggle__bar"></span>
        <span class="nav-toggle__bar"></span>
      </button>
      <div class="nav-links" :class="{ 'nav-links--open': mobileOpen }">
        <a href="/skills">Skills</a>
        <a href="/affordances">Affordances</a>
        <a href="/theme-packs">Theme Packs</a>
        <a href="/story">Story</a>
      </div>
    </div>
  </nav>

  <main>
    ${body}
  </main>

  <footer>
    <div class="footer-domains">
      <a href="https://steaz.cloud">steaz.cloud</a> ·
      <a href="https://steaz.io">steaz.io</a> ·
      <a href="https://steaz.us">steaz.us</a> ·
      <a href="https://steaz.life">steaz.life</a> ·
      <a href="https://steaz.uk">steaz.uk</a> ·
      <a href="https://steaz.link">steaz.link</a>
    </div>
    <div class="footer-tagline">Stylish + Easy. Free. For humanity.</div>
  </footer>

  <script src="/vendor/htmx.min.js"></script>
  <script src="/vendor/alpine.min.js" defer></script>
  <script type="module" src="/steaz/holo-nav.js"
    data-current="cloud"
    data-domains='${JSON.stringify([
      { id: "io", label: "steaz.io", url: "https://steaz.io", color: "#00ff41" },
      { id: "us", label: "steaz.us", url: "https://steaz.us", color: "#c8a951" },
      { id: "cloud", label: "steaz.cloud", url: "https://steaz.cloud", color: "#00d4ff" },
      { id: "life", label: "steaz.life", url: "https://steaz.life", color: "#7c3aed" },
      { id: "uk", label: "steaz.uk", url: "https://steaz.uk", color: "#f472b6" },
      { id: "dreamscapes", label: "dreamscapes", url: "https://dreamscapes.dev", color: "#e0e0ff" }
    ])}'>
  </script>
</body>
</html>`;
}
