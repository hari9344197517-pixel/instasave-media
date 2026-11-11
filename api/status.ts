import type { VercelRequest, VercelResponse } from '@vercel/node';
import { vercelHandler } from './_adapter';

/**
 * Dedicated Vercel Serverless Function: GET /api/status
 * Health check and configuration status.
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return vercelHandler(req, res, '/api/status');
}
