'use client';

import { fetchActions } from '../lib/crmApi';
import { useHallwayQuery } from './useHallwayQuery';

export function useActions(branchId?: string) {
  const { data, loading, error, refetch } = useHallwayQuery(
    (token, signal) => fetchActions(token, branchId, signal),
    [branchId ?? '']
  );

  return { data, loading, error, refetch };
}
