import type { VercelRequest, VercelResponse } from '@vercel/node';
import { vercelHandler } from './adapter.js';

/**
 * Vercel Serverless Catch-All API Route: /api/[...route]
 * Handles all dynamic API requests including:
 * - POST /api/extract
 * - GET  /api/download/proxy
 * - GET  /api/sample-urls
 * - GET  /api/status
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return vercelHandler(req, res);
}
