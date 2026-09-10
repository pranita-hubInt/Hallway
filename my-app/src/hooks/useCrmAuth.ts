'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  clearCrmSession,
  getStoredCrmToken,
  getStoredCrmUser,
  loginToCrm,
  setCrmSession,
} from '../lib/crmApi';
import type { CrmInsightsRole, CrmLoginUser } from '../types/crmInsights';

const ADMIN_ROLES: CrmInsightsRole[] = ['SUPER_ADMIN', 'ADMIN', 'SALES_ADMIN'];

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener('hallway-crm-session', onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    window.removeEventListener('hallway-crm-session', onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

export function useCrmAuth() {
  const token = useSyncExternalStore(subscribe, getStoredCrmToken, () => null);
  const userJson = useSyncExternalStore(
    subscribe,
    () => {
      const user = getStoredCrmUser();
      return user ? JSON.stringify(user) : null;
    },
    () => null
  );
  const user = useMemo<CrmLoginUser | null>(
    () => (userJson ? (JSON.parse(userJson) as CrmLoginUser) : null),
    [userJson]
  );

  const connect = useCallback(async (username: string, password: string) => {
    return loginToCrm(username, password);
  }, []);

  const connectWithToken = useCallback((rawToken: string) => {
    const trimmed = rawToken.trim();
    if (!trimmed) return;
    setCrmSession(trimmed, getStoredCrmUser());
  }, []);

  const disconnect = useCallback(() => {
    clearCrmSession();
  }, []);

  const role = (user?.role || '').toUpperCase() as CrmInsightsRole | '';
  const isAdmin = ADMIN_ROLES.includes(role as CrmInsightsRole);
  const isManager = role === 'SALES_MANAGER';
  const isExecutive = role === 'SALES_EXECUTIVE';

  return {
    token,
    user,
    ready: true,
    connect,
    connectWithToken,
    disconnect,
    isAdmin,
    isManager,
    isExecutive,
    role,
  };
}
