/**
 * Cloudflare Pages Functions Catch-All Route: /api/*
 * Automatically executed by Cloudflare Workers at the edge on your free *.pages.dev domain.
 */
import { handleApiRequest } from '../../src/server/core';

// Cloudflare Pages Function context type
interface EventContext<Env, P extends string, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
}

export async function onRequest(context: EventContext<any, any, any>): Promise<Response> {
  return handleApiRequest(context.request, context.env);
}
