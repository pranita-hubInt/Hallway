const DESIGN_HANDOFF_KEY = 'hallway-design-handoff';

export function crmDashboardUrl() {
  return (process.env.NEXT_PUBLIC_CRM_DASHBOARD_URL || 'https://hows.hubinterior.com').replace(/\/$/, '');
}

export function designDashboardUrl() {
  return (
    process.env.NEXT_PUBLIC_DESIGN_MODULE_FRONTEND_URL || 'https://design.hubinterior.com'
  ).replace(/\/$/, '');
}

export function saveDesignHandoff(user: unknown, sessionId: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DESIGN_HANDOFF_KEY, JSON.stringify({ user, sessionId }));
}

export function clearDesignHandoff() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DESIGN_HANDOFF_KEY);
}

export function openCrmDashboard() {
  window.location.href = crmDashboardUrl();
}

export function openDesignDashboard() {
  const base = designDashboardUrl();
  try {
    const raw = window.localStorage.getItem(DESIGN_HANDOFF_KEY);
    if (raw) {
      const data = JSON.parse(raw) as { user?: unknown; sessionId?: string };
      if (data?.sessionId && data?.user) {
        const payload = encodeURIComponent(JSON.stringify(data));
        window.location.href = `${base}/auth/accept#payload=${payload}`;
        return;
      }
    }
  } catch {
    // Fall through to the public Design Module URL.
  }
  window.location.href = base;
}
