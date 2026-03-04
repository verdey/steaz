// @steaz/core — Steaz Client Engine
// Content-agnostic terminal interface: scroll, typewriter, playback, config.
// Pure client-side ES module. No server imports.

// ─── Configuration (exported for producer panel integration) ──────────────────

export const steazConfig = {
  scrollSpeed: 0.5,         // pixels per frame (base auto-scroll speed)
  fontSize: 1.0,            // multiplier
  opacity: 0.78,            // terminal background opacity
  glowIntensity: 1.0,       // glow on borders/text-shadow (0-1 mapped to CSS)
  colorScheme: 'green',     // 'green' | 'cyan' | 'amber' | 'white'
  typewriterSpeed: 30,      // ms per character
  scrollMode: 'native',     // 'native' | 'transform' — Wu Wei: default + alternative
};

// ─── Color scheme map ────────────────────────────────────────────────────────

const COLOR_SCHEMES = {
  green: '#00ff41',
  cyan:  '#00d4ff',
  amber: '#fbbf24',
  white: '#e0e0ff',
};

// ─── DOM references ──────────────────────────────────────────────────────────

let steazEl = null;
let contentPlayer = null;
let metaEl = null;
let titleEl = null;
let dateEl = null;
let playBtn = null;

// ─── State ───────────────────────────────────────────────────────────────────

let isPlaying = false;
let animFrameId = null;
let blocks = [];
let activeBlockIndex = -1;
let pauseTimestamp = 0;
let pulseTimeout = null;
let contentLoaded = false;
let savedContentHtml = '';
let isCommandView = false;

// ─── Wu Wei Scroll Abstraction ───────────────────────────────────────────────
// The scroll engine is abstracted. Only 'native' is implemented this session.
// A 'transform' engine can be swapped in later by changing steazConfig.scrollMode.

const scrollEngines = {
  native: {
    start() {
      if (animFrameId) return;
      const tick = () => {
        if (!isPlaying || !contentPlayer) return;
        contentPlayer.scrollTop += steazConfig.scrollSpeed;

        // Content cycling: if at the bottom, pause then loop back
        const atBottom = contentPlayer.scrollTop + contentPlayer.clientHeight >= contentPlayer.scrollHeight - 2;
        if (atBottom) {
          pause();
          setTimeout(() => {
            if (contentPlayer) {
              contentPlayer.scrollTo({ top: 0, behavior: 'smooth' });
              // Reset typewriter state for re-encounter
              resetTypewriterState();
            }
            setTimeout(() => resume(), 1500);
          }, 2000);
          return;
        }

        animFrameId = requestAnimationFrame(tick);
      };
      animFrameId = requestAnimationFrame(tick);
    },
    stop() {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    },
    scrollBy(px) {
      if (contentPlayer) contentPlayer.scrollTop += px;
    },
    scrollToElement(el) {
      if (!contentPlayer || !el) return;
      const offset = el.offsetTop - contentPlayer.offsetTop;
      contentPlayer.scrollTo({ top: offset - 20, behavior: 'smooth' });
    },
  },
};

function getEngine() {
  return scrollEngines[steazConfig.scrollMode] || scrollEngines.native;
}

// ─── Public API (exported for producer panel + commands) ─────────────────────

export function setScrollSpeed(speed) {
  steazConfig.scrollSpeed = Math.max(0.1, Math.min(5, speed));
}

export function setColorScheme(scheme) {
  if (!COLOR_SCHEMES[scheme]) return;
  steazConfig.colorScheme = scheme;
  if (steazEl) steazEl.style.setProperty('--steaz-text', COLOR_SCHEMES[scheme]);
}

export function setFontSize(multiplier) {
  steazConfig.fontSize = Math.max(0.5, Math.min(3, multiplier));
  if (steazEl) steazEl.style.setProperty('--steaz-font-scale', String(steazConfig.fontSize));
}

export function setOpacity(opacity) {
  steazConfig.opacity = Math.max(0.1, Math.min(1, opacity));
  if (steazEl) steazEl.style.setProperty('--steaz-opacity', String(steazConfig.opacity));
}

