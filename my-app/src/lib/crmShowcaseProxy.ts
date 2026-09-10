const DEFAULT_CRM = 'http://127.0.0.1:8081';
const UPSTREAM_MS = 60_000;
const LOGIN_MS = 8_000;

const CRM_BASE = (
  process.env.CRM_API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_CRM_API_URL ||
  DEFAULT_CRM
)
  .replace(/\/$/, '')
  .replace('://localhost', '://127.0.0.1');

let cachedToken: string | null = null;
let tokenInflight: Promise<string> | null = null;
type UpstreamPayload = { status: number; contentType: string | null; body: ArrayBuffer };
const getInflight = new Map<string, Promise<UpstreamPayload>>();

function showcaseToken() {
  const userId = (process.env.CRM_SHOWCASE_USER_ID || '1').trim() || '1';
  return `token_${userId}_${Date.now()}`;
}

function crmCredentials() {
  const username = process.env.CRM_USERNAME || process.env.HUB_CRM_USERNAME;
  const password = process.env.CRM_PASSWORD || process.env.HUB_CRM_PASSWORD;
  if (username && password) return { username, password };
  return { username: 'admin', password: 'admin123' };
}

function describeUpstreamError(err: unknown): string {
  const asError = err instanceof Error ? err : null;
  const cause = asError?.cause as { code?: string; message?: string } | undefined;
  const raw = [asError?.message, cause?.code, cause?.message].filter(Boolean).join(' ');
  if (/ECONNREFUSED|ENOTFOUND|EHOSTUNREACH|ECONNRESET|UND_ERR|fetch failed/i.test(raw)) {
    return `Hub CRM is not reachable at ${CRM_BASE}. Start Project-ERP on port 8081, or set CRM_API_PROXY_TARGET in my-app/.env.local.`;
  }
  if (/abort|timeout/i.test(raw)) {
    return `Hub CRM timed out at ${CRM_BASE}. Retry — leaderboard can take ~30s on a cold start.`;
  }
  return asError?.message || 'Hub CRM request failed.';
}

