'use client';

import { fetchLeaderboard } from '../lib/crmApi';
import type { HallwayLeaderboardParams, LeaderboardPeriod } from '../types/hallway';
import { useHallwayQuery } from './useHallwayQuery';

export function useLeaderboard(
  period: LeaderboardPeriod = 'mtd',
  filters: Omit<HallwayLeaderboardParams, 'period'> = {}
) {
  const { data, loading, error, refetch } = useHallwayQuery(
    (token, signal) =>
      fetchLeaderboard(
        token,
        {
          period,
          branchId: filters.branchId,
          salesManagerId: filters.salesManagerId,
        },
        signal
      ),
    [period, filters.branchId ?? '', filters.salesManagerId ?? '']
  );

  return { data, loading, error, refetch };
}
