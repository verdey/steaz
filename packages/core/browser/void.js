// public/js/void.js — The Void
// The cosmic canvas. Session 3's producer panel reads voidConfig to expose controls.

export const voidConfig = {
  starCount: { far: 200, mid: 100, near: 50, bright: 15 },
  driftSpeed: 0.15,
  twinkleSpeed: 0.02,
  nebulaIntensity: 1.0,
  parallaxDepth: 1.0,
};

function initVoid() {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('void'));
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationId = 0;
  let time = 0;
  let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Star & Nebula data structures ──────────────────────────────────────────

  /**
   * @typedef {{ x: number, y: number, size: number, opacity: number, phase: number,
   *             drift: number, color: string, bloomRadius: number }} Star
   */

  /** @type {Star[][]} [far, mid, near, bright] */
  let layers = [];

  /** @type {{ x: number, y: number, radiusX: number, radiusY: number,
   *            color: string, drift: number, phase: number }[]} */
  let nebulae = [];

  // ─── Cluster centers (normalised 0-1) ────────────────────────────────────────
  const clusterCenters = [
    { x: 0.25, y: 0.35 },
    { x: 0.72, y: 0.55 },
    { x: 0.50, y: 0.15 },
  ];

  // ─── Color palettes per layer ────────────────────────────────────────────────
  const farColors  = ['#e0e0ff'];
  const midColors  = ['#e0e0ff', '#ffd4a0', '#e0e0ff'];
  const nearColors = ['#e0e0ff', '#ffd4a0', '#c4b5fd'];
  const brightColors = ['#e0e0ff', '#00d4ff', '#c4b5fd'];

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  /** Pick a random item from an array */
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Gaussian-biased random: average of two randoms, then scale to [0,1].
   * When centered, produces a bell curve biased toward 0.5.
   */
  function gaussianRand() {
    return (Math.random() + Math.random()) / 2;
  }

  /**
   * Place a star biased toward one of the cluster centers.
   * 60% of stars cluster, 40% are uniformly distributed.
   */
  function clusterPosition() {
    if (Math.random() < 0.4) {
      return { x: Math.random(), y: Math.random() };
    }
    const c = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
    const spread = 0.25;
    const x = Math.max(0, Math.min(1, c.x + (gaussianRand() - 0.5) * spread));
    const y = Math.max(0, Math.min(1, c.y + (gaussianRand() - 0.5) * spread));
    return { x, y };
  }

  // ─── Build star layers ───────────────────────────────────────────────────────

  function buildLayers() {
    layers = [
      buildLayer(voidConfig.starCount.far,    1,   1,   farColors,    0.3, 0.6, 0.05),
      buildLayer(voidConfig.starCount.mid,    1,   2,   midColors,    0.5, 0.8, 0.10),
      buildLayer(voidConfig.starCount.near,   2,   3,   nearColors,   0.6, 0.9, 0.15),
      buildLayer(voidConfig.starCount.bright, 3,   4,   brightColors, 0.8, 1.0, 0.20, true),
    ];
  }

  /**
   * @param {number} count
   * @param {number} minSize
   * @param {number} maxSize
   * @param {string[]} colors
   * @param {number} minOpacity
   * @param {number} maxOpacity
   * @param {number} drift  px/frame base speed
   * @param {boolean} [bloom]
   * @returns {Star[]}
   */
  function buildLayer(count, minSize, maxSize, colors, minOpacity, maxOpacity, drift, bloom = false) {
    return Array.from({ length: count }, () => {
      const pos = clusterPosition();
      return {
        x:          Math.round(pos.x * width),
        y:          Math.round(pos.y * height),
        size:       Math.round(minSize + Math.random() * (maxSize - minSize)),
        opacity:    minOpacity + Math.random() * (maxOpacity - minOpacity),
        phase:      Math.random() * Math.PI * 2,
        drift:      drift * voidConfig.driftSpeed * (0.8 + Math.random() * 0.4),
        color:      pick(colors),
        bloomRadius: bloom ? Math.round(2 + Math.random() * 3) : 0,
      };
    });
  }

  // ─── Build nebulae ───────────────────────────────────────────────────────────

  function buildNebulae() {
    nebulae = [
      {
        x:       width * 0.20, y: height * 0.40,
        radiusX: width * 0.35, radiusY: height * 0.30,
        color:   'rgba(124,58,237,0.028)',
        drift:   0.003, phase: 0,
      },
      {
        x:       width * 0.75, y: height * 0.55,
        radiusX: width * 0.30, radiusY: height * 0.25,
        color:   'rgba(0,212,255,0.018)',
        drift:   0.002, phase: Math.PI,
      },
      {
        x:       width * 0.50, y: height * 0.20,
        radiusX: width * 0.25, radiusY: height * 0.20,
        color:   'rgba(124,58,237,0.015)',
        drift:   0.0025, phase: Math.PI * 0.7,
      },
    ];
  }

  // ─── Resize ──────────────────────────────────────────────────────────────────

  function resize() {
    dpr    = window.devicePixelRatio || 1;
    width  = window.innerWidth;
    height = window.innerHeight;

    canvas.width  = Math.round(width  * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    buildLayers();
    buildNebulae();
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  function render() {
    // Clear with solid void color — no white flash
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // Nebula haze — beneath stars, using 'screen' blend for additive glow
    const savedComposite = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'screen';

    for (const neb of nebulae) {
      const drift = Math.sin(time * neb.drift + neb.phase) * 8;
      const grad = ctx.createRadialGradient(
        neb.x + drift, neb.y,          0,
        neb.x + drift, neb.y, Math.max(neb.radiusX, neb.radiusY)
      );
      grad.addColorStop(0,   neb.color);
      grad.addColorStop(0.5, neb.color);
      grad.addColorStop(1,   'rgba(0,0,0,0)');

      ctx.save();
      ctx.translate(neb.x + drift, neb.y);
      ctx.scale(neb.radiusX / Math.max(neb.radiusX, neb.radiusY), neb.radiusY / Math.max(neb.radiusX, neb.radiusY));
      ctx.translate(-(neb.x + drift), -neb.y);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    ctx.globalCompositeOperation = savedComposite;

    // Stars — layer by layer (far → bright, back to front)
    for (const layer of layers) {
      for (const star of layer) {
        const twinkle = Math.sin(time * voidConfig.twinkleSpeed + star.phase);
        // Map twinkle from [-1,1] to [0.6, 1.0] — subtle, never fully dark
        const alpha = star.opacity * (0.8 + 0.2 * twinkle);

        // Bloom for bright accent stars
        if (star.bloomRadius > 0) {
          ctx.fillStyle = hexToRgba(star.color, alpha * 0.25);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.bloomRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star pixel — integer coords, crisp
        ctx.fillStyle = hexToRgba(star.color, alpha);
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }
    }
  }

  // ─── Update star positions ───────────────────────────────────────────────────

  function update() {
    for (const layer of layers) {
      for (const star of layer) {
        star.y -= star.drift;
        if (star.y < -star.size) {
          star.y = height + star.size;
          const pos = clusterPosition();
          star.x = Math.round(pos.x * width);
        }
      }
    }
  }

  // ─── Animation loop ──────────────────────────────────────────────────────────

  function loop() {
    time++;
    update();
    render();
    if (!reducedMotion) {
      animationId = requestAnimationFrame(loop);
    }
  }

  // ─── Hex → rgba helper ───────────────────────────────────────────────────────

  /** @param {string} hex @param {number} alpha */
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
  }

  // ─── ResizeObserver ──────────────────────────────────────────────────────────

  const ro = new ResizeObserver(() => {
    if (animationId) cancelAnimationFrame(animationId);
    resize();
    if (reducedMotion) {
      render(); // one static frame
    } else {
      animationId = requestAnimationFrame(loop);
    }
  });

  ro.observe(document.documentElement);

  // ─── Boot ────────────────────────────────────────────────────────────────────
  resize();
  if (reducedMotion) {
    render();
  } else {
    animationId = requestAnimationFrame(loop);
  }
}

initVoid();