export function setGlowIntensity(intensity) {
  steazConfig.glowIntensity = Math.max(0, Math.min(1, intensity));
  const mapped = steazConfig.glowIntensity * 0.3; // map 0-1 → 0-0.3 for CSS
  if (steazEl) steazEl.style.setProperty('--steaz-glow', String(mapped));
}

export function setTypewriterSpeed(ms) {
  steazConfig.typewriterSpeed = Math.max(5, Math.min(200, ms));
}

export function pause() {
  if (!isPlaying) return;
  isPlaying = false;
  getEngine().stop();
  pauseTimestamp = Date.now();
  startPulseTimer();
}

export function resume() {
  isPlaying = true;
  clearPulseTimer();
  getEngine().start();
}

export function nextBlock() {
  if (!blocks.length) return;
  const next = Math.min(activeBlockIndex + 1, blocks.length - 1);
  navigateToBlock(next, true);
}

export function prevBlock() {
  if (!blocks.length) return;
  const prev = Math.max(activeBlockIndex - 1, 0);
  navigateToBlock(prev, true);
}

export function scrollToBlock(slug) {
  const idx = blocks.findIndex(b => b.el.dataset.id === slug);
  if (idx !== -1) navigateToBlock(idx, true);
}

// ─── Restore content after command view ───────────────────────────────────────

export function restoreContent() {
  if (!isCommandView || !contentPlayer || !savedContentHtml) return;
  contentPlayer.innerHTML = savedContentHtml;
  isCommandView = false;
  refreshBlocks();
}

export function enterCommandView() {
  if (!contentPlayer) return;
  if (!isCommandView) {
    savedContentHtml = contentPlayer.innerHTML;
    isCommandView = true;
  }
}

export function isInCommandView() {
  return isCommandView;
}

// ─── Content lifecycle — call when content is populated ───────────────────────

export function onContentReady() {
  if (contentLoaded) return; // guard against double-init
  contentLoaded = true;
  refreshBlocks();
  // Start auto-scroll after a beat
  setTimeout(() => {
    isPlaying = true;
    getEngine().start();
  }, 800);
}

// ─── Internal: Navigate to a block by index ──────────────────────────────────

function navigateToBlock(index, skipTypewriter) {
  if (index < 0 || index >= blocks.length) return;
  activeBlockIndex = index;
  const block = blocks[index];

  if (skipTypewriter) {
    // Show full text immediately — no typewriter for manual navigation
    revealBlockInstantly(block.el);
  }

  getEngine().scrollToElement(block.el);
  updateMeta(block.el);
}

// ─── Internal: Block detection (which block is visible?) ─────────────────────

function refreshBlocks() {
  blocks = Array.from(contentPlayer.querySelectorAll('.steaz-block')).map(el => ({
    el,
    typed: false,
  }));
  setupTypewriterObserver();
}

function detectActiveBlock() {
  if (!contentPlayer || !blocks.length) return;

  const playerRect = contentPlayer.getBoundingClientRect();
  const playerMid = playerRect.top + playerRect.height / 3;
  let closest = 0;
  let closestDist = Infinity;

  for (let i = 0; i < blocks.length; i++) {
    const rect = blocks[i].el.getBoundingClientRect();
    const dist = Math.abs(rect.top - playerMid);
    if (dist < closestDist) {
      closestDist = dist;
      closest = i;
    }
  }

  if (closest !== activeBlockIndex) {
    activeBlockIndex = closest;
    updateMeta(blocks[closest].el);
  }
}

function updateMeta(el) {
  if (!titleEl || !dateEl || !metaEl) return;
  const id = el.dataset.id || '';
  const date = el.dataset.date || '';
  // Convert slug to readable title
  titleEl.textContent = id.replace(/-/g, ' ');
  dateEl.textContent = date;
  metaEl.classList.add('visible');
}

// ─── Internal: Typewriter reveal ─────────────────────────────────────────────

let typewriterObserver = null;

