import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleApiRequest } from '../src/server/core';

/**
 * Vercel Serverless Function Adapter
 * Converts incoming Vercel / Node.js HTTP request to Web Standard Request,
 * delegates to handleApiRequest, and streams back the Web Response.
 */
export async function vercelHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const startTime = Date.now();

  try {
    const protocol = (req.headers['x-forwarded-proto'] as string) || 'https';
    const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost';
    
    // Ensure clean pathname preserving query parameters
    let requestPath = req.url || '/api/status';
    if (!requestPath.startsWith('/api') && !requestPath.startsWith('/')) {
      requestPath = '/' + requestPath;
    }
    if (!requestPath.startsWith('/api')) {
      requestPath = '/api' + requestPath;
    }

    const fullUrl = `${protocol}://${host}${requestPath}`;

    // Convert incoming headers to Web Standards Headers
    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (val !== undefined && val !== null) {
        if (Array.isArray(val)) {
          val.forEach((item) => headers.append(key, item));
        } else {
          headers.set(key, String(val));
        }
      }
    }

    // Process request payload
    let body: any = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
        body = req.body;
      } else if (req.body && typeof req.body === 'object') {
        body = JSON.stringify(req.body);
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/json');
        }
      } else {
        // Read raw stream if unparsed
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        if (chunks.length > 0) {
          body = Buffer.concat(chunks);
        }
      }
    }

    const webRequest = new Request(fullUrl, {
      method: req.method || 'GET',
      headers,
      body,
    });

    console.log(`[Vercel Serverless] ${req.method} ${fullUrl}`);

    // Call the core API handler with current environment variables
    const webResponse = await handleApiRequest(webRequest, process.env);

    // Set response status & headers
    res.statusCode = webResponse.status;
    webResponse.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    if (!webResponse.body) {
      res.end();
      return;
    }

    // Stream response chunks (e.g. for proxy downloads or large responses)
    const reader = webResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();

    const duration = Date.now() - startTime;
    console.log(`[Vercel Serverless] Completed ${req.method} ${requestPath} -> ${webResponse.status} in ${duration}ms`);
  } catch (error: any) {
    console.error('[Vercel Serverless Error]:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          error: 'SERVERLESS_EXECUTION_ERROR',
          message: error?.message || 'An unexpected error occurred in Vercel serverless function.',
        })
      );
    }
  }
}
