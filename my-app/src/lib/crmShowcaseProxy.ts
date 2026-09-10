const CRM_BASE = (
  process.env.CRM_API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_CRM_API_URL ||
  'http://localhost:8081'
).replace(/\/$/, '');

let cachedToken: string | null = null;
let inflight: Promise<string> | null = null;

function showcaseToken() {
  const userId = (process.env.CRM_SHOWCASE_USER_ID || '1').trim() || '1';
  return `token_${userId}_${Date.now()}`;
}

function crmCredentials() {
  const username = process.env.CRM_USERNAME || process.env.HUB_CRM_USERNAME;
  const password = process.env.CRM_PASSWORD || process.env.HUB_CRM_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

async function loginToHub(): Promise<string> {
  const creds = crmCredentials();
  if (!creds) return showcaseToken();

  const res = await fetch(`${CRM_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  });
  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    token?: string;
    message?: string;
  };
  if (!res.ok || !data.token) {
    return showcaseToken();
  }
  return data.token;
}

export async function getShowcaseCrmToken(force = false): Promise<string> {
  if (!force && cachedToken) return cachedToken;
  if (!force && inflight) return inflight;
  inflight = loginToHub()
    .then((token) => {
      cachedToken = token;
      return token;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function proxyToCrm(request: Request, pathParts: string[]): Promise<Response> {
  const path = pathParts.join('/');
  const incoming = new URL(request.url);
  const target = `${CRM_BASE}/${path}${incoming.search}`;

  const forward = async (token: string) => {
    const headers = new Headers();
    headers.set('Accept', request.headers.get('Accept') || 'application/json');
    const contentType = request.headers.get('Content-Type');
    if (contentType) headers.set('Content-Type', contentType);
    headers.set('Authorization', `Bearer ${token}`);

    const method = request.method.toUpperCase();
    const hasBody = method !== 'GET' && method !== 'HEAD';
    return fetch(target, {
      method,
      headers,
      body: hasBody ? await request.clone().arrayBuffer() : undefined,
    });
  };

  try {
    let token = await getShowcaseCrmToken();
    let res = await forward(token);
    if (res.status === 401) {
      token = await getShowcaseCrmToken(true);
      res = await forward(token);
    }

    const body = await res.arrayBuffer();
    const out = new Headers();
    const pass = res.headers.get('Content-Type');
    if (pass) out.set('Content-Type', pass);
    return new Response(body, { status: res.status, headers: out });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Hub CRM is unreachable. Confirm Project-ERP is running on http://localhost:8081.';
    return Response.json({ error: message }, { status: 503 });
  }
}

export { CRM_BASE };
