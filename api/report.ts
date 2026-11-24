import type { VercelRequest, VercelResponse } from '@vercel/node';
import { vercelHandler } from './adapter.js';

/**
 * Dedicated Vercel Serverless Function: POST /api/report
 * Validates DMCA / copyright removal and support requests.
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return vercelHandler(req, res, '/api/report');
}
