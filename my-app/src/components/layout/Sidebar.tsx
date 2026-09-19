'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart2,
  Award,
  Target,
  Users,
  Megaphone,
  Briefcase,
  Palette,
  ChevronLeft,
} from 'lucide-react';
import HowsLogo from '../common/HowsLogo';
import { useApp } from '../../context/AppContext';
import { openCrmDashboard, openDesignDashboard } from '../../lib/modulePortals';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, loginPortal, sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useApp();

  const isExpanded = !sidebarCollapsed;
  const isDesigner = loginPortal === 'design' || currentUser.department === 'Design';

  const mainNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Leaderboards', href: '/leaderboards', icon: BarChart2 },
    { name: 'Book of Records', href: '/records', icon: Award },
    { name: 'Targets', href: '/targets', icon: Target },
    { name: 'People', href: '/people', icon: Users },
    { name: 'Announcements', href: '/announcements', icon: Megaphone },
  ];

  return (
    <aside
      onClick={() => {
        if (sidebarCollapsed) {
          setSidebarCollapsed(false);
        }
      }}
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-[#0B1320] text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out select-none font-sans ${
        isExpanded ? 'w-[240px] shadow-lg' : 'w-[76px] shadow-xs cursor-pointer'
      }`}
    >
      {/* Brand Header with HOWS Logo and Collapse/Expand Toggle */}
      <div className="h-16 px-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 overflow-hidden">
        {isExpanded ? (
          <>
            <Link
              href="/"
              className="flex items-center min-w-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-1 transition-opacity duration-200 animate-in fade-in">
                <HowsLogo size={34} />
              </div>
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSidebar();
              }}
              title="Collapse sidebar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer ml-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
            title="Click to expand sidebar"
            className="w-10 h-10 rounded-xl border-2 border-sky-400 dark:border-sky-500 bg-sky-50 dark:bg-sky-950/40 p-1 flex flex-col justify-center items-center shadow-xs mx-auto shrink-0 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="flex justify-between w-full px-0.5 leading-none">
              <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">H</span>
              <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">O</span>
            </div>
            <div className="flex justify-between w-full px-0.5 leading-none mt-0.5">
              <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">W</span>
              <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">S</span>
            </div>
          </button>
        )}
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => e.stopPropagation()}
              title={!isExpanded ? item.name : undefined}
              className={`flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all group relative overflow-hidden ${
                isExpanded ? 'px-3.5 py-2.5 gap-3' : 'px-0 py-2.5 justify-center'
              } ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`flex items-center justify-center shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-10 h-10'}`}>
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}
                />
              </div>

              {isExpanded && (
                <span className="truncate flex-1 tracking-tight whitespace-nowrap animate-in fade-in duration-200">
                  {item.name}
                </span>
              )}

              {!isExpanded && isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-sky-500 rounded-r-full" />
              )}
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5">
          {isExpanded && (
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1 animate-in fade-in duration-150">
              Dashboards
            </span>
          )}
          {isDesigner ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openDesignDashboard();
              }}
              title={!isExpanded ? 'Design Module' : undefined}
              className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all group relative overflow-hidden text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer ${
                isExpanded ? 'px-3.5 py-2.5 gap-3' : 'px-0 py-2.5 justify-center'
              }`}
            >
              <div className={`flex items-center justify-center shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-10 h-10'}`}>
                <Palette className="w-4 h-4" />
              </div>
              {isExpanded && <span className="truncate flex-1 text-left">Design Module</span>}
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openCrmDashboard();
              }}
              title={!isExpanded ? 'CRM' : undefined}
              className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all group relative overflow-hidden text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer ${
                isExpanded ? 'px-3.5 py-2.5 gap-3' : 'px-0 py-2.5 justify-center'
              }`}
            >
              <div className={`flex items-center justify-center shrink-0 ${isExpanded ? 'w-5 h-5' : 'w-10 h-10'}`}>
                <Briefcase className="w-4 h-4" />
              </div>
              {isExpanded && <span className="truncate flex-1 text-left">CRM</span>}
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}
