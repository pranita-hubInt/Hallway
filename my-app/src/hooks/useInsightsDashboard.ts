'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CrmApiError,
  fetchInsightsDashboard,
  fetchInsightsFilterOptions,
} from '../lib/crmApi';
import type {
  InsightsDashboard,
  InsightsFilterOptions,
  InsightsFilterParams,
} from '../types/crmInsights';

export function useInsightsDashboard(
  filters: InsightsFilterParams,
  token: string | null,
  enabled: boolean
) {
  const [dashboard, setDashboard] = useState<InsightsDashboard | null>(null);
  const [options, setOptions] = useState<InsightsFilterOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [error, setError] = useState<CrmApiError | Error | null>(null);

  const loadOptions = useCallback(async () => {
    if (!enabled) return;
    setOptionsLoading(true);
    try {
      const data = await fetchInsightsFilterOptions(filters.branchId, token);
      setOptions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load filter options'));
    } finally {
      setOptionsLoading(false);
    }
  }, [enabled, filters.branchId, token]);

  const loadDashboard = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInsightsDashboard(filters, token);
      setDashboard(data);
    } catch (err) {
      setDashboard(null);
      setError(err instanceof Error ? err : new Error('Failed to load insights'));
    } finally {
      setLoading(false);
    }
  }, [enabled, filters, token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOptions();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadOptions]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  return {
    dashboard,
    options,
    loading,
    optionsLoading,
    error,
    reload: loadDashboard,
  };
}
