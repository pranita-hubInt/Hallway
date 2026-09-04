'use client';

import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WidgetActions() {
  const { actionItems, toggleActionItem } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const activeGroup = actionItems.find((g) => g.id === selectedGroup);

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans">
              My Actions
            </span>
          </div>
          <button
            onClick={() => setSelectedGroup(actionItems[0]?.id || null)}
            className="text-xs font-semibold text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {actionItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedGroup(item.id)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            >
              <div className="flex items-center gap-2 text-xs">
                {item.id === 'act-1' ? (
                  <span className="text-slate-400">👥</span>
                ) : (
                  <span className="text-slate-400">📄</span>
                )}
                <span className="font-medium text-slate-700 dark:text-slate-200">{item.title}</span>
              </div>
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                style={{ backgroundColor: item.badgeColor }}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items Interactive Checklist Modal */}
      {selectedGroup && activeGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{activeGroup.title}</h3>
                <p className="text-xs text-slate-400">{activeGroup.count} pending items</p>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {activeGroup.items.map((it) => (
                <div
                  key={it.id}
                  onClick={() => toggleActionItem(activeGroup.id, it.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-start gap-3 transition-all ${
                    it.done
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-400 line-through'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-rose-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                      it.done
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {it.done && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className="font-semibold">{it.name}</p>
                    <p className="text-[11px] text-slate-400">{it.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedGroup(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
