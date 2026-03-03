import { Hono } from 'hono';
import { renderLayout } from '../views/layout';
import { renderAffordances } from '../views/affordances';

export const affordancesRoutes = new Hono();

affordancesRoutes.get('/affordances', (c) => {
  return c.html(renderLayout('Affordances | steaz.cloud', renderAffordances()));
});
