'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Zap, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WidgetCampaign() {
  const { feedPosts } = useApp();

  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysLeft = Math.max(1, lastDay.getDate() - now.getDate());
  const monthName = now.toLocaleString('en-IN', { month: 'short' });

  // Find company-wide target post if available
  const overallTargetPost = feedPosts.find(
    (p) => p.id.startsWith('crm-target-all') || p.id.includes('overall')
  );

  const percentage = overallTargetPost?.quotaProgress?.percentage ?? 22.4;
  const currentFormatted =
    overallTargetPost?.quotaProgress?.currentFormatted ||
    (typeof overallTargetPost?.quotaProgress?.current === 'number'
      ? overallTargetPost.quotaProgress.current >= 10000000
        ? `₹${(overallTargetPost.quotaProgress.current / 10000000).toFixed(2)} Cr`
        : `₹${(overallTargetPost.quotaProgress.current / 100000).toFixed(2)}L`
      : '₹1.48 Cr');
  const targetFormatted =
    overallTargetPost?.quotaProgress?.targetFormatted ||
    (typeof overallTargetPost?.quotaProgress?.target === 'number'
      ? `₹${(overallTargetPost.quotaProgress.target / 10000000).toFixed(2)} Cr`
      : '₹6.60 Cr');

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/60 p-5 shadow-xs hover:shadow-md transition-all duration-200 group">
      {/* Top highlight bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

      {/* Subtle radiant ambient glow in header corner */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-sans">
            ACTIVE SPRINT • {monthName.toUpperCase()}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 text-[10px] font-bold text-amber-700 dark:text-amber-300">
          <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
          <span>{daysLeft}d left</span>
        </span>
      </div>

      {/* Campaign Title & Goal */}
      <div className="mb-3.5">
        <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
          <span>Q3 Gross Booking Sprint</span>
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Company-wide drive towards the {targetFormatted} monthly target across all corridors.
        </p>
      </div>

      {/* Progress Bar & Stats */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Booked: <span className="text-slate-900 dark:text-white font-bold">{currentFormatted}</span>
          </span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{percentage}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 shadow-xs"
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400">
          <span>Pacing Target: <span className="font-medium text-slate-600 dark:text-slate-300">{targetFormatted}</span></span>
          <span>JP • Sarjapura • HBR</span>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 dark:text-slate-500">Pacing live from CRM</span>
        <Link
          href="/leaderboards"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          <span>Leaderboard</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
