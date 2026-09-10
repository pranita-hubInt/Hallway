'use client';

import { fetchTodayEvents } from '../lib/crmApi';
import { useHallwayQuery } from './useHallwayQuery';

export function useTodayEvents() {
  const { data, loading, error, refetch } = useHallwayQuery(
    (token, signal) => fetchTodayEvents(token, signal),
    []
  );

  return { data, loading, error, refetch };
}
