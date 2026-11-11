import type { VercelRequest, VercelResponse } from '@vercel/node';
import { vercelHandler } from './_adapter';

/**
 * Vercel Serverless Root API Route: /api
 * Returns API service health status and active configuration.
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return vercelHandler(req, res, '/api/status');
}
