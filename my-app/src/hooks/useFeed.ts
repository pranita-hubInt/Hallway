'use client';

import { fetchFeed } from '../lib/crmApi';
import type { HallwayFeedParams } from '../types/hallway';
import { useHallwayQuery } from './useHallwayQuery';

export function useFeed(params: HallwayFeedParams = {}) {
  const { data, loading, error, refetch } = useHallwayQuery(
    (token, signal) => fetchFeed(token, params, signal),
    [params.branchId ?? '', params.limit ?? 20]
  );

  return { data, loading, error, refetch };
}