function setupTypewriterObserver() {
  if (typewriterObserver) typewriterObserver.disconnect();
  if (!contentPlayer) return;

  typewriterObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const blockEl = entry.target.closest('.steaz-block');
      if (!blockEl) continue;
      const blockData = blocks.find(b => b.el === blockEl);
      if (!blockData || blockData.typed) continue;
      blockData.typed = true;
      typewriteBlock(blockEl);
    }
  }, {
    root: contentPlayer,
    threshold: 0.1,
  });

  for (const block of blocks) {
    const body = block.el.querySelector('.steaz-block__body');
    if (body) {
      body.style.visibility = 'hidden';
      typewriterObserver.observe(body);
    }
  }
}

function typewriteBlock(blockEl) {
  const body = blockEl.querySelector('.steaz-block__body');
  if (!body) return;

  const fullHtml = body.innerHTML;
  body.innerHTML = '';
  body.style.visibility = 'visible';

  // Parse HTML into segments: text characters and <br> tags
  const segments = [];
  let i = 0;
  while (i < fullHtml.length) {
    if (fullHtml.substring(i, i + 4) === '<br>') {
      segments.push({ type: 'tag', value: '<br>' });
      i += 4;
    } else if (fullHtml[i] === '&') {
      // Handle HTML entities like &amp; &lt; etc.
      const semiIdx = fullHtml.indexOf(';', i);
      if (semiIdx !== -1 && semiIdx - i < 10) {
        segments.push({ type: 'entity', value: fullHtml.substring(i, semiIdx + 1) });
        i = semiIdx + 1;
      } else {
        segments.push({ type: 'char', value: fullHtml[i] });
        i++;
      }
    } else {
      segments.push({ type: 'char', value: fullHtml[i] });
      i++;
    }
  }

  let segIdx = 0;
  let rendered = '';

  function typeNext() {
    if (segIdx >= segments.length) return;

    const batch = Math.max(1, Math.floor(3 / (steazConfig.typewriterSpeed / 30)));
    for (let b = 0; b < batch && segIdx < segments.length; b++) {
      const seg = segments[segIdx];
      rendered += seg.value;
      segIdx++;
      // Tags and whitespace don't need individual timing
      if (seg.type === 'tag' || (seg.type === 'char' && seg.value === ' ')) {
        b--;
      }
    }

    body.innerHTML = rendered;
    if (segIdx < segments.length) {
      setTimeout(typeNext, steazConfig.typewriterSpeed);
    }
  }

  typeNext();
}

function revealBlockInstantly(blockEl) {
  const body = blockEl.querySelector('.steaz-block__body');
  if (body) body.style.visibility = 'visible';
  const blockData = blocks.find(b => b.el === blockEl);
  if (blockData) blockData.typed = true;
}

function resetTypewriterState() {
  for (const block of blocks) {
    block.typed = false;
  }
  setupTypewriterObserver();
}

// ─── Internal: 30-second pulse invite ────────────────────────────────────────

function startPulseTimer() {
  clearPulseTimer();
  pulseTimeout = setTimeout(() => {
    if (playBtn && !isPlaying) {
      playBtn.classList.add('pulsing');
    }
  }, 30000);
}

function clearPulseTimer() {
  if (pulseTimeout) {
    clearTimeout(pulseTimeout);
    pulseTimeout = null;
  }
  if (playBtn) playBtn.classList.remove('pulsing');
}

// ─── Internal: User scroll detection ─────────────────────────────────────────

function setupScrollDetection() {
  if (!contentPlayer) return;

  let userScrolling = false;

  // Wheel: user is scrolling manually
  contentPlayer.addEventListener('wheel', () => {
    if (isPlaying) pause();
  }, { passive: true });

  // Touch: tap to pause/resume, swipe lets native scroll handle it
  let touchStartY = 0;
  let touchStartTime = 0;

  contentPlayer.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    userScrolling = false;
  }, { passive: true });

  contentPlayer.addEventListener('touchmove', () => {
    userScrolling = true;
    if (isPlaying) pause();
  }, { passive: true });

  contentPlayer.addEventListener('touchend', (e) => {
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    const dt = Date.now() - touchStartTime;
    // Short tap with <10px movement = toggle
    if (!userScrolling && dy < 10 && dt < 300) {
      if (isPlaying) pause();
      else resume();
    }
  }, { passive: true });

  // Track scroll position for block detection
  contentPlayer.addEventListener('scroll', () => {
    detectActiveBlock();
  }, { passive: true });
}

