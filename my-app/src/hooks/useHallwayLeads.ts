'use client';

import { fetchHallwayLeads } from '../lib/crmApi';
import type { HallwayLeadsParams } from '../types/hallway';
import { useHallwayQuery } from './useHallwayQuery';

export function useHallwayLeads(params: HallwayLeadsParams = {}) {
  const { data, loading, error, refetch } = useHallwayQuery(
    (token, signal) => fetchHallwayLeads(token, params, signal),
    [
      params.page ?? 0,
      params.size ?? 20,
      params.branchId ?? '',
      params.salesManagerId ?? '',
      params.salesExecutiveId ?? '',
    ]
  );

  return { data, loading, error, refetch };
}
