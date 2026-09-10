import type {
  CrmApiErrorBody,
  CrmLoginResponse,
  InsightsDashboard,
  InsightsFilterOptions,
  InsightsFilterParams,
} from '../types/crmInsights';
import type {
  HallwayActionsResponse,
  HallwayFeedParams,
  HallwayFeedResponse,
  HallwayLeaderboardParams,
  HallwayLeaderboardResponse,
  HallwayLeadsParams,
  HallwayLeadsResponse,
  HallwayMilestoneCountsResponse,
  HallwayPeopleParams,
  HallwayPeopleResponse,
  HallwayRecordsResponse,
  HallwayTargetsParams,
  HallwayTargetsResponse,
  HallwayTodayEventsResponse,
} from '../types/hallway';

const TOKEN_KEY = 'hallway-crm-token';
const USER_KEY = 'hallway-crm-user';

export class CrmApiError extends Error {
  status: number;
  body: CrmApiErrorBody | null;

  constructor(status: number, message: string, body: CrmApiErrorBody | null = null) {
    super(message);
    this.name = 'CrmApiError';
    this.status = status;
    this.body = body;
  }
}

export function getCrmBaseUrl(): string {
  return '/api/crm';
}

export function getStoredCrmToken(): string | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(TOKEN_KEY);
  if (stored?.trim()) return stored.trim();
  const fromEnv = process.env.NEXT_PUBLIC_CRM_TOKEN?.trim();
  return fromEnv || null;
}

export function getStoredCrmUser(): CrmLoginResponse['user'] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CrmLoginResponse['user'];
  } catch {
    return null;
  }
}

export function setCrmSession(token: string, user?: CrmLoginResponse['user'] | null) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event('hallway-crm-session'));
}

export function clearCrmSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('hallway-crm-session'));
}

export function getAuthHeaders(_token?: string | null): HeadersInit {
  return { Accept: 'application/json' };
}

function sharedQuery(params: InsightsFilterParams, extras?: Record<string, string>): string {
  const search = new URLSearchParams();
  search.set('dateRange', params.dateRange);
  if (params.dateRange === 'custom') {
    if (params.dateFrom) search.set('dateFrom', params.dateFrom);
    if (params.dateTo) search.set('dateTo', params.dateTo);
  }
  if (params.branchId && params.branchId !== 'all') {
    search.set('branchId', params.branchId);
  }
  if (params.salesManagerId != null) {
    search.set('salesManagerId', String(params.salesManagerId));
  }
  if (params.salesExecutiveId != null) {
    search.set('salesExecutiveId', String(params.salesExecutiveId));
  }
  if (extras) {
    for (const [key, value] of Object.entries(extras)) {
      search.set(key, value);
    }
  }
  return search.toString();
}

function toQuery(params: InsightsFilterParams): string {
  return sharedQuery(params, {
    teamPeriod: params.teamPeriod,
    funnelMode: params.funnelMode,
    pathFilter: params.pathFilter,
  });
}

function errorMessage(body: CrmApiErrorBody | null, fallback: string): string {
  return body?.error || body?.message || fallback;
}

async function parseBody(res: Response): Promise<CrmApiErrorBody | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as CrmApiErrorBody;
  } catch {
    return { error: text };
  }
}

function isAbortError(err: unknown): boolean {
  return (
    (err instanceof DOMException && err.name === 'AbortError') ||
    (err instanceof Error && err.name === 'AbortError')
  );
}

