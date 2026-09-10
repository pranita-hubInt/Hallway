'use client';

import { fetchPeople } from '../lib/crmApi';
import type { HallwayPeopleParams } from '../types/hallway';
import { useHallwayQuery } from './useHallwayQuery';

export function usePeople(filters: HallwayPeopleParams = {}) {
  const { data, loading, error, refetch } = useHallwayQuery(
    (token, signal) => fetchPeople(token, filters, signal),
    [filters.branchId ?? '', filters.role ?? '']
  );

  return { data, loading, error, refetch };
}
