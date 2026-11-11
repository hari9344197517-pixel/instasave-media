import type { VercelRequest, VercelResponse } from '@vercel/node';
import { vercelHandler } from './adapter.js';

/**
 * Dedicated Vercel Serverless Function: GET /api/sample-urls
 * Returns safe example Instagram URLs for quick UI testing.
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return vercelHandler(req, res, '/api/sample-urls');
}
