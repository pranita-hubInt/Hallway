'use client';

import React from 'react';
import type { RevenueForecast } from '../../types/crmInsights';
import { formatInrCompact } from '../../lib/formatInr';
import { WidgetShell } from './WidgetShell';

export function RevenueForecastCard({
  data,
  loading,
  error,
}: {
  data?: RevenueForecast | null;
  loading?: boolean;
  error?: string | null;
}) {
  const bars = data
    ? [
        { label: 'Actual', value: data.actual, color: 'bg-sky-500' },
        { label: 'Projected', value: data.projected, color: 'bg-violet-500' },
        { label: 'Target', value: data.target, color: 'bg-amber-500' },
      ]
    : [];
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <WidgetShell
      title="Revenue forecast"
      subtitle={data?.targetSource ? `Target source: ${data.targetSource}` : 'Gross booking pace'}
      loading={loading}
      error={error}
      empty={!data}
    >
      <div className="flex items-end gap-4 h-40">
        {bars.map((bar) => (
          <div key={bar.label} className="flex-1 flex flex-col items-center justify-end h-full">
            <span className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-100 mb-1">
              {formatInrCompact(bar.value)}
            </span>
            <div
              className={`w-full max-w-[72px] rounded-t-xl ${bar.color}`}
              style={{ height: `${Math.max(8, (bar.value / max) * 100)}%` }}
            />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-2">
              {bar.label}
            </span>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}
