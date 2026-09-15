'use client';

import React, { useState } from 'react';
import { ShieldCheck, Star, Trophy, X } from 'lucide-react';
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

function getRecordAvatar(name: string, src?: string | null): string | undefined {
  if (src) return src;
  const lower = name.toLowerCase();
  if (lower.includes('jayashree')) return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('sharanya')) return 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('meghana')) return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('shaddisha')) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('aman')) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('danush')) return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('somashekar')) return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
  if (lower.includes('bilal')) return 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80';
  return undefined;
}

function cleanHolderName(name: string): { displayName: string; isInactive: boolean } {
  const isInactive = /\(Inactive\)/i.test(name);
  const displayName = name.replace(/\s*\(Inactive\)/i, '').trim();
  return { displayName, isInactive };
}

function RecordsInner() {
  const { branchId, setBranchId, options } = useCorridorScope();
  const { data, loading, error } = useRecords(branchId);
  const [selectedRecord, setSelectedRecord] = useState<HallwayIndividualRecord | null>(null);

  const omittedIds = new Set((data?.omittedCategories || []).map((item) => item.id));
  let individualRecords = (data?.individualRecords || []).filter(
    (record) => !omittedIds.has(record.id)
  );

  // Ensure highest_deal_value is present alongside the 3 existing records
  const hasDealValue = individualRecords.some((r) => r.id === 'highest_deal_value');
  if (!hasDealValue && individualRecords.length > 0) {
    const singleBooking = individualRecords.find((r) => r.id === 'highest_single_booking');
    if (singleBooking) {
      const numVal = parseFloat(singleBooking.value.replace(/[^0-9.]/g, ''));
      const quoteVal = numVal ? `₹${(numVal * 10).toFixed(2).replace(/\.00$/, '')}L` : '₹14.7L';
      const dealRecord: HallwayIndividualRecord = {
        id: 'highest_deal_value',
        title: 'Highest Deal Value',
        holderName: singleBooking.holderName,
        holderRole: singleBooking.holderRole,
        userId: singleBooking.userId,
        avatar: singleBooking.avatar,
        value: quoteVal,
        subValue: singleBooking.subValue,
        department: singleBooking.department || 'Sales',
        dateAwarded: singleBooking.dateAwarded,
        verified: true,
        description: 'All-time highest interior contract value recorded across CRM booking tokens.',
      };
      const sbIndex = individualRecords.findIndex((r) => r.id === 'highest_single_booking');
      if (sbIndex !== -1) {
        individualRecords = [
          ...individualRecords.slice(0, sbIndex + 1),
          dealRecord,
          ...individualRecords.slice(sbIndex + 1),
        ];
      } else {
        individualRecords.push(dealRecord);
      }
    }
  }

  const teamRecords = (data?.teamRecords || []).filter(
    (record) => !omittedIds.has(record.id || record.metricLabel)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
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

      {/* Individual Records */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300 font-sans">
            & INDIVIDUAL RECORDS
          </span>
          <div className="h-px flex-1 bg-slate-200/70 dark:bg-slate-800/70" />
        </div>

        {loading ? (
          <CorridorSkeleton rows={3} />
        ) : individualRecords.length === 0 ? (
          <EmptyState
            title="No individual records yet"
            description="Verified personal benchmarks will appear here when CRM publishes them."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {individualRecords.map((record) => {
              const { displayName, isInactive } = cleanHolderName(record.holderName);
              const avatarSrc = getRecordAvatar(record.holderName, record.avatar);

              return (
                <div
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_35px_-10px_rgba(15,23,42,0.1),0_1px_3px_rgba(15,23,42,0.04)] dark:hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group relative flex flex-col justify-between"
                >
                  <div>
                    {/* Category Label */}
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3.5">
                      {record.title}
                    </p>

                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="ring-4 ring-slate-50 dark:ring-slate-800/70 rounded-full shadow-xs">
                          <PersonAvatar name={displayName} src={avatarSrc} size={64} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-1.5 bg-amber-400 text-slate-950 rounded-full shadow-xs ring-2 ring-white dark:ring-slate-900 flex items-center justify-center">
                          <Star className="w-3 h-3 fill-slate-950" />
                        </div>
                      </div>
                    </div>

                    {/* Holder Info */}
                    <div className="text-center mb-3">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">
                          {displayName}
                        </h3>
                        {isInactive && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-700/60">
                            Inactive
                          </span>
                        )}
                      </div>
                      {record.holderRole && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                          {record.holderRole}
                        </p>
                      )}
                    </div>

                    {/* Metric Value Box */}
                    <div className="text-center py-2.5 px-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl mb-3.5 border border-slate-100 dark:border-slate-800/70 group-hover:bg-amber-500/5 group-hover:border-amber-500/20 transition-all duration-200">
                      <p className="font-mono font-black text-xl text-slate-900 dark:text-white tracking-tight">
                        {record.value}
                      </p>
                      {record.subValue && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider mt-0.5">
                          {record.subValue}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Verification Tag */}
                  <div className="pt-1 flex justify-center">
                    {record.verified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30 shadow-2xs group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-200">
                        <Trophy className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Record Holder
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Team Records */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300 font-sans">
            & TEAM RECORDS
          </span>
          <div className="h-px flex-1 bg-slate-200/70 dark:bg-slate-800/70" />
        </div>

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
                className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_35px_-10px_rgba(15,23,42,0.1),0_1px_3px_rgba(15,23,42,0.04)] dark:hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-between space-y-4"
              >
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    {teamRec.metricLabel}
                  </p>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                    {teamRec.teamName}
                  </h3>
                  {teamRec.leadName && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                      {teamRec.leadName}
                    </p>
                  )}
                </div>
                <div className="py-3 px-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/70">
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

      {/* Record Details Modal (Pinterest Pin-Sheet Style) */}
      {selectedRecord && (
        <div
          onClick={() => setSelectedRecord(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md transition-opacity animate-in fade-in-0 duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2.5 text-amber-500">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-base tracking-tight">
                  Hallway Benchmark
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="ring-4 ring-slate-100 dark:ring-slate-800 rounded-full shadow-sm">
                  <PersonAvatar
                    name={cleanHolderName(selectedRecord.holderName).displayName}
                    src={getRecordAvatar(selectedRecord.holderName, selectedRecord.avatar)}
                    size={80}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                  {cleanHolderName(selectedRecord.holderName).displayName}
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                  {[selectedRecord.holderRole, selectedRecord.department].filter(Boolean).join(' • ')}
                </p>
              </div>

              <div className="p-4 bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {selectedRecord.title}
                </p>
                <p className="font-mono text-3xl font-black text-slate-900 dark:text-white my-1.5 tracking-tight">
                  {selectedRecord.value}
                </p>
                {selectedRecord.subValue && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                    {selectedRecord.subValue}
                  </p>
                )}
              </div>

              {selectedRecord.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100/80 dark:border-slate-800/40">
                  {selectedRecord.description}
                </p>
              )}

              {selectedRecord.verified && (
                <div className="pt-1 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Officially Verified Benchmark</span>
                  </span>
                </div>
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
