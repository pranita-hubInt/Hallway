'use client';

import React from 'react';
import type { TeamPerformanceRow } from '../../types/crmInsights';
import { formatPercent } from '../../lib/formatInr';
import { WidgetShell } from './WidgetShell';

export function TeamPerformanceTable({
  rows,
  loading,
  error,
}: {
  rows?: TeamPerformanceRow[];
  loading?: boolean;
  error?: string | null;
}) {
  return (
    <WidgetShell
      title="Team performance"
      subtitle="Meetings = appointments scheduled · Proposals = quotes sent"
      loading={loading}
      error={error}
      empty={!rows?.length}
      emptyText="No executives in this scope"
    >
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="py-2 pr-3">Executive</th>
              <th className="py-2 pr-3 text-right">Leads</th>
              <th className="py-2 pr-3 text-right">Meetings</th>
              <th className="py-2 pr-3 text-right">Proposals</th>
              <th className="py-2 pr-3 text-right">Closed</th>
              <th className="py-2 text-right">Conv.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {(rows || []).map((row) => (
              <tr key={row.userId}>
                <td className="py-2.5 pr-3">
                  <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {row.role}
                    {!row.active ? ' · Inactive' : ''}
                  </p>
                </td>
                <td className="py-2.5 pr-3 text-right font-mono font-bold">{row.leads}</td>
                <td className="py-2.5 pr-3 text-right font-mono font-bold">{row.meetings}</td>
                <td className="py-2.5 pr-3 text-right font-mono font-bold">{row.proposals}</td>
                <td className="py-2.5 pr-3 text-right font-mono font-bold">{row.closed}</td>
                <td className="py-2.5 text-right font-mono font-bold">
                  {formatPercent(row.conversionPercent, 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetShell>
  );
}
