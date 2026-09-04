'use client';

import React from 'react';
import { Megaphone, Calendar, ShieldCheck, Bell } from 'lucide-react';

export default function AnnouncementsPage() {
  const announcements = [
    {
      title: 'Q2 All-Hands Townhall Scheduled',
      author: 'Leadership Office',
      date: 'Oct 24, 2023',
      content: 'Join us next Thursday at 10 AM EST for the quarterly review. We will be celebrating the new Book of Records inductees.',
      tag: 'Company Wide'
    },
    {
      title: 'Fast Track Week Incentive Launch',
      author: 'Commercial Operations',
      date: 'Oct 23, 2023',
      content: 'Double commission on all deals closed before Friday 5 PM. Track live standings on the Sales Velocity Leaderboard.',
      tag: 'Sales & Ops'
    },
    {
      title: 'Phase 3 Luxury Inventory Live on HUB',
      author: 'Asset Management',
      date: 'Oct 20, 2023',
      content: 'Whitefield & Sarjapura premium towers are officially open for client allocations and site visits.',
      tag: 'Inventory'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Executive Announcements
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Official corridor broadcasts, campaign releases, and townhall notices.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((a, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                {a.tag}
              </span>
              <span className="text-xs text-slate-400">{a.date}</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{a.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
