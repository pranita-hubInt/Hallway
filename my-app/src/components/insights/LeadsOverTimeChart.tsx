'use client';

import React from 'react';
import type { LeadsOverTime } from '../../types/crmInsights';
import { signedNumber } from '../../lib/formatInr';
import { LineChart } from './ChartPrimitives';
import { WidgetShell } from './WidgetShell';

export function LeadsOverTimeChart({
  data,
  loading,
  error,
}: {
  data?: LeadsOverTime | null;
  loading?: boolean;
  error?: string | null;
}) {
  const points = data?.points || [];
  return (
    <WidgetShell
      title="Leads over time"
      subtitle={
        data ? `${signedNumber(data.changePercent, 1)}% vs previous window` : undefined
      }
      loading={loading}
      error={error}
      empty={!points.length}
    >
      <LineChart
        color="#0EA5E9"
        valueKey="count"
        points={points.map((p) => ({ label: p.label, count: p.count ?? 0 }))}
      />
    </WidgetShell>
  );
}
