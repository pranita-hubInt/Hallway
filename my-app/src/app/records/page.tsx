'use client';

import React, { useState } from 'react';
import { ShieldCheck, Star, Trophy } from 'lucide-react';
import { useRecords } from '../../hooks/useRecords';
import type { HallwayIndividualRecord } from '../../types/hallway';
import EmptyState from '../../components/common/EmptyState';
import {
  CorridorBanner,
  CorridorGate,
  CorridorSkeleton,
  PersonAvatar,
} from '../../components/hallway/CorridorGate';
import { CorridorScopeBar, useCorridorScope } from '../../components/hallway/CorridorScopeBar';

function RecordsInner() {
  const { branchId, setBranchId, options } = useCorridorScope();
  const { data, loading, error } = useRecords(branchId);
  const [selectedRecord, setSelectedRecord] = useState<HallwayIndividualRecord | null>(null);

  const omittedIds = new Set((data?.omittedCategories || []).map((item) => item.id));
  const individualRecords = (data?.individualRecords || []).filter(
    (record) => !omittedIds.has(record.id)
  );
  const teamRecords = (data?.teamRecords || []).filter(
    (record) => !omittedIds.has(record.id || record.metricLabel)
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-xl">🏆</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            HUB BOOK OF RECORDS
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Lifetime Hub benchmarks as published by CRM. Categories without source data are omitted.
        </p>
      </div>

      <CorridorScopeBar
        branchId={branchId}
        options={options}
        onBranch={setBranchId}
        showManager={false}
      />

      <CorridorBanner error={error} />

      <div className="space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-sans">
          & INDIVIDUAL RECORDS
        </span>
        {loading ? (
          <CorridorSkeleton rows={3} />
        ) : individualRecords.length === 0 ? (
          <EmptyState
            title="No individual records yet"
            description="Verified personal benchmarks will appear here when CRM publishes them."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {individualRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer group relative flex flex-col justify-between"
              >
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                    {record.title}
                  </p>
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <PersonAvatar name={record.holderName} src={record.avatar} size={64} />
                      <div className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-slate-900 rounded-full shadow-xs">
                        <Star className="w-3 h-3 fill-slate-900" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center mb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {record.holderName}
                    </h3>
                    {record.holderRole && (
                      <p className="text-[11px] text-slate-400">{record.holderRole}</p>
                    )}
                  </div>
                  <div className="text-center py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-3 border border-slate-100 dark:border-slate-800">
                    <p className="font-mono font-black text-xl text-slate-900 dark:text-white">
                      {record.value}
                    </p>
                    {record.subValue && (
                      <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                        {record.subValue}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-2 flex justify-center">
                  {record.verified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-400/30">
                      <Trophy className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Record Holder
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-sans">
          & TEAM RECORDS
        </span>
        {loading ? (
          <CorridorSkeleton rows={3} />
        ) : teamRecords.length === 0 ? (
          <EmptyState
            title="No team records yet"
            description="Verified squad benchmarks will appear here when CRM publishes them."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teamRecords.map((teamRec, index) => (
              <div
                key={teamRec.id || `${teamRec.teamName}-${teamRec.metricLabel}-${index}`}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {teamRec.metricLabel}
                  </p>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {teamRec.teamName}
                  </h3>
                  {teamRec.leadName && (
                    <p className="text-xs text-slate-400">{teamRec.leadName}</p>
                  )}
                </div>
                <div className="py-3 px-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="font-mono font-black text-2xl text-slate-900 dark:text-white">
                    {teamRec.value}
                  </p>
                </div>
                {teamRec.verified && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Verified Record</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-amber-500">
                <Trophy className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Hallway Benchmark</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <PersonAvatar name={selectedRecord.holderName} src={selectedRecord.avatar} size={80} />
              </div>
              <div>
                <h4 className="font-black text-lg text-slate-900 dark:text-white">
                  {selectedRecord.holderName}
                </h4>
                <p className="text-xs text-slate-400">
                  {[selectedRecord.holderRole, selectedRecord.department].filter(Boolean).join(' • ')}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {selectedRecord.title}
                </p>
                <p className="font-mono text-3xl font-black text-slate-900 dark:text-white my-1">
                  {selectedRecord.value}
                </p>
                {selectedRecord.subValue && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    {selectedRecord.subValue}
                  </p>
                )}
              </div>
              {selectedRecord.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  {selectedRecord.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookOfRecordsPage() {
  return (
    <CorridorGate>
      <RecordsInner />
    </CorridorGate>
  );
}