// ─── Internal: Keyboard shortcuts ────────────────────────────────────────────

function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    const input = document.querySelector('.steaz__command-input');
    const inputFocused = document.activeElement === input;

    switch (e.key) {
      case ' ':
        if (!inputFocused) {
          e.preventDefault();
          if (isPlaying) pause(); else resume();
        }
        break;
      case 'ArrowUp':
        if (!inputFocused) {
          e.preventDefault();
          getEngine().scrollBy(-60);
          if (isPlaying) pause();
        }
        break;
      case 'ArrowDown':
        if (!inputFocused) {
          e.preventDefault();
          getEngine().scrollBy(60);
          if (isPlaying) pause();
        }
        break;
      case 'ArrowRight':
      case 'n':
        if (!inputFocused) {
          e.preventDefault();
          resume();
          nextBlock();
        }
        break;
      case 'ArrowLeft':
      case 'p':
        if (!inputFocused) {
          e.preventDefault();
          resume();
          prevBlock();
        }
        break;
      case '/':
        if (!inputFocused && input) {
          e.preventDefault();
          input.focus();
        }
        break;
      case 'Escape':
        if (inputFocused && input) {
          input.blur();
        }
        break;
    }
  });
}

// ─── Internal: Custom event listeners (Alpine integration) ───────────────────

function setupCustomEvents() {
  document.addEventListener('steaz:play', () => resume());
  document.addEventListener('steaz:pause', () => pause());
  document.addEventListener('steaz:next', () => { resume(); nextBlock(); });
  document.addEventListener('steaz:prev', () => { resume(); prevBlock(); });
}

// ─── Internal: Error state handling ──────────────────────────────────────────

function setupErrorHandling() {
  if (!contentPlayer) return;

  // Listen for HTMX errors (auto-detected when HTMX is present)
  document.addEventListener('htmx:responseError', () => {
    showErrorState();
  });

  // Timeout: if content hasn't loaded after 8 seconds
  setTimeout(() => {
    if (!contentLoaded && contentPlayer) {
      showErrorState();
    }
  }, 8000);
}

function showErrorState() {
  if (!contentPlayer) return;
  contentPlayer.innerHTML = `
    <div class="steaz__loading">
      <span class="steaz__loading-text">the akash rests between transmissions. breathe and return.</span>
      <br><br>
      <span class="steaz-response" style="cursor:pointer" onclick="location.reload()">&gt; retry</span>
    </div>`;
}

// ─── Init ────────────────────────────────────────────────────────────────────

function initSteaz() {
  steazEl = document.getElementById('steaz');
  contentPlayer = document.querySelector('.steaz__content-player');
  metaEl = document.querySelector('.steaz__meta');
  titleEl = document.getElementById('steaz-title');
  dateEl = document.getElementById('steaz-date');
  playBtn = document.querySelector('.steaz__btn--play');

  if (!steazEl || !contentPlayer) return;

  // Apply initial config to CSS custom properties
  setColorScheme(steazConfig.colorScheme);
  setOpacity(steazConfig.opacity);
  setGlowIntensity(steazConfig.glowIntensity);

  // Auto-detect HTMX: if present, listen for content settlement
  document.addEventListener('htmx:afterSettle', (e) => {
    if (e.detail.target === contentPlayer || contentPlayer.contains(e.detail.target)) {
      onContentReady();
    }
  });

  setupScrollDetection();
  setupKeyboard();
  setupCustomEvents();
  setupErrorHandling();
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSteaz);
} else {
  initSteaz();
}
