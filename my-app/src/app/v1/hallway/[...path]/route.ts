import { proxyToCrm } from '../../../../lib/crmShowcaseProxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type RouteContext = { params: Promise<{ path?: string[] }> };

async function handle(request: Request, context: RouteContext) {
  const params = await context?.params;
  const rest = Array.isArray(params?.path) ? params.path : [];
  return proxyToCrm(request, ['v1', 'hallway', ...rest]);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
