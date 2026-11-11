import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleApiRequest } from '../src/server/core.ts';

/**
 * Robust Vercel Serverless Function Adapter
 * Converts incoming Vercel / Node.js HTTP request to standard Web Request,
 * delegates to handleApiRequest, and sends back the Web Response with solid
 * JSON parsing, CORS headers, and media streaming.
 */
export async function vercelHandler(
  req: VercelRequest,
  res: VercelResponse,
  explicitPath?: string
): Promise<void> {
  const startTime = Date.now();

  try {
    const protocol = (req.headers['x-forwarded-proto'] as string) || 'https';
    const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost';

    // Determine the exact request path
    let requestPath = '';
    if (explicitPath) {
      const queryStr = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
      requestPath = explicitPath + queryStr;
    } else if (req.query && req.query.route) {
      // Vercel dynamic catch-all route e.g. api/[...route]
      const routeParam = Array.isArray(req.query.route)
        ? req.query.route.join('/')
        : String(req.query.route);
      const queryStr = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
      requestPath = `/api/${routeParam}${queryStr}`;
    } else {
      requestPath = req.url || '/api/status';
      if (!requestPath.startsWith('/api') && !requestPath.startsWith('/')) {
        requestPath = '/' + requestPath;
      }
      if (!requestPath.startsWith('/api')) {
        requestPath = '/api' + requestPath;
      }
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

    // Process request payload safely
    let body: any = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body) {
        if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
          body = req.body;
        } else if (typeof req.body === 'object') {
          body = JSON.stringify(req.body);
          if (!headers.has('content-type')) {
            headers.set('content-type', 'application/json');
          }
        }
      } else if (!req.readableEnded && !req.destroyed) {
        // Read raw stream if unparsed
        const chunks: Buffer[] = [];
        try {
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          }
          if (chunks.length > 0) {
            body = Buffer.concat(chunks);
          }
        } catch {
          // Stream read failed or empty
        }
      }

      // If body is still empty for POST/PUT, provide empty JSON object
      if (!body) {
        body = JSON.stringify({});
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/json');
        }
      }
    }

    const webRequest = new Request(fullUrl, {
      method: req.method || 'GET',
      headers,
      body,
    });

    console.log(`[Vercel Serverless] ${req.method} -> ${fullUrl}`);

    // Call the core API handler with current environment variables
    const webResponse = await handleApiRequest(webRequest, process.env);

    // Set HTTP status code
    res.statusCode = webResponse.status;

    // Apply CORS headers to all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Transfer response headers from Web standard response
    webResponse.headers.forEach((val, key) => {
      if (!key.toLowerCase().startsWith('access-control-')) {
        res.setHeader(key, val);
      }
    });

    if (!webResponse.body) {
      res.end();
      return;
    }

    const contentType = webResponse.headers.get('content-type') || '';

    // For JSON and text responses, buffer completely to ensure full delivery
    // and avoid chunked transfer parsing issues on Vercel
    if (contentType.includes('application/json') || contentType.includes('text/')) {
      const text = await webResponse.text();
      res.end(text);
      const duration = Date.now() - startTime;
      console.log(`[Vercel Serverless] Completed ${req.method} ${requestPath} -> ${webResponse.status} in ${duration}ms`);
      return;
    }

    // For binary media streaming (MP4, MP3, JPEG proxy downloads)
    const reader = webResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();

    const duration = Date.now() - startTime;
    console.log(`[Vercel Serverless Stream] Completed ${req.method} ${requestPath} -> ${webResponse.status} in ${duration}ms`);
  } catch (error: any) {
    console.error('[Vercel Serverless Fatal Error]:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
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
