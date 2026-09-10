'use client';

import React from 'react';

export default function WidgetLeadership() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans">
          LEADERSHIP BOARD
        </span>
      </div>
      <p className="text-xs text-slate-400">No leadership updates yet.</p>
    </div>
  );
}
