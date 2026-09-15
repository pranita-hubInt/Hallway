import { proxyToCrm } from '../../../../lib/crmShowcaseProxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type RouteContext = { params: Promise<{ path?: string[] }> };

async function handle(request: Request, context: RouteContext) {
  try {
    const params = await context?.params;
    const path = Array.isArray(params?.path) ? params.path : [];
    return await proxyToCrm(request, path);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Hub CRM is not reachable at https://hows.hubinterior.com.';
    return Response.json({ error: message }, { status: 503 });
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
