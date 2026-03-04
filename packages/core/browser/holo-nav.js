// @steaz/core — Holo-Nav
// SVG solar system domain switcher. Layer 01 artifact.
// Pure vanilla ES module. No framework dependencies.

// ─── Configuration ────────────────────────────────────────────────────────────

export const holoNavConfig = {
  current: '',
  domains: [],
};

// ─── Default domain data ──────────────────────────────────────────────────────

const DEFAULT_DOMAINS = [
  { id: 'io',          label: 'steaz.io',          url: 'https://steaz.io',          color: '#00ff41' },
  { id: 'us',          label: 'steaz.us',          url: 'https://steaz.us',          color: '#c8a951' },
  { id: 'cloud',       label: 'steaz.cloud',       url: 'https://steaz.cloud',       color: '#00d4ff' },
  { id: 'life',        label: 'steaz.life',        url: 'https://steaz.life',        color: '#7c3aed' },
  { id: 'uk',          label: 'steaz.uk',          url: 'https://steaz.uk',          color: '#f472b6' },
  { id: 'dreamscapes', label: 'dreamscapes',       url: 'https://dreamscapes.steaz.life', color: '#e0e0ff' },
];

const ORBIT_RADII = [60, 110, 160, 210, 260, 300];
const ORBIT_SPEEDS = [30, 45, 60, 80, 100, 120];
const CENTER = 300;
const VIEWBOX = 600;

// ─── State ────────────────────────────────────────────────────────────────────

let isOpen = false;
let panelEl = null;
let triggerEl = null;
let reducedMotion = false;

// ─── Public API ───────────────────────────────────────────────────────────────

export function open() {
  if (isOpen || !panelEl || !triggerEl) return;
  isOpen = true;
  panelEl.style.display = 'flex';
  triggerEl.setAttribute('aria-expanded', 'true');
  triggerEl.classList.remove('holo-nav__trigger--pulse');
  // Start orbit animations
  const groups = panelEl.querySelectorAll('.holo-orbit-group');
  for (const g of groups) g.style.animationPlayState = 'running';
  const counters = panelEl.querySelectorAll('.holo-label-counter');
  for (const c of counters) c.style.animationPlayState = 'running';
  // Focus first planet for keyboard nav
  const firstLink = panelEl.querySelector('a');
  if (firstLink) setTimeout(() => firstLink.focus(), 50);
  document.dispatchEvent(new CustomEvent('holoNav:open'));
}

export function close() {
  if (!isOpen || !panelEl || !triggerEl) return;
  isOpen = false;
  panelEl.style.display = 'none';
  triggerEl.setAttribute('aria-expanded', 'false');
  triggerEl.classList.add('holo-nav__trigger--pulse');
  // Pause orbit animations
  const groups = panelEl.querySelectorAll('.holo-orbit-group');
  for (const g of groups) g.style.animationPlayState = 'paused';
  const counters = panelEl.querySelectorAll('.holo-label-counter');
  for (const c of counters) c.style.animationPlayState = 'paused';
  triggerEl.focus();
  document.dispatchEvent(new CustomEvent('holoNav:close'));
}

export function toggle() {
  if (isOpen) close(); else open();
}

export function setCurrentDomain(id) {
  holoNavConfig.current = id;
  if (!panelEl) return;
  const planets = panelEl.querySelectorAll('.holo-planet');
  for (const p of planets) {
    const domainId = p.dataset.domain;
    const isCurrent = domainId === id;
    p.setAttribute('r', isCurrent ? '12' : '8');
    p.setAttribute('opacity', isCurrent ? '1.0' : '0.8');
    p.style.filter = isCurrent ? `drop-shadow(0 0 8px ${p.getAttribute('fill')})` : 'none';
  }
  // Update label visibility
  const labels = panelEl.querySelectorAll('.holo-label');
  for (const l of labels) {
    l.classList.toggle('holo-label--current', l.dataset.domain === id);
  }
}

// ─── Style injection ──────────────────────────────────────────────────────────

