import { serve } from '@hono/node-server';
import app from './app/index.js';
const PORT = +(process.env.PORT || 3000);
serve({ fetch: app.fetch, port: PORT }, info => {
    console.log(`Server running on http://localhost:${info.port}`);
});
