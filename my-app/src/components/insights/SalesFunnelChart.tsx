'use client';

import React from 'react';
import type { FunnelMeta, FunnelStage } from '../../types/crmInsights';
import { FunnelRows } from './ChartPrimitives';
import { WidgetShell } from './WidgetShell';

export function SalesFunnelChart({
  stages,
  meta,
  loading,
  error,
}: {
  stages?: FunnelStage[];
  meta?: FunnelMeta | null;
  loading?: boolean;
  error?: string | null;
}) {
  const rows = (stages || []).filter((s) => s.stageKey !== 'total');
  return (
    <WidgetShell
      title="Sales funnel"
      subtitle={meta?.definition || meta?.funnelMode || 'Inventory of current milestones'}
      loading={loading}
      error={error}
      empty={!rows.length}
    >
      <FunnelRows
        stages={rows.map((s) => ({
          label: s.stageLabel,
          count: s.count,
          sharePercent: s.sharePercent,
          extra:
            s.conversionPercent != null && s.stageKey !== 'fresh_lead'
              ? `${s.conversionPercent}%`
              : undefined,
        }))}
      />
    </WidgetShell>
  );
}
