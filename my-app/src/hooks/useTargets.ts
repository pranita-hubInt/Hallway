'use client';

import { fetchTargets } from '../lib/crmApi';
import type { HallwayTargetsParams } from '../types/hallway';
import { useHallwayQuery } from './useHallwayQuery';

export function useTargets(filters: HallwayTargetsParams = {}) {
  const { data, loading, error, refetch } = useHallwayQuery(
    (token, signal) => fetchTargets(token, filters, signal),
    [filters.branchId ?? '', filters.salesManagerId ?? '', filters.salesExecutiveId ?? '']
  );

  return { data, loading, error, refetch };
}
