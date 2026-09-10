'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type {
  DateRangeKey,
  FunnelMode,
  InsightsFilterParams,
  PathFilter,
  TeamPeriod,
} from '../types/crmInsights';

const DATE_RANGES: DateRangeKey[] = [
  'all',
  'current_month',
  '3m',
  '6m',
  '1y',
  'previous_month',
  'custom',
];

const TEAM_PERIODS: TeamPeriod[] = ['monthly', 'daily'];
const FUNNEL_MODES: FunnelMode[] = [
  'inventory',
  'current',
  'passages',
  'created_cohort',
  'cohort',
];
const PATH_FILTERS: PathFilter[] = ['all', 'won', 'lost', 'hold'];

function asEnum<T extends string>(value: string | null, allowed: T[], fallback: T): T {
  if (value && (allowed as string[]).includes(value)) return value as T;
  return fallback;
}

function asOptionalNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function useInsightsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: InsightsFilterParams = useMemo(
    () => ({
      dateRange: asEnum(searchParams.get('dateRange'), DATE_RANGES, '6m'),
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      branchId: searchParams.get('branchId') || undefined,
      salesManagerId: asOptionalNumber(searchParams.get('salesManagerId')),
      salesExecutiveId: asOptionalNumber(searchParams.get('salesExecutiveId')),
      teamPeriod: asEnum(searchParams.get('teamPeriod'), TEAM_PERIODS, 'monthly'),
      funnelMode: asEnum(searchParams.get('funnelMode'), FUNNEL_MODES, 'inventory'),
      pathFilter: asEnum(searchParams.get('pathFilter'), PATH_FILTERS, 'all'),
    }),
    [searchParams]
  );

  const setFilters = useCallback(
    (patch: Partial<InsightsFilterParams>) => {
      const next: InsightsFilterParams = { ...filters, ...patch };
      const params = new URLSearchParams();
      params.set('dateRange', next.dateRange);
      if (next.dateRange === 'custom') {
        if (next.dateFrom) params.set('dateFrom', next.dateFrom);
        if (next.dateTo) params.set('dateTo', next.dateTo);
      }
      if (next.branchId) params.set('branchId', next.branchId);
      if (next.salesManagerId != null) params.set('salesManagerId', String(next.salesManagerId));
      if (next.salesExecutiveId != null) params.set('salesExecutiveId', String(next.salesExecutiveId));
      if (next.teamPeriod !== 'monthly') params.set('teamPeriod', next.teamPeriod);
      if (next.funnelMode !== 'inventory') params.set('funnelMode', next.funnelMode);
      if (next.pathFilter !== 'all') params.set('pathFilter', next.pathFilter);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, pathname, router]
  );

  return { filters, setFilters };
}
