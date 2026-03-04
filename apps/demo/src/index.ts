import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { resolve, dirname } from 'path';

const app = new Hono();

// ─── Resolve @steaz/core browser directory ──────────────────────────────────

const coreDir = resolve(import.meta.dir, '../../../packages/core');
const coreBrowser = resolve(coreDir, 'browser');

// ─── Static file serving ────────────────────────────────────────────────────

// Serve @steaz/core browser assets (JS + CSS)
app.get('/steaz/*', async (c) => {
  const filePath = c.req.path.replace('/steaz/', '');
  const fullPath = resolve(coreBrowser, filePath);

  const file = Bun.file(fullPath);
  if (await file.exists()) {
    const ext = filePath.split('.').pop();
    const contentType = ext === 'js' ? 'text/javascript' : ext === 'css' ? 'text/css' : 'application/octet-stream';
    return new Response(file, { headers: { 'Content-Type': contentType } });
  }
  return c.notFound();
});

// Serve demo-specific static files (CSS tokens)
app.use('/css/*', serveStatic({ root: resolve(import.meta.dir, '../public') }));

// ─── Main route ─────────────────────────────────────────────────────────────

app.get('/', (c) => {
  return c.html(renderPage());
});

// ─── HTML renderer ──────────────────────────────────────────────────────────

function renderPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Steaz Demo — @steaz/core</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/steaz/steaz.css">
</head>
<body>
  <canvas id="void"></canvas>
  <main id="app">
    <div id="steaz" role="region" aria-label="Steaz terminal">

      <!-- ZONE 1: Content Player -->
      <div class="steaz__content-player" data-steaz-id="zone1">
${renderBlocks()}
      </div>

      <!-- ZONE 2: Command Input -->
      <div class="steaz__command-zone" data-steaz-id="zone2"
           x-data="{ cmd: '' }">
        <span class="steaz__prompt">&gt;</span>
        <input type="text" class="steaz__command-input"
               x-model="cmd"
               @keydown.enter="window.__steazExec(cmd); cmd = ''"
               @focus="$dispatch('steaz:pause')"
               placeholder="type help..."
               autocomplete="off" autocorrect="off" autocapitalize="off"
               spellcheck="false">
      </div>

      <!-- Floating Controls -->
      <div class="steaz__controls" data-steaz-id="controls" x-data="{ playing: true }">
        <button class="steaz__btn" @click="$dispatch('steaz:prev')">&#9650;</button>
        <button class="steaz__btn steaz__btn--play"
                @click="playing = !playing; $dispatch(playing ? 'steaz:play' : 'steaz:pause')">
          <span x-text="playing ? '&#9208;' : '&#9654;'">&#9208;</span>
        </button>
        <button class="steaz__btn" @click="$dispatch('steaz:next')">&#9660;</button>
      </div>

      <!-- Floating Meta -->
      <div class="steaz__meta" data-steaz-id="meta">
        <span class="steaz__meta-title" id="steaz-title"></span>
        <span class="steaz__meta-date" id="steaz-date"></span>
      </div>
    </div>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js" defer></script>
  <script type="module" src="/steaz/void.js"></script>
  <script type="module">
    import { onContentReady } from '/steaz/steaz.js';
    import { executeCommand } from '/steaz/steaz-commands.js';

    // Expose executeCommand for Alpine inline binding
    window.__steazExec = executeCommand;

    // Content is static (no HTMX), so signal readiness manually
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => onContentReady());
    } else {
      // Small delay to let initSteaz() run first
      setTimeout(() => onContentReady(), 50);
    }
  </script>
</body>
</html>`;
}

// ─── Static content blocks ──────────────────────────────────────────────────

function renderBlocks(): string {
  const blocks = [
    {
      id: 'the-signal',
      date: '2026-03-03',
      title: 'The Signal',
      tags: ['#steaz', '#origin'],
      body: `Point Steaz at any signal — any URL, any text, any content.

It receives, interprets, and transmits that content
as a living, configurable experience.

Renders. Images. Parallaxed video. TextArt.

The universal content interface.`,
    },
    {
      id: 'the-engine',
      date: '2026-03-03',
      title: 'The Engine',
      tags: ['#core', '#extraction'],
      body: `This terminal is powered by @steaz/core.

Extracted from Dreamscapes — its first client —
and now sovereign. The engine stands alone.

Two zones. Typewriter reveal. Auto-scroll.
Keyboard shortcuts. Command system.
The Void canvas behind everything.

Complexity goes into the art,
not the tooling.`,
    },
    {
      id: 'the-void',
      date: '2026-03-03',
      title: 'The Void',
      tags: ['#canvas', '#cosmic'],
      body: `Behind the terminal: the cosmic canvas.

Four parallax star layers drift upward.
Three nebulae pulse with screen-blend glow.
Stars cluster around invisible centers,
twinkling on sine waves that never
fully dim.

The Void is not decoration.
It is the space between thoughts.`,
    },
    {
      id: 'the-invitation',
      date: '2026-03-03',
      title: 'The Invitation',
      tags: ['#humanity', '#gift'],
      body: `Steaz is free. Steaz is for humanity.

The paradox: giving it away makes it richer
than monetizing it ever could.

Try the commands below:
  > help     — see all commands
  > next     — next block
  > back     — previous block

Space to pause. Arrows to scroll.
/ to focus the command input.`,
    },
  ];

  return blocks.map(b => `
        <article class="steaz-block" data-id="${b.id}" data-date="${b.date}">
          <div class="steaz-block__separator">\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550</div>
          <h2 class="steaz-block__title">${b.title}</h2>
          <div class="steaz-block__meta">
            <time class="steaz-block__date">${b.date}</time>
            ${b.tags.map(t => `<span class="steaz-block__tag">${t}</span>`).join(' ')}
          </div>
          <div class="steaz-block__separator">\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</div>
          <div class="steaz-block__body">${b.body.replace(/\n/g, '<br>')}</div>
        </article>`).join('\n');
}

// ─── Server ─────────────────────────────────────────────────────────────────

const port = 3002;
console.log(`@steaz/demo running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
