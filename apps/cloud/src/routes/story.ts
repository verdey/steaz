import { Hono } from 'hono';
import { renderLayout } from '../views/layout';
import { renderStory } from '../views/story';

export const storyRoutes = new Hono();

storyRoutes.get('/story', (c) => {
  return c.html(renderLayout('Our Story | steaz.cloud', renderStory()));
});
