'use client';

import React from 'react';
import type { DropReasons } from '../../types/crmInsights';
import { HorizontalBars } from './ChartPrimitives';
import { WidgetShell } from './WidgetShell';

export function DropReasonsChart({
  data,
  loading,
  error,
}: {
  data?: DropReasons | null;
  loading?: boolean;
  error?: string | null;
}) {
  const items = data?.items || [];
  return (
    <WidgetShell
      title="Drop reasons"
      subtitle={`${data?.total ?? 0} lost leads`}
      loading={loading}
      error={error}
      empty={!items.length}
    >
      <HorizontalBars
        items={items.map((item) => ({
          label: item.reason,
          value: item.count,
          hint: `${item.count} · ${item.percent}%`,
          color: 'bg-rose-500',
        }))}
      />
    </WidgetShell>
  );
}
