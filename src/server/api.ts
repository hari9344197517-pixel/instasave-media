import express from 'express';
import type { Request as ExRequest, Response as ExResponse } from 'express';
import { handleApiRequest } from './core.ts';

export const apiRouter = express.Router();
export const apiApp = express();

apiApp.use(express.json());
apiApp.use('/api', apiRouter);

// Adapter: Forwards local Express development requests to the Cloudflare-native core handler
apiRouter.all('*', async (req: ExRequest, res: ExResponse) => {
  try {
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:3000';
    const fullUrl = `${protocol}://${host}${req.baseUrl}${req.url}`;

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (val) {
        if (Array.isArray(val)) {
          val.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, val);
        }
      }
    }

    let body: any = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
      if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json');
      }
    }

    const webRequest = new Request(fullUrl, {
      method: req.method,
      headers,
      body,
    });

    const webResponse = await handleApiRequest(webRequest);

    res.status(webResponse.status);
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (!webResponse.body) {
      return res.end();
    }

    const reader = webResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
    }
  }
});
