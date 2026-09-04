'use client';

import React from 'react';

export default function HowsLogo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* HOWS Stylized 2x2 Badge */}
      <div
        style={{ width: size, height: size }}
        className="rounded-xl border-2 border-sky-400 dark:border-sky-500 bg-sky-50/90 dark:bg-sky-950/40 p-1 flex flex-col justify-center items-center shadow-xs shrink-0 select-none"
      >
        <div className="flex justify-between w-full px-0.5 leading-none">
          <span className="text-[11px] font-black tracking-tight text-sky-600 dark:text-sky-400 font-sans">H</span>
          <span className="text-[11px] font-black tracking-tight text-sky-600 dark:text-sky-400 font-sans">O</span>
        </div>
        <div className="flex justify-between w-full px-0.5 leading-none mt-0.5">
          <span className="text-[11px] font-black tracking-tight text-sky-600 dark:text-sky-400 font-sans">W</span>
          <span className="text-[11px] font-black tracking-tight text-sky-600 dark:text-sky-400 font-sans">S</span>
        </div>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight font-sans">
            Hows ERP
          </span>
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-300/60 dark:border-sky-800">
            HUB
          </span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium tracking-wide mt-1 truncate">
          Digital Corridor
        </span>
      </div>
    </div>
  );
}
