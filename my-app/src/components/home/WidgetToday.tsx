'use client';

import React, { useState } from 'react';
import { Calendar, ArrowRight, ExternalLink, Clock, MapPin } from 'lucide-react';
import { calendarEventsMock } from '../../data/mockData';

export default function WidgetToday() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sans">
              TODAY
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-semibold text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <span>View Calendar</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {calendarEventsMock.slice(0, 2).map((ev) => (
            <div key={ev.id} className="flex items-start gap-3 text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100 w-16 shrink-0 pt-0.5">
                {ev.time}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{ev.title}</p>
                {ev.isLink ? (
                  <a
                    href={ev.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-0.5 font-medium"
                  >
                    <span>{ev.location}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <p className="text-slate-400 text-[11px] mt-0.5">{ev.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Full Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">Today's Schedule</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {calendarEventsMock.map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {ev.time}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase font-semibold">
                      {ev.category}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">{ev.title}</p>
                  <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {ev.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
