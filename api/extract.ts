import type { VercelRequest, VercelResponse } from '@vercel/node';
import { vercelHandler } from './_adapter.ts';

/**
 * Dedicated Vercel Serverless Function: POST /api/extract
 * Extracts Instagram media metadata and direct URLs.
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return vercelHandler(req, res, '/api/extract');
}