function injectStyles() {
  if (document.getElementById('holo-nav-styles')) return;

  const fontDisplay = 'var(--font-display, cursive)';
  const fontArcade = 'var(--font-arcade, monospace)';

  let keyframes = '';
  for (let i = 0; i < 6; i++) {
    const speed = ORBIT_SPEEDS[i];
    keyframes += `
@keyframes holo-orbit-${i} {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes holo-orbit-${i}-counter {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}`;
  }

  const style = document.createElement('style');
  style.id = 'holo-nav-styles';
  style.textContent = `
/* ═══════════════════════════════════════
   HOLO-NAV — Steaz-i-verse Switcher
   ═══════════════════════════════════════ */

#holo-nav__trigger {
  background: rgba(10, 15, 12, 0.7);
  border: 1px solid rgba(0, 212, 255, 0.15);
  color: var(--tron-cyan, #00d4ff);
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  border-radius: 2px;
  padding: 0;
  z-index: 100;
  transition: border-color 0.2s, box-shadow 0.2s;
}

#holo-nav__trigger:hover,
#holo-nav__trigger:focus-visible {
  border-color: rgba(0, 212, 255, 0.4);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.15);
  outline: none;
}

/* Fixed fallback when no nav exists */
#holo-nav__trigger.holo-nav__trigger--fixed {
  position: fixed;
  top: 12px;
  left: 12px;
}

/* Pulse when panel closed */
.holo-nav__trigger--pulse {
  animation: holo-trigger-pulse 3s ease-in-out infinite;
}

@keyframes holo-trigger-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

/* Panel overlay */
#holo-nav__panel {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(10, 10, 15, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Solar system SVG */
#holo-nav__solar-system {
  width: min(90vw, 90vh, 600px);
  height: min(90vw, 90vh, 600px);
}

/* Orbital rings */
.holo-orbit-ring {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
}

/* Orbit group rotation */
.holo-orbit-group {
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: paused;
}

${[0, 1, 2, 3, 4, 5].map(i => `
.holo-orbit-group[data-orbit="${i}"] {
  transform-origin: ${CENTER}px ${CENTER}px;
  animation-name: holo-orbit-${i};
  animation-duration: ${ORBIT_SPEEDS[i]}s;
}`).join('')}

/* Planet circles */
.holo-planet {
  cursor: pointer;
  transition: r 0.2s, opacity 0.2s;
}

.holo-planet:hover,
.holo-planet:focus {
  opacity: 1 !important;
}

/* Touch target overlays */
.holo-touch-target {
  fill: transparent;
  cursor: pointer;
}

/* Planet labels */
.holo-label {
  font-family: ${fontArcade};
  font-size: 11px;
  fill: rgba(255, 255, 255, 0.7);
  text-anchor: middle;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.holo-label--current {
  opacity: 1;
  fill: #fff;
}

/* Counter-rotate labels to stay horizontal */
.holo-label-counter {
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: paused;
}

${[0, 1, 2, 3, 4, 5].map(i => `
.holo-label-counter[data-orbit="${i}"] {
  transform-origin: 0px 0px;
  animation-name: holo-orbit-${i}-counter;
  animation-duration: ${ORBIT_SPEEDS[i]}s;
}`).join('')}

/* Show label on planet hover/focus */
.holo-planet-group:hover .holo-label,
.holo-planet-group:focus-within .holo-label {
  opacity: 1;
}

/* Sun glow */
.holo-sun {
  fill: url(#holo-sun-gradient);
}

/* Mobile: labels list below SVG */
.holo-nav__mobile-labels {
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  width: 100%;
  max-width: 280px;
}

.holo-nav__mobile-link {
  font-family: ${fontArcade};
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  width: 100%;
  text-align: center;
  transition: color 0.2s, border-color 0.2s;
}

.holo-nav__mobile-link:hover,
.holo-nav__mobile-link:focus {
  outline: none;
}

.holo-nav__mobile-link--current {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 480px) {
  .holo-nav__mobile-labels { display: flex; }
  .holo-label { display: none; }
}

${keyframes}

@media (prefers-reduced-motion: reduce) {
  .holo-orbit-group { animation: none !important; }
  .holo-label-counter { animation: none !important; }
  .holo-nav__trigger--pulse { animation: none !important; }
  .holo-label { opacity: 1; }
}
`;
  document.head.appendChild(style);
}

// ─── SVG construction ─────────────────────────────────────────────────────────

