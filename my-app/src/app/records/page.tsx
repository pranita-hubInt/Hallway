'use client';

import React, { useState } from 'react';
import { Award, ShieldCheck, Trophy, Sparkles, CheckCircle2, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { individualRecordsMock, teamRecordsMock } from '../../data/mockData';

export default function BookOfRecordsPage() {
  const { activeDepartment, setActiveDepartment, searchQuery } = useApp();
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const departments = ['All Departments', 'Sales', 'Design', 'Operations', 'HR', 'Finance'];

  const filteredIndividual = individualRecordsMock.filter((r) => {
    if (activeDepartment !== 'All Departments' && r.department !== activeDepartment) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.holderName.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredTeams = teamRecordsMock.filter((r) => {
    if (activeDepartment !== 'All Departments' && r.department !== activeDepartment) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.teamName.toLowerCase().includes(q) || r.leadName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-xl">🏆</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            HUB BOOK OF RECORDS
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Immortalizing the lifetime achievements and highest benchmarks set within HUB. These records stand as testaments to elite performance.
        </p>
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
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>

      {/* INDIVIDUAL RECORDS Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-sans">
            & INDIVIDUAL RECORDS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredIndividual.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer group relative flex flex-col justify-between"
            >
              {/* Record Title Header */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                  {record.title}
                </p>

                {/* Avatar Portrait */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={record.avatar}
                      alt={record.holderName}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400/40 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-slate-900 rounded-full shadow-xs">
                      <Star className="w-3 h-3 fill-slate-900" />
                    </div>
                  </div>
                </div>

                {/* Holder Name */}
                <div className="text-center mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {record.holderName}
                  </h3>
                  {record.holderRole && (
                    <p className="text-[11px] text-slate-400">{record.holderRole}</p>
                  )}
                </div>

                {/* Value Benchmark */}
                <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-3 border border-slate-100 dark:border-slate-800">
                  <p className="font-mono font-black text-xl text-slate-900 dark:text-white">
                    {record.value}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                    {record.subValue}
                  </p>
                </div>
              </div>

              {/* Record Holder Badge Seal */}
              <div className="pt-2 flex justify-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-400/30">
                  <Trophy className="w-3 h-3" />
                  <span>Record Holder</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM RECORDS Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-sans">
            & TEAM RECORDS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.map((teamRec) => (
            <div
              key={teamRec.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {teamRec.metricLabel}
                </p>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {teamRec.teamName}
                </h3>
                <p className="text-xs text-slate-400">{teamRec.leadName}</p>
              </div>

              <div className="py-3 px-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="font-mono font-black text-2xl text-slate-900 dark:text-white">
                  {teamRec.value}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Record</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-amber-500">
                <Trophy className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Hallway Benchmark</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3">
              <img
                src={selectedRecord.avatar}
                alt={selectedRecord.holderName}
                className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-amber-400/30"
              />
              <div>
                <h4 className="font-black text-lg text-slate-900 dark:text-white">{selectedRecord.holderName}</h4>
                <p className="text-xs text-slate-400">{selectedRecord.holderRole} • {selectedRecord.department}</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{selectedRecord.title}</p>
                <p className="font-mono text-3xl font-black text-slate-900 dark:text-white my-1">{selectedRecord.value}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{selectedRecord.subValue}</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                {selectedRecord.description || 'Verified milestone archived in the permanent Hallway Book of Records.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
