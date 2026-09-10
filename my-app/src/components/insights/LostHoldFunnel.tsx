'use client';

import React, { useMemo, useState } from 'react';
import type { FunnelBlock, HoldPathStage } from '../../types/crmInsights';
import { FunnelRows, HorizontalBars } from './ChartPrimitives';
import { WidgetShell } from './WidgetShell';

export function LostHoldFunnel({
  lost,
  hold,
  holdPathByStage,
  loading,
  error,
}: {
  lost?: FunnelBlock | null;
  hold?: FunnelBlock | null;
  holdPathByStage?: Record<string, HoldPathStage>;
  loading?: boolean;
  error?: string | null;
}) {
  const [tab, setTab] = useState<'lost' | 'hold'>('lost');
  const block = tab === 'lost' ? lost : hold;
  const stages = block?.stages || [];

  const holdBreakdown = useMemo(() => {
    if (tab !== 'hold' || !holdPathByStage) return [];
    return Object.entries(holdPathByStage).flatMap(([stageKey, stage]) =>
      (stage.substages || [])
        .filter((s) => s.count > 0)
        .map((s) => ({
          label: `${stageKey}: ${s.title}`,
          value: s.count,
        }))
    );
  }, [holdPathByStage, tab]);

  return (
    <WidgetShell
      title={tab === 'lost' ? 'Lost funnel' : 'Hold funnel'}
      subtitle={tab === 'lost' ? `${lost?.total ?? 0} lost leads` : `${hold?.total ?? 0} on hold`}
      loading={loading}
      error={error}
      empty={!stages.length}
      actions={
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {(['lost', 'hold'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-2.5 py-1 text-[11px] font-bold capitalize ${
                tab === key
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      }
    >
      <FunnelRows
        stages={stages.map((s) => ({
          label: s.stageLabel,
          count: s.count,
          sharePercent: s.sharePercent ?? s.dropPercent ?? 0,
        }))}
      />
      {tab === 'hold' && holdBreakdown.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            Hold substages
          </p>
          <HorizontalBars items={holdBreakdown} />
        </div>
      )}
    </WidgetShell>
  );
}
