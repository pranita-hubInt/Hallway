'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    searchQuery,
    setSearchQuery,
    notificationsCount,
    clearNotifications
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const getPageInfo = () => {
    if (pathname === '/leaderboards') return { module: 'HUB Velocity', title: 'Performance Leaderboards' };
    if (pathname === '/records') return { module: 'HUB Archive', title: 'Book of Records' };
    if (pathname === '/targets') return { module: 'HUB Operations', title: 'Operating Targets' };
    if (pathname === '/people') return { module: 'HUB Directory', title: 'People & Directory' };
    if (pathname === '/announcements') return { module: 'HUB Broadcasts', title: 'Announcements' };
    if (pathname === '/crm-erp') return { module: 'Hows Presales', title: 'Lead Management' };
    if (pathname === '/design-erp') return { module: 'Hows Design', title: '3D Spatial Studio' };
    return { module: 'HUB Live', title: 'Home Feed' };
  };

  const pageInfo = getPageInfo();

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white dark:bg-[#0B1320] border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6 transition-all duration-300 font-sans ${
        sidebarCollapsed ? 'left-[76px]' : 'left-[240px]'
      }`}
    >
      {/* Left: Breadcrumb Badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
          {pageInfo.module}
        </span>
        <span className="text-slate-300 dark:text-slate-600 text-xs font-bold">›</span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold border border-slate-200/80 dark:border-slate-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          <span>{pageInfo.title}</span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search HUB, members, records or leads... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100/90 dark:bg-[#101E33] border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right Action: Only Notifications Bell (Theme button removed from header as requested) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              if (notificationsCount > 0) clearNotifications();
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors relative border border-slate-200 dark:border-slate-700/60"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#EF4444] text-white text-[9px] font-black rounded-full shadow-xs">
                {notificationsCount > 9 ? '9+' : notificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Activity Alerts</span>
                <span className="text-[11px] text-sky-500 font-semibold cursor-pointer hover:underline" onClick={() => setIsNotifOpen(false)}>Done</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Rahul closed Deal #4828</p>
                  <p className="text-[11px] text-slate-400">Sarjapura Team booked ₹42L milestone</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
