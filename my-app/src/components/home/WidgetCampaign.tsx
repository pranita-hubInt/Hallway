'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Flame } from 'lucide-react';

export default function WidgetCampaign() {
  // 48 hours countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 12, seconds: 35 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#063b2f] via-[#022c22] to-[#041d17] border border-emerald-500/30 p-5 text-white shadow-xl">
      {/* Background glow circle */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />

      {/* Sub-label */}
      <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1.5 font-sans">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>ACTIVE CAMPAIGN</span>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5 mb-1.5">
        <span>Fast Track Week</span>
        <Flame className="w-4 h-4 text-amber-400" />
      </h3>

      {/* Description */}
      <p className="text-xs text-emerald-200/90 leading-relaxed mb-4">
        Double commission on all deals closed before Friday 5 PM.
      </p>

      {/* Time Remaining Bar */}
      <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-emerald-300/80">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-medium">Time remaining</span>
        </div>
        <div className="font-mono text-sm sm:text-base font-extrabold text-white tracking-wider px-2 py-0.5 bg-emerald-950/60 rounded-md border border-emerald-500/30">
          {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </div>
      </div>
    </div>
  );
}
