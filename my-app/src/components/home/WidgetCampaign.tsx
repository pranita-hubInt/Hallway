'use client';

import React from 'react';

export default function WidgetCampaign() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#063b2f] via-[#022c22] to-[#041d17] border border-emerald-500/30 p-5 text-white shadow-xl">
      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1.5 font-sans">
        ACTIVE CAMPAIGN
      </div>
      <p className="text-xs text-emerald-200/90">No active campaign right now.</p>
    </div>
  );
}
