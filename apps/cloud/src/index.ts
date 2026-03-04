import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { resolve } from 'path';
import { homeRoutes } from './routes/home';
import { skillsRoutes } from './routes/skills';
import { affordancesRoutes } from './routes/affordances';
import { storyRoutes } from './routes/story';
import { themePacksRoutes } from './routes/theme-packs';

const app = new Hono();

// ─── Security headers ────────────────────────────────────────────────────────

app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
});

// ─── Static file serving ─────────────────────────────────────────────────────

app.use('/css/*', serveStatic({ root: './public' }));
app.use('/vendor/*', serveStatic({ root: './public' }));
app.use('/steaz/*', serveStatic({
  root: resolve(import.meta.dir, '../../../packages/core/browser'),
  rewriteRequestPath: (path) => path.replace(/^\/steaz/, ''),
}));

// ─── Routes ──────────────────────────────────────────────────────────────────

app.route('/', homeRoutes);
app.route('/', skillsRoutes);
app.route('/', affordancesRoutes);
app.route('/', storyRoutes);
app.route('/', themePacksRoutes);

// ─── Server ──────────────────────────────────────────────────────────────────

const port = process.env.PORT ?? 3001;

export default {
  port: Number(port),
  fetch: app.fetch,
};

console.log(`⚡ steaz.cloud listening on http://localhost:${port}`);
