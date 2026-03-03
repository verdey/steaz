import { Hono } from 'hono';
import { renderLayout } from '../views/layout';
import { renderHome } from '../views/home';

export const homeRoutes = new Hono();

homeRoutes.get('/', (c) => {
  return c.html(renderLayout('steaz.cloud', renderHome()));
});
