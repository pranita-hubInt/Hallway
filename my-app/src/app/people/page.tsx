'use client';

import React, { useState } from 'react';
import { Users, Search, Mail, Phone, MapPin } from 'lucide-react';
import { leaderboardMembersMock } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function PeoplePage() {
  const { searchQuery, setSearchQuery } = useApp();
  const [search, setSearch] = useState('');

  const effectiveSearch = search || searchQuery;
  const members = leaderboardMembersMock.filter((m) =>
    m.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    m.department.toLowerCase().includes(effectiveSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            People & Operating Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect across all operating hubs, sales leads, and division executives.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search directory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((m) => (
          <div key={m.id} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{m.name}</h3>
                <p className="text-xs text-slate-400">{m.role}</p>
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-1">
                  {m.department} Division
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500">{m.revenueFormatted} YTD</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{m.conversionRate}% win</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
