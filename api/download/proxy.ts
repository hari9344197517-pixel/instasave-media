import type { VercelRequest, VercelResponse } from '@vercel/node';
import { vercelHandler } from '../adapter.js';

/**
 * Dedicated Vercel Serverless Function: GET /api/download/proxy
 * Streams media attachments (MP4/MP3/JPG) directly from verified Instagram CDN sources.
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return vercelHandler(req, res, '/api/download/proxy');
}
