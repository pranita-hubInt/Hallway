'use client';

import { fetchRecords } from '../lib/crmApi';
import { useHallwayQuery } from './useHallwayQuery';

export function useRecords(branchId?: string) {
  const { data, loading, error, refetch } = useHallwayQuery(
    (token, signal) => fetchRecords(token, branchId, signal),
    [branchId ?? '']
  );

  return { data, loading, error, refetch };
}
