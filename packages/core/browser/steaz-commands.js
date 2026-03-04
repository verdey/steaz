// @steaz/core — Command Parser for Zone 2
// Content-agnostic command dispatch. Configure endpoints via commandConfig.
// Pure client-side ES module.

import {
  nextBlock, prevBlock, pause, resume, scrollToBlock,
  restoreContent, enterCommandView, isInCommandView,
} from './steaz.js';

// ─── Configurable endpoints (consuming apps set these) ───────────────────────

export const commandConfig = {
  listEndpoint: null,      // e.g., '/dreams/list'
  searchEndpoint: null,    // e.g., '/dreams/search'
  contentLabel: 'content', // e.g., 'dream archive'
};

// ─── Command registry ────────────────────────────────────────────────────────

const COMMANDS = {
  help:   { description: 'show available commands', handler: showHelp },
  next:   { description: 'next content block', handler: () => { resume(); nextBlock(); } },
  back:   { description: 'previous content block', handler: () => { resume(); prevBlock(); } },
  list:   { description: 'list all entries', handler: showList },
  goto:   { description: 'goto <title or number>', handler: gotoBlock },
  search: { description: 'search <term>', handler: searchBlocks },
  play:   { description: 'resume auto-scroll', handler: resume },
  pause:  { description: 'pause auto-scroll', handler: pause },
  clear:  { description: 'clear command output', handler: clearOutput },
};

// ─── Command handlers ────────────────────────────────────────────────────────

function getContentPlayer() {
  return document.querySelector('.steaz__content-player');
}

function showHelp() {
  pause();
  enterCommandView();
  const player = getContentPlayer();
  if (!player) return;

  const lines = Object.entries(COMMANDS).map(([cmd, info]) =>
    `<div class="steaz-list__item"><span style="color:var(--tron-cyan)">${cmd}</span> — ${info.description}</div>`
  ).join('\n');

  player.innerHTML = `
    <div class="steaz-response" style="padding:2rem 0">
      <div style="color:var(--tron-cyan);margin-bottom:1rem">available commands:</div>
      ${lines}
      <div style="margin-top:1.5rem;color:var(--terminal-dim)">type <span style="color:var(--tron-cyan)">clear</span> to return to ${commandConfig.contentLabel}</div>
    </div>`;
}

function showList() {
  pause();
  enterCommandView();
  const player = getContentPlayer();
  if (!player) return;

  if (!commandConfig.listEndpoint) {
    player.innerHTML = `
      <div class="steaz-response" style="padding:2rem 0">
        <div style="color:var(--terminal-dim)">list not configured for this instance</div>
        <div style="margin-top:1rem;color:var(--terminal-dim)">type <span style="color:var(--tron-cyan)">clear</span> to return</div>
      </div>`;
    return;
  }

  fetch(commandConfig.listEndpoint)
    .then(r => r.text())
    .then(html => {
      player.innerHTML = `
        <div class="steaz-response" style="padding:2rem 0">
          <div style="color:var(--tron-cyan);margin-bottom:1rem">${commandConfig.contentLabel} archive:</div>
          ${html}
          <div style="margin-top:1.5rem;color:var(--terminal-dim)">type <span style="color:var(--tron-cyan)">goto &lt;title&gt;</span> to navigate, or <span style="color:var(--tron-cyan)">clear</span> to return</div>
        </div>`;
    });
}

function gotoBlock(args) {
  if (!args) {
    showInPlayer('usage: goto &lt;title or slug&gt;');
    return;
  }

  // First try exact slug match
  const slug = args.trim().toLowerCase().replace(/\s+/g, '-');
  const player = getContentPlayer();
  if (!player) return;

  // If in command view, restore first
  if (isInCommandView()) {
    restoreContent();
  }

  // Try slug match
  const matchBySlug = Array.from(document.querySelectorAll('.steaz-block'))
    .findIndex(el => el.dataset.id === slug);

  if (matchBySlug !== -1) {
    resume();
    scrollToBlock(slug);
    return;
  }

  // Try partial title match
  const allBlocks = Array.from(document.querySelectorAll('.steaz-block'));
  const matchByTitle = allBlocks.findIndex(el => {
    const title = el.dataset.id?.replace(/-/g, ' ') || '';
    return title.includes(args.trim().toLowerCase());
  });

  if (matchByTitle !== -1) {
    resume();
    scrollToBlock(allBlocks[matchByTitle].dataset.id);
    return;
  }

  showInPlayer(`no entry found matching "${args}"`);
}

function searchBlocks(args) {
  if (!args) {
    showInPlayer('usage: search &lt;term&gt;');
    return;
  }

  pause();
  enterCommandView();
  const player = getContentPlayer();
  if (!player) return;

  if (!commandConfig.searchEndpoint) {
    player.innerHTML = `
      <div class="steaz-response" style="padding:2rem 0">
        <div style="color:var(--terminal-dim)">search not configured for this instance</div>
        <div style="margin-top:1rem;color:var(--terminal-dim)">type <span style="color:var(--tron-cyan)">clear</span> to return</div>
      </div>`;
    return;
  }

  fetch(`${commandConfig.searchEndpoint}?q=${encodeURIComponent(args)}`)
    .then(r => r.text())
    .then(html => {
      player.innerHTML = `
        <div class="steaz-response" style="padding:2rem 0">
          <div style="color:var(--tron-cyan);margin-bottom:1rem">search results for "${args}":</div>
          ${html}
          <div style="margin-top:1.5rem;color:var(--terminal-dim)">type <span style="color:var(--tron-cyan)">clear</span> to return to ${commandConfig.contentLabel}</div>
        </div>`;
    });
}

function clearOutput() {
  restoreContent();
  resume();
}

function showUnknown(cmd) {
  showInPlayer(`unknown command: ${cmd}. type <span style="color:var(--tron-cyan)">help</span> for available commands.`);
}

function showInPlayer(html) {
  const player = getContentPlayer();
  if (!player) return;
  // Brief flash in the player without entering full command view
  const existing = player.querySelector('.steaz-response--flash');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = 'steaz-response steaz-response--flash';
  div.style.cssText = 'position:sticky;top:0;background:rgba(10,15,12,0.9);padding:0.75rem 0;z-index:1;';
  div.innerHTML = html;
  player.prepend(div);

  setTimeout(() => div.remove(), 4000);
}

// ─── Public API — command execution ──────────────────────────────────────────

export function executeCommand(input) {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return;

  const [cmd, ...args] = trimmed.split(/\s+/);
  const command = COMMANDS[cmd];

  if (command) {
    command.handler(args.join(' '));
  } else {
    showUnknown(cmd);
  }
}
