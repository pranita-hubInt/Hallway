'use client';

import React from 'react';
import { Users, Calendar } from 'lucide-react';

export default function WidgetLeadership() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans">
          LEADERSHIP BOARD
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] border border-blue-500/30">
            CEO
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Q2 Townhall Scheduled
          </h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Join us next Thursday at 10 AM EST for the quarterly review.
        </p>
      </div>
    </div>
  );
}
