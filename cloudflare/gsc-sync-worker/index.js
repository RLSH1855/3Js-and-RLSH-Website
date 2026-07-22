// cloudflare/gsc-sync-worker/index.js
// Nightly Search Console sync. Lives outside the Pages project because Pages
// Functions cannot run on a schedule.
import { runSync } from '../functions/_lib/gsc-sync.js';

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      runSync(env).then(
        result => console.log('GSC sync complete', JSON.stringify(result)),
        err => console.error('GSC sync failed:', err && err.message ? err.message : err)
      )
    );
  },

  // Manual trigger, for the first backfill and for debugging. Gated behind a
  // shared secret so it is not open to the world.
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/run') return new Response('Not found', { status: 404 });
    if (!env.SYNC_TRIGGER_KEY || request.headers.get('x-sync-key') !== env.SYNC_TRIGGER_KEY) {
      return new Response('Unauthorized', { status: 401 });
    }
    try {
      const result = await runSync(env);
      return new Response(JSON.stringify(result), {
        headers: { 'content-type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err && err.message ? err.message : err) }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }
  }
};