function buildSVG(domains) {
  const ns = 'http://www.w3.org/2000/svg';
  const xlink = 'http://www.w3.org/1999/xlink';

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('id', 'holo-nav__solar-system');
  svg.setAttribute('viewBox', `0 0 ${VIEWBOX} ${VIEWBOX}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Steaz-i-verse solar system navigation');

  // Defs: sun gradient + glow filters
  const defs = document.createElementNS(ns, 'defs');

  const sunGrad = document.createElementNS(ns, 'radialGradient');
  sunGrad.setAttribute('id', 'holo-sun-gradient');
  const stop1 = document.createElementNS(ns, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#fff');
  stop1.setAttribute('stop-opacity', '0.9');
  const stop2 = document.createElementNS(ns, 'stop');
  stop2.setAttribute('offset', '60%');
  stop2.setAttribute('stop-color', '#00d4ff');
  stop2.setAttribute('stop-opacity', '0.5');
  const stop3 = document.createElementNS(ns, 'stop');
  stop3.setAttribute('offset', '100%');
  stop3.setAttribute('stop-color', '#00d4ff');
  stop3.setAttribute('stop-opacity', '0');
  sunGrad.append(stop1, stop2, stop3);
  defs.appendChild(sunGrad);
  svg.appendChild(defs);

  // Sun
  const sun = document.createElementNS(ns, 'circle');
  sun.setAttribute('class', 'holo-sun');
  sun.setAttribute('cx', String(CENTER));
  sun.setAttribute('cy', String(CENTER));
  sun.setAttribute('r', '18');
  svg.appendChild(sun);

  // Stagger angles for reduced-motion static positions
  const staggerAngles = [0, 60, 120, 200, 270, 330];

  // Orbits
  domains.forEach((domain, i) => {
    const radius = domain.orbitRadius || ORBIT_RADII[i] || ORBIT_RADII[ORBIT_RADII.length - 1];
    const isCurrent = domain.id === holoNavConfig.current;
    const angle = staggerAngles[i] || (i * 60);
    const angleRad = (angle * Math.PI) / 180;

    // Orbital ring
    const ring = document.createElementNS(ns, 'circle');
    ring.setAttribute('class', 'holo-orbit-ring');
    ring.setAttribute('cx', String(CENTER));
    ring.setAttribute('cy', String(CENTER));
    ring.setAttribute('r', String(radius));
    svg.appendChild(ring);

    // Orbit group (rotates)
    const orbitGroup = document.createElementNS(ns, 'g');
    orbitGroup.setAttribute('class', 'holo-orbit-group');
    orbitGroup.setAttribute('data-orbit', String(i));

    // If reduced motion, set static rotation
    if (reducedMotion) {
      orbitGroup.style.transform = `rotate(${angle}deg)`;
    }

    // Planet group (link + circle + label)
    const planetGroup = document.createElementNS(ns, 'g');
    planetGroup.setAttribute('class', 'holo-planet-group');

    const link = document.createElementNS(ns, 'a');
    link.setAttributeNS(xlink, 'href', domain.url);
    link.setAttribute('href', domain.url);
    link.setAttribute('aria-label', `Navigate to ${domain.label}`);
    link.addEventListener('click', (e) => {
      document.dispatchEvent(new CustomEvent('holoNav:navigate', {
        detail: { domain: { id: domain.id, label: domain.label, url: domain.url, color: domain.color } }
      }));
    });

    // Planet circle
    const planet = document.createElementNS(ns, 'circle');
    planet.setAttribute('class', 'holo-planet');
    planet.dataset.domain = domain.id;
    planet.setAttribute('cx', String(CENTER + radius));
    planet.setAttribute('cy', String(CENTER));
    planet.setAttribute('r', isCurrent ? '12' : '8');
    planet.setAttribute('fill', domain.color);
    planet.setAttribute('opacity', isCurrent ? '1.0' : '0.8');
    if (isCurrent) {
      planet.style.filter = `drop-shadow(0 0 8px ${domain.color})`;
    }

    // Touch target (invisible, larger hit area)
    const touchTarget = document.createElementNS(ns, 'circle');
    touchTarget.setAttribute('class', 'holo-touch-target');
    touchTarget.setAttribute('cx', String(CENTER + radius));
    touchTarget.setAttribute('cy', String(CENTER));
    touchTarget.setAttribute('r', '22');

    link.append(touchTarget, planet);

    // Label (counter-rotated to stay horizontal)
    const labelWrap = document.createElementNS(ns, 'g');
    labelWrap.setAttribute('class', 'holo-label-counter');
    labelWrap.setAttribute('data-orbit', String(i));
    labelWrap.setAttribute('transform', `translate(${CENTER + radius}, ${CENTER})`);

    if (reducedMotion) {
      labelWrap.style.transform = `translate(${CENTER + radius}px, ${CENTER}px) rotate(-${angle}deg)`;
    }

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('class', `holo-label${isCurrent ? ' holo-label--current' : ''}`);
    label.dataset.domain = domain.id;
    label.setAttribute('x', '0');
    label.setAttribute('y', '-18');
    label.textContent = domain.label;

    labelWrap.appendChild(label);
    planetGroup.append(link, labelWrap);
    orbitGroup.appendChild(planetGroup);
    svg.appendChild(orbitGroup);
  });

  return svg;
}

// ─── Trigger icon SVG ─────────────────────────────────────────────────────────

function buildTriggerIcon() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');

  // Outer ring
  const c1 = document.createElementNS(ns, 'circle');
  c1.setAttribute('cx', '12'); c1.setAttribute('cy', '12'); c1.setAttribute('r', '10');
  c1.setAttribute('stroke', 'currentColor'); c1.setAttribute('stroke-width', '1.2'); c1.setAttribute('opacity', '0.5');

  // Inner ring
  const c2 = document.createElementNS(ns, 'circle');
  c2.setAttribute('cx', '12'); c2.setAttribute('cy', '12'); c2.setAttribute('r', '6');
  c2.setAttribute('stroke', 'currentColor'); c2.setAttribute('stroke-width', '1'); c2.setAttribute('opacity', '0.7');

  // Center dot
  const c3 = document.createElementNS(ns, 'circle');
  c3.setAttribute('cx', '12'); c3.setAttribute('cy', '12'); c3.setAttribute('r', '2');
  c3.setAttribute('fill', 'currentColor');

  svg.append(c1, c2, c3);
  return svg;
}

// ─── Mobile labels ────────────────────────────────────────────────────────────

function buildMobileLabels(domains) {
  const container = document.createElement('div');
  container.className = 'holo-nav__mobile-labels';

  for (const domain of domains) {
    const a = document.createElement('a');
    a.href = domain.url;
    a.className = 'holo-nav__mobile-link';
    if (domain.id === holoNavConfig.current) {
      a.classList.add('holo-nav__mobile-link--current');
    }
    a.textContent = domain.label;
    a.style.borderColor = domain.color + '33';
    a.style.color = domain.color;
    a.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('holoNav:navigate', {
        detail: { domain: { id: domain.id, label: domain.label, url: domain.url, color: domain.color } }
      }));
    });
    container.appendChild(a);
  }

  return container;
}

// ─── DOM construction ─────────────────────────────────────────────────────────

function buildDOM(domains) {
  // Trigger button
  triggerEl = document.createElement('button');
  triggerEl.id = 'holo-nav__trigger';
  triggerEl.setAttribute('aria-expanded', 'false');
  triggerEl.setAttribute('aria-controls', 'holo-nav__panel');
  triggerEl.classList.add('holo-nav__trigger--pulse');

  const srLabel = document.createElement('span');
  srLabel.className = 'sr-only';
  srLabel.textContent = 'Open Steaz-i-verse navigation';

  triggerEl.append(buildTriggerIcon(), srLabel);
  triggerEl.addEventListener('click', toggle);

  // Panel
  panelEl = document.createElement('div');
  panelEl.id = 'holo-nav__panel';
  panelEl.setAttribute('role', 'dialog');
  panelEl.setAttribute('aria-label', 'Steaz-i-verse navigation');

  panelEl.appendChild(buildSVG(domains));
  panelEl.appendChild(buildMobileLabels(domains));

  // Click on backdrop (not on planets) closes
  panelEl.addEventListener('click', (e) => {
    if (e.target === panelEl) close();
  });

  // Place trigger
  const nav = document.querySelector('nav');
  if (nav) {
    // Insert as first child of nav (nav-brand position)
    nav.insertBefore(triggerEl, nav.firstChild);
  } else {
    triggerEl.classList.add('holo-nav__trigger--fixed');
    document.body.appendChild(triggerEl);
  }

  document.body.appendChild(panelEl);
}

// ─── Keyboard handling ────────────────────────────────────────────────────────

function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      e.stopPropagation();
      close();
    }
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function initHoloNav() {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Read config from script tag dataset
  const scriptTag = document.querySelector('script[data-current]');
  if (scriptTag) {
    holoNavConfig.current = scriptTag.dataset.current || '';
    if (scriptTag.dataset.domains) {
      try {
        holoNavConfig.domains = JSON.parse(scriptTag.dataset.domains);
      } catch (e) {
        holoNavConfig.domains = DEFAULT_DOMAINS;
      }
    } else {
      holoNavConfig.domains = DEFAULT_DOMAINS;
    }
  } else {
    holoNavConfig.domains = DEFAULT_DOMAINS;
  }

  const domains = holoNavConfig.domains.length ? holoNavConfig.domains : DEFAULT_DOMAINS;

  injectStyles();
  buildDOM(domains);
  setupKeyboard();
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHoloNav);
} else {
  initHoloNav();
}
