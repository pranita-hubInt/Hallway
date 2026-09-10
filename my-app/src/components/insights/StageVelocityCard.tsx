'use client';

import React from 'react';
import type { StageVelocityItem } from '../../types/crmInsights';
import { signedNumber } from '../../lib/formatInr';
import { WidgetShell } from './WidgetShell';

export function StageVelocityCard({
  items,
  loading,
  error,
}: {
  items?: StageVelocityItem[];
  loading?: boolean;
  error?: string | null;
}) {
  return (
    <WidgetShell
      title="Stage velocity"
      subtitle="Average days between checkpoints"
      loading={loading}
      error={error}
      empty={!items?.length}
    >
      <div className="space-y-3">
        {(items || []).map((item) => {
          const faster = item.trendDays <= 0;
          return (
            <div
              key={`${item.fromStage}-${item.toStage}`}
              className="flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {item.fromStage} → {item.toStage}
                </p>
                <p className={`text-[11px] font-semibold ${faster ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {signedNumber(item.trendDays, 1)} days vs prior
                </p>
              </div>
              <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                {item.avgDays}
                <span className="text-[10px] font-bold text-slate-400 ml-1">d</span>
              </span>
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
}
