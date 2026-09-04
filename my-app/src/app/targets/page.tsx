'use client';

import React from 'react';
import { Target, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TargetsPage() {
  const targetCards = [
    { title: 'Q3 Enterprise Revenue', current: '$12.4M', target: '$15.0M', progress: 82.6, color: 'from-emerald-500 to-teal-500' },
    { title: 'Monthly Conversion Quota', current: '80%', target: '100%', progress: 80, color: 'from-indigo-500 to-purple-500' },
    { title: 'Customer Acquisition Velocity', current: '142 Deals', target: '160 Deals', progress: 88.7, color: 'from-amber-500 to-orange-500' },
    { title: 'Average Sales Cycle', current: '18.4 Days', target: '14.0 Days', progress: 76.0, color: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Operating Targets & Quotas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Division quarterly benchmarks, milestone progress tracking, and pacing analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {targetCards.map((t, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.title}</span>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{t.progress}%</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">{t.current}</span>
              <span className="text-xs text-slate-400">Target: {t.target}</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${t.color}`} style={{ width: `${t.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
