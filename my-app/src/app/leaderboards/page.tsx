'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { leaderboardMembersMock, leaderboardTeamsMock } from '../../data/mockData';

export default function LeaderboardsPage() {
  const {
    activeDepartment,
    setActiveDepartment,
    activeTimeframe,
    setActiveTimeframe,
    activeLeaderboardView,
    setActiveLeaderboardView,
    searchQuery
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [showFullRosterModal, setShowFullRosterModal] = useState(false);

  const departments = ['All Departments', 'Sales', 'Design', 'Operations', 'HR', 'Finance'];
  const effectiveSearch = localSearch || searchQuery;

  const filteredMembers = leaderboardMembersMock.filter((m) => {
    if (activeDepartment !== 'All Departments' && m.department !== activeDepartment) {
      return false;
    }
    if (effectiveSearch) {
      const q = effectiveSearch.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredTeams = leaderboardTeamsMock.filter((t) => {
    if (activeDepartment !== 'All Departments' && t.department !== activeDepartment) {
      return false;
    }
    if (effectiveSearch) {
      const q = effectiveSearch.toLowerCase();
      return t.teamName.toLowerCase().includes(q) || t.leadName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header matching PDF Page 2 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Performance Leaderboards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time velocity metrics across all operating divisions.
          </p>
        </div>

        {/* Member Search input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Find member..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#0D1829] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {departments.map((dept) => {
          const isActive = activeDepartment === dept;
          return (
            <button
              key={dept}
              onClick={() => setActiveDepartment(dept)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#0D1829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>

      {/* SALES VELOCITY Section Card */}
      <div className="bg-white dark:bg-[#0D1829] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-sans">
                SALES VELOCITY
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Top performers by total booking revenue and conversion efficiency.
            </p>
          </div>

          {/* Controls: Individual vs Team & Timeframes */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setActiveLeaderboardView('Individual')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeLeaderboardView === 'Individual'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setActiveLeaderboardView('Team')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeLeaderboardView === 'Team'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Team
              </button>
            </div>

            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
              {(['Today', 'MTD', 'QTD'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-2.5 py-1 font-bold rounded-lg transition-all ${
                    activeTimeframe === tf
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Table matching PDF Page 2 */}
        {activeLeaderboardView === 'Individual' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Rank</th>
                  <th className="pb-3">Member</th>
                  <th className="pb-3 text-right">Revenue</th>
                  <th className="pb-3 text-center">Bookings</th>
                  <th className="pb-3 pr-2 text-right">Conversion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredMembers.map((member) => {
                  const rankStyles = {
                    1: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300',
                    2: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300',
                    3: 'bg-amber-100/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-400/50'
                  }[member.rank] || 'bg-slate-100 dark:bg-slate-800 text-slate-600';

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-4 pl-2">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${rankStyles}`}
                        >
                          {member.rank}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                {member.name}
                              </span>
                              {member.rank === 1 && (
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-normal">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-right">
                        <span className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                          {member.revenueFormatted}
                        </span>
                      </td>

                      <td className="py-4 text-center">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {member.bookings}
                        </span>
                      </td>

                      <td className="py-4 pr-2 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="font-bold text-slate-900 dark:text-white font-mono w-10 text-right">
                            {member.conversionRate}%
                          </span>
                          <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full ${
                                member.rank === 1
                                  ? 'bg-emerald-500'
                                  : member.rank === 2
                                  ? 'bg-blue-500'
                                  : 'bg-purple-500'
                              }`}
                              style={{ width: `${member.conversionRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Rank</th>
                  <th className="pb-3">Squad / Team</th>
                  <th className="pb-3 text-right">Revenue</th>
                  <th className="pb-3 text-center">Deals Closed</th>
                  <th className="pb-3 pr-2 text-right">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 pl-2">
                      <span className="w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {team.rank}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={team.avatar} alt={team.teamName} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{team.teamName}</p>
                          <p className="text-[11px] text-slate-400 font-normal">Led by {team.leadName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-slate-900 dark:text-white text-sm">
                      {team.totalRevenue}
                    </td>
                    <td className="py-4 text-center font-bold text-slate-700 dark:text-slate-300">
                      {team.dealsClosed}
                    </td>
                    <td className="py-4 pr-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {team.winRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View Full Roster Action */}
        <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setShowFullRosterModal(true)}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 inline-flex items-center gap-1 transition-colors"
          >
            <span>View Full Roster</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Full Roster Modal */}
      {showFullRosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0D1829] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Operating Division Roster - {activeDepartment}
              </h3>
              <button
                onClick={() => setShowFullRosterModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {leaderboardMembersMock.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-400 w-4">{m.rank}</span>
                    <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-[11px] text-slate-400">{m.role} • {m.department}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <p className="font-bold text-slate-900 dark:text-white">{m.revenueFormatted}</p>
                    <p className="text-[11px] text-emerald-500 font-semibold">{m.conversionRate}% win rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