async function loginWith(username: string, password: string): Promise<string | null> {
  const res = await fetch(`${CRM_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    cache: 'no-store',
    signal: AbortSignal.timeout(LOGIN_MS),
  });
  const data = (await res.json().catch(() => ({}))) as { token?: string };
  return data.token || null;
}

async function loginToHub(): Promise<string> {
  try {
    const creds = crmCredentials();
    const token = await loginWith(creds.username, creds.password);
    if (token) return token;
  } catch {
    // Hub may be down or the local admin account may not exist.
  }
  return showcaseToken();
}

export async function getShowcaseCrmToken(force = false): Promise<string> {
  if (!force && cachedToken) return cachedToken;
  if (!force && tokenInflight) return tokenInflight;
  tokenInflight = loginToHub()
    .then((token) => {
      cachedToken = token;
      return token;
    })
    .finally(() => {
      tokenInflight = null;
    });
  return tokenInflight;
}

async function fetchOnce(
  target: string,
  token: string,
  method: string,
  body?: ArrayBuffer
): Promise<Response> {
  const headers = new Headers();
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);
  const hasBody = method !== 'GET' && method !== 'HEAD' && body;
  if (hasBody) headers.set('Content-Type', 'application/json');

  return fetch(target, {
    method,
    headers,
    body: hasBody ? body : undefined,
    cache: 'no-store',
    redirect: 'manual',
    signal: AbortSignal.timeout(UPSTREAM_MS),
  });
}

async function fetchUpstream(
  target: string,
  token: string,
  method: string,
  body?: ArrayBuffer
): Promise<Response> {
  let res: Response;
  try {
    res = await fetchOnce(target, token, method, body);
  } catch (err) {
    throw new Error(describeUpstreamError(err));
  }
  if (res.status < 500) return res;
  await new Promise((resolve) => setTimeout(resolve, 400));
  try {
    return await fetchOnce(target, token, method, body);
  } catch (err) {
    throw new Error(describeUpstreamError(err));
  }
}

function toResponse(status: number, contentType: string | null, body: ArrayBuffer): Response {
  const headers = new Headers();
  if (contentType) headers.set('Content-Type', contentType);
  return new Response(body.slice(0), { status, headers });
}

function hubErrorMessage(body: ArrayBuffer): string {
  const text = new TextDecoder().decode(body);
  if (/no static resource/i.test(text)) {
    return `Hub CRM at ${CRM_BASE} does not have Hallway APIs loaded. Restart Project-ERP from the latest source so GET /v1/hallway/leaderboard exists.`;
  }
  try {
    const parsed = JSON.parse(text) as { error?: string; message?: string };
    if (parsed.error || parsed.message) return parsed.error || parsed.message || text;
  } catch {
    // Hub sometimes returns an HTML error page.
  }
  if (text.trim()) return text.slice(0, 300);
  return `Hub CRM failed this request at ${CRM_BASE}. Confirm Project-ERP is running and includes the Hallway showcase APIs.`;
}

function isMissingHallwayApi(status: number, body: ArrayBuffer): boolean {
  if (status !== 404 && status !== 500) return false;
  const text = new TextDecoder().decode(body);
  return /no static resource|whitelabel error/i.test(text);
}

function candidateTargets(path: string, search: string): string[] {
  if (path.startsWith('v1/hallway/') || path.startsWith('api/hallway/')) {
    const rest = path.replace(/^v1\/hallway\//, '').replace(/^api\/hallway\//, '');
    return [
      `${CRM_BASE}/v1/hallway/${rest}${search}`,
      `${CRM_BASE}/api/hallway/${rest}${search}`,
      `${CRM_BASE}/api/v1/hallway/${rest}${search}`,
    ];
  }
  return [`${CRM_BASE}/${path}${search}`];
}

function coalesceGet(key: string, load: () => Promise<UpstreamPayload>): Promise<UpstreamPayload> {
  let pending = getInflight.get(key);
  if (!pending) {
    pending = load().finally(() => {
      getInflight.delete(key);
    });
    getInflight.set(key, pending);
  }
  return pending;
}

async function fetchWithFallback(
  path: string,
  search: string,
  method: string,
  body?: ArrayBuffer
): Promise<UpstreamPayload> {
  const targets = candidateTargets(path, search);
  let last: UpstreamPayload | null = null;

  for (const target of targets) {
    let token = await getShowcaseCrmToken();
    let res = await fetchUpstream(target, token, method, body);
    if (res.status === 401) {
      token = await getShowcaseCrmToken(true);
      res = await fetchUpstream(target, token, method, body);
    }
    const buf = await res.arrayBuffer();
    last = {
      status: res.status,
      contentType: res.headers.get('Content-Type'),
      body: buf,
    };
    if (!isMissingHallwayApi(last.status, last.body)) return last;
  }

  return last as UpstreamPayload;
}

export async function proxyToCrm(request: Request, pathParts: string[]): Promise<Response> {
  const path = pathParts.join('/');
  const incoming = new URL(request.url);
  const method = request.method.toUpperCase();
  const hasBody = method !== 'GET' && method !== 'HEAD';
  const body = hasBody ? await request.clone().arrayBuffer() : undefined;
  const key = `${method}:${path}${incoming.search}`;

  try {
    const out =
      method === 'GET'
        ? await coalesceGet(key, () => fetchWithFallback(path, incoming.search, method, body))
        : await fetchWithFallback(path, incoming.search, method, body);
    if (out.status >= 500 || isMissingHallwayApi(out.status, out.body)) {
      return Response.json({ error: hubErrorMessage(out.body) }, { status: 503 });
    }
    return toResponse(out.status, out.contentType, out.body);
  } catch (err) {
    return Response.json({ error: describeUpstreamError(err) }, { status: 503 });
  }
}

export { CRM_BASE };
