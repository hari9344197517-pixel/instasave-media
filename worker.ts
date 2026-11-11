/**
 * Standalone Cloudflare Worker Entry Point
 * Deployable directly with `wrangler deploy` to your free Cloudflare Workers account.
 */
import { handleApiRequest } from './src/server/core';

export interface Env {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
  ENVIRONMENT?: string;
}

export default {
  async fetch(request: Request, env: Env, _ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Route API requests to our edge-compatible API core
    if (url.pathname.startsWith('/api')) {
      return handleApiRequest(request, env);
    }

    // Serve static assets from Pages / Worker static asset directory
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
