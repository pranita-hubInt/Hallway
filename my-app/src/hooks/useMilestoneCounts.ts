'use client';

import { fetchMilestoneCounts } from '../lib/crmApi';
import { useHallwayQuery } from './useHallwayQuery';

export function useMilestoneCounts(params: Record<string, string> = {}, enabled = true) {
  const key = JSON.stringify(params);
  const { data, loading, error, refetch } = useHallwayQuery(
    (token, signal) => fetchMilestoneCounts(token, params, signal),
    [key],
    enabled
  );

  return { data, loading, error, refetch };
}
