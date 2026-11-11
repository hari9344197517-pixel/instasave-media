import { handleApiRequest } from "../src/server/core.ts";
async function vercelHandler(req, res, explicitPath) {
  const startTime = Date.now();
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    let requestPath = "";
    if (explicitPath) {
      const queryStr = req.url && req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
      requestPath = explicitPath + queryStr;
    } else if (req.query && req.query.route) {
      const routeParam = Array.isArray(req.query.route) ? req.query.route.join("/") : String(req.query.route);
      const queryStr = req.url && req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
      requestPath = `/api/${routeParam}${queryStr}`;
    } else {
      requestPath = req.url || "/api/status";
      if (!requestPath.startsWith("/api") && !requestPath.startsWith("/")) {
        requestPath = "/" + requestPath;
      }
      if (!requestPath.startsWith("/api")) {
        requestPath = "/api" + requestPath;
      }
    }
    const fullUrl = `${protocol}://${host}${requestPath}`;
    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (val !== void 0 && val !== null) {
        if (Array.isArray(val)) {
          val.forEach((item) => headers.append(key, item));
        } else {
          headers.set(key, String(val));
        }
      }
    }
    let body = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      if (req.body) {
        if (typeof req.body === "string" || Buffer.isBuffer(req.body)) {
          body = req.body;
        } else if (typeof req.body === "object") {
          body = JSON.stringify(req.body);
          if (!headers.has("content-type")) {
            headers.set("content-type", "application/json");
          }
        }
      } else if (!req.readableEnded && !req.destroyed) {
        const chunks = [];
        try {
          for await (const chunk of req) {
            chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
          }
          if (chunks.length > 0) {
            body = Buffer.concat(chunks);
          }
        } catch {
        }
      }
      if (!body) {
        body = JSON.stringify({});
        if (!headers.has("content-type")) {
          headers.set("content-type", "application/json");
        }
      }
    }
    const webRequest = new Request(fullUrl, {
      method: req.method || "GET",
      headers,
      body
    });
    console.log(`[Vercel Serverless] ${req.method} -> ${fullUrl}`);
    const webResponse = await handleApiRequest(webRequest, process.env);
    res.statusCode = webResponse.status;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    webResponse.headers.forEach((val, key) => {
      if (!key.toLowerCase().startsWith("access-control-")) {
        res.setHeader(key, val);
      }
    });
    if (!webResponse.body) {
      res.end();
      return;
    }
    const contentType = webResponse.headers.get("content-type") || "";
    if (contentType.includes("application/json") || contentType.includes("text/")) {
      const text = await webResponse.text();
      res.end(text);
      const duration2 = Date.now() - startTime;
      console.log(`[Vercel Serverless] Completed ${req.method} ${requestPath} -> ${webResponse.status} in ${duration2}ms`);
      return;
    }
    const reader = webResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
    const duration = Date.now() - startTime;
    console.log(`[Vercel Serverless Stream] Completed ${req.method} ${requestPath} -> ${webResponse.status} in ${duration}ms`);
  } catch (error) {
    console.error("[Vercel Serverless Fatal Error]:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(
        JSON.stringify({
          success: false,
          error: "SERVERLESS_EXECUTION_ERROR",
          message: error?.message || "An unexpected error occurred in Vercel serverless function."
        })
      );
    }
  }
}
export {
  vercelHandler
};