async function crmFetch<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null
): Promise<T> {
  const url = `${getCrmBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        ...getAuthHeaders(token),
        ...(init.headers || {}),
      },
    });
  } catch (err) {
    if (isAbortError(err)) throw err;
    throw new CrmApiError(
      503,
      'Hub CRM is unreachable. Confirm Project-ERP is running on http://localhost:8081.',
      null
    );
  }

  const body = await parseBody(res);

  if (res.status === 401) {
    throw new CrmApiError(401, errorMessage(body, 'CRM authorization failed'), body);
  }
  if (res.status === 403) {
    throw new CrmApiError(403, errorMessage(body, 'Forbidden'), body);
  }
  if (res.status === 501) {
    throw new CrmApiError(501, errorMessage(body, 'Passages funnel is unavailable'), body);
  }
  if (res.status === 400) {
    throw new CrmApiError(400, errorMessage(body, 'Bad request'), body);
  }
  if (res.status >= 500) {
    throw new CrmApiError(
      503,
      errorMessage(
        body,
        'Hub CRM failed this request. Confirm Project-ERP is running on http://localhost:8081 and retry.'
      ),
      body
    );
  }
  if (!res.ok) {
    throw new CrmApiError(res.status, errorMessage(body, `CRM request failed (${res.status})`), body);
  }

  return (body ?? {}) as T;
}

export async function loginToCrm(username: string, password: string): Promise<CrmLoginResponse> {
  const data = await crmFetch<CrmLoginResponse>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!data.success || !data.token) {
    throw new CrmApiError(400, data.message || 'Login failed', { message: data.message });
  }
  setCrmSession(data.token, data.user);
  return data;
}

export async function fetchInsightsFilterOptions(
  branchId?: string,
  token?: string | null,
  signal?: AbortSignal
): Promise<InsightsFilterOptions> {
  const qs = branchId && branchId !== 'all' ? `?branchId=${encodeURIComponent(branchId)}` : '';
  return crmFetch<InsightsFilterOptions>(
    `/v1/crm/insights/filter-options${qs}`,
    { signal },
    token
  );
}

export async function fetchInsightsDashboard(
  params: InsightsFilterParams,
  token?: string | null
): Promise<InsightsDashboard> {
  return crmFetch<InsightsDashboard>(`/v1/crm/insights/dashboard?${toQuery(params)}`, {}, token);
}

export async function fetchPerformanceCards(
  params: InsightsFilterParams,
  token?: string | null
): Promise<Pick<InsightsDashboard, 'filtersApplied' | 'performanceCards'>> {
  return crmFetch(`/v1/crm/insights/performance-cards?${sharedQuery(params)}`, {}, token);
}

export async function fetchSalesFunnel(
  params: InsightsFilterParams,
  token?: string | null
): Promise<Pick<InsightsDashboard, 'filtersApplied' | 'salesFunnel' | 'funnelMeta'>> {
  return crmFetch(
    `/v1/crm/insights/sales-funnel?${sharedQuery(params, {
      funnelMode: params.funnelMode,
      pathFilter: params.pathFilter,
    })}`,
    {},
    token
  );
}

export async function fetchQuotesSentMonth(
  params: InsightsFilterParams,
  token?: string | null
) {
  return crmFetch<Record<string, unknown>>(
    `/v1/crm/insights/quotes-sent-month?${sharedQuery(params)}`,
    {},
    token
  );
}

export async function fetchPassagesTrend(
  params: InsightsFilterParams,
  granularity: 'month' | 'week' = 'month',
  token?: string | null
) {
  return crmFetch<Record<string, unknown>>(
    `/v1/crm/insights/passages-trend?${sharedQuery(params, { granularity })}`,
    {},
    token
  );
}

export async function fetchSalesTargetsDefault(token?: string | null) {
  return crmFetch<Record<string, unknown>>('/v1/crm/incentives/sales-targets/default', {}, token);
}

export async function fetchSalesTargets(
  yearMonth: string,
  branchId?: string,
  token?: string | null
) {
  const qs = new URLSearchParams({ yearMonth });
  if (branchId) qs.set('branchId', branchId);
  return crmFetch<Record<string, unknown>>(
    `/v1/crm/incentives/sales-targets?${qs.toString()}`,
    {},
    token
  );
}

function hallwayQuery(
  params?: Record<string, string | number | undefined | null>
): string {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value == null || value === '') continue;
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchLeaderboard(
  token: string,
  params: HallwayLeaderboardParams = {},
  signal?: AbortSignal
): Promise<HallwayLeaderboardResponse> {
  return crmFetch(
    `/v1/hallway/leaderboard${hallwayQuery({
      period: params.period ?? 'mtd',
      branchId: params.branchId,
      salesManagerId: params.salesManagerId,
    })}`,
    { signal },
    token
  );
}

export async function fetchPeople(
  token: string,
  params: HallwayPeopleParams = {},
  signal?: AbortSignal
): Promise<HallwayPeopleResponse> {
  return crmFetch(
    `/v1/hallway/people${hallwayQuery({
      branchId: params.branchId,
      role: params.role,
    })}`,
    { signal },
    token
  );
}

export async function fetchRecords(
  token: string,
  branchId?: string,
  signal?: AbortSignal
): Promise<HallwayRecordsResponse> {
  return crmFetch(`/v1/hallway/records${hallwayQuery({ branchId })}`, { signal }, token);
}

export async function fetchHallwayLeads(
  token: string,
  params: HallwayLeadsParams = {},
  signal?: AbortSignal
): Promise<HallwayLeadsResponse> {
  return crmFetch(
    `/v1/hallway/leads${hallwayQuery({
      page: params.page ?? 0,
      size: params.size ?? 20,
      branchId: params.branchId,
      salesManagerId: params.salesManagerId,
      salesExecutiveId: params.salesExecutiveId,
    })}`,
    { signal },
    token
  );
}

export async function fetchMilestoneCounts(
  token: string,
  params: Record<string, string> = {},
  signal?: AbortSignal
): Promise<HallwayMilestoneCountsResponse> {
  return crmFetch(
    `/v1/Leads/crm-milestone-counts-filtered${hallwayQuery(params)}`,
    { signal },
    token
  );
}

export async function fetchTargets(
  token: string,
  params: HallwayTargetsParams = {},
  signal?: AbortSignal
): Promise<HallwayTargetsResponse> {
  return crmFetch(
    `/v1/hallway/targets${hallwayQuery({
      branchId: params.branchId,
      salesManagerId: params.salesManagerId,
      salesExecutiveId: params.salesExecutiveId,
    })}`,
    { signal },
    token
  );
}

export async function fetchTodayEvents(
  token: string,
  signal?: AbortSignal
): Promise<HallwayTodayEventsResponse> {
  return crmFetch('/v1/hallway/today-events', { signal }, token);
}

export async function fetchActions(
  token: string,
  branchId?: string,
  signal?: AbortSignal
): Promise<HallwayActionsResponse> {
  return crmFetch(`/v1/hallway/actions${hallwayQuery({ branchId })}`, { signal }, token);
}

export async function fetchFeed(
  token: string,
  params: HallwayFeedParams = {},
  signal?: AbortSignal
): Promise<HallwayFeedResponse> {
  return crmFetch(
    `/v1/hallway/feed${hallwayQuery({
      branchId: params.branchId,
      limit: params.limit ?? 20,
    })}`,
    { signal },
    token
  );
}

export { toQuery as insightsQueryString };
