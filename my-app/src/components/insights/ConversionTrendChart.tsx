'use client';

import React from 'react';
import type { ConversionTrend } from '../../types/crmInsights';
import { signedNumber } from '../../lib/formatInr';
import { LineChart } from './ChartPrimitives';
import { WidgetShell } from './WidgetShell';

export function ConversionTrendChart({
  data,
  loading,
  error,
}: {
  data?: ConversionTrend | null;
  loading?: boolean;
  error?: string | null;
}) {
  const points = data?.points || [];
  return (
    <WidgetShell
      title="Conversion trend"
      subtitle={data ? `${signedNumber(data.changePercent, 1)}% first→last` : 'Closed won / created'}
      loading={loading}
      error={error}
      empty={!points.length}
    >
      <LineChart
        color="#8B5CF6"
        valueKey="conversionPercent"
        points={points.map((p) => ({
          label: p.label,
          conversionPercent: p.conversionPercent ?? 0,
        }))}
      />
    </WidgetShell>
  );
}
