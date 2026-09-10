'use client';

import React from 'react';
import type { RevenueDistribution } from '../../types/crmInsights';
import { formatInrCompact } from '../../lib/formatInr';
import { HorizontalBars } from './ChartPrimitives';
import { WidgetShell } from './WidgetShell';

const PHASE_COLORS = ['bg-sky-500', 'bg-violet-500', 'bg-amber-500', 'bg-emerald-500'];

export function RevenueDistributionCard({
  data,
  loading,
  error,
}: {
  data?: RevenueDistribution | null;
  loading?: boolean;
  error?: string | null;
}) {
  const phases = data?.phases || [];
  return (
    <WidgetShell
      title="Revenue distribution"
      subtitle={data?.observation}
      loading={loading}
      error={error}
      empty={!phases.length}
    >
      <HorizontalBars
        items={phases.map((phase, idx) => ({
          label: phase.phaseLabel,
          value: phase.value,
          hint: `${formatInrCompact(phase.value)} · ${phase.percent}%`,
          color: PHASE_COLORS[idx % PHASE_COLORS.length],
        }))}
      />
    </WidgetShell>
  );
}
