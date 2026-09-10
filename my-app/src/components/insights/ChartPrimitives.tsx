'use client';

import React, { useId } from 'react';

export function LineChart({
  points,
  valueKey,
  color = '#0EA5E9',
}: {
  points: Array<Record<string, string | number>>;
  valueKey: string;
  color?: string;
}) {
  const gradientId = useId().replace(/:/g, '');
  const values = points.map((p) => Number(p[valueKey] ?? 0));
  const max = Math.max(...values, 1);
  const w = 320;
  const h = 140;
  const padX = 8;
  const padY = 12;
  const coords = values.map((v, i) => {
    const x = padX + (i / Math.max(values.length - 1, 1)) * (w - padX * 2);
    const y = h - padY - (v / max) * (h - padY * 2);
    return `${x},${y}`;
  });
  const area = `${padX},${h - padY} ${coords.join(' ')} ${w - padX},${h - padY}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`fill-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#fill-${gradientId})`} />
        <polyline
          points={coords.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex justify-between gap-1 mt-1">
        {points.map((p) => (
          <span key={String(p.label)} className="text-[9px] font-bold text-slate-400 truncate">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HorizontalBars({
  items,
  max,
}: {
  items: { label: string; value: number; hint?: string; color?: string }[];
  max?: number;
}) {
  const peak = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate pr-2">
              {item.label}
            </span>
            <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white shrink-0">
              {item.hint ?? item.value}
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${item.color || 'bg-sky-500'}`}
              style={{ width: `${Math.min(100, (item.value / peak) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FunnelRows({
  stages,
}: {
  stages: { label: string; count: number; sharePercent: number; extra?: string }[];
}) {
  return (
    <div className="space-y-2">
      {stages.map((stage, idx) => {
        const width = Math.max(18, stage.sharePercent);
        return (
          <div key={`${stage.label}-${idx}`} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate">
              {stage.label}
            </div>
            <div className="flex-1 h-8 bg-slate-50 dark:bg-slate-900/60 rounded-lg overflow-hidden relative">
              <div
                className="h-full bg-sky-500/80 dark:bg-sky-500/70 rounded-lg"
                style={{ width: `${width}%` }}
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-[11px] font-black text-white mix-blend-difference">
                {stage.count.toLocaleString('en-IN')} · {stage.sharePercent}%
              </span>
            </div>
            {stage.extra && (
              <span className="w-14 text-right text-[10px] font-mono text-slate-400">{stage.extra}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
