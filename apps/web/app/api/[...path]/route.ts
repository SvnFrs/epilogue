/**
 * BFF proxy (eng-review T9). The browser talks to this same-origin endpoint; it injects
 * the owner header + secret server-side and forwards to the Elysia API. This is how the
 * client-side TanStack Query mutations reach the API WITHOUT ever holding the secret.
 */
import { type NextRequest, NextResponse } from 'next/server';
import { serverConfig, ownerHeaders } from '@/lib/api/config';

export const dynamic = 'force-dynamic';

async function forward(req: NextRequest, path: string[]) {
  const search = req.nextUrl.search;
  const target = `${serverConfig.apiUrl}/${path.join('/')}${search}`;

  const headers: Record<string, string> = { ...ownerHeaders() };
  const contentType = req.headers.get('content-type');
  if (contentType) headers['content-type'] = contentType;

  const init: RequestInit = { method: req.method, headers };
  if (!['GET', 'HEAD'].includes(req.method)) {
    init.body = await req.text();
  }

  const res = await fetch(target, init);
  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
