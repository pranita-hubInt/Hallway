'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart2,
  Award,
  Target,
  Users,
  Megaphone,
  LineChart,
} from 'lucide-react';
import HowsLogo from '../common/HowsLogo';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const isDesigner = currentUser.department === 'Design';

  const mainNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Leaderboards', href: '/leaderboards', icon: BarChart2 },
    { name: 'Book of Records', href: '/records', icon: Award },
    { name: 'Targets', href: '/targets', icon: Target },
    { name: 'People', href: '/people', icon: Users },
    { name: 'Announcements', href: '/announcements', icon: Megaphone },
  ];

  // CRM ERP and Design ERP removed per requirement. Insights remains for presales/analytics.
  const erpItems = isDesigner
    ? []
    : [
        { name: 'Insights', href: '/insights', icon: LineChart, badge: 'CRM' },
      ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-[#0B1320] text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out select-none font-sans ${
        isHovered ? 'w-[240px] shadow-2xl' : 'w-[76px] shadow-xs'
      }`}
    >
      {/* Brand Header with HOWS Logo - No collapse/expand button */}
      <div className="h-16 px-3 flex items-center border-b border-slate-100 dark:border-slate-800/60 overflow-hidden">
        <Link href="/" className="flex items-center w-full">
          {isHovered ? (
            <div className="px-1 transition-opacity duration-200 animate-in fade-in">
              <HowsLogo size={34} />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl border-2 border-sky-400 dark:border-sky-500 bg-sky-50 dark:bg-sky-950/40 p-1 flex flex-col justify-center items-center shadow-xs mx-auto shrink-0">
              <div className="flex justify-between w-full px-0.5 leading-none">
                <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">H</span>
                <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">O</span>
              </div>
              <div className="flex justify-between w-full px-0.5 leading-none mt-0.5">
                <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">W</span>
                <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">S</span>
              </div>
            </div>
          )}
        </Link>
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
              title={!isHovered ? item.name : undefined}
              className={`flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all group relative overflow-hidden ${
                isHovered ? 'px-3.5 py-2.5 gap-3' : 'px-0 py-2.5 justify-center'
              } ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`flex items-center justify-center shrink-0 ${isHovered ? 'w-5 h-5' : 'w-10 h-10'}`}>
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}
                />
              </div>

              {isHovered && (
                <span className="truncate flex-1 tracking-tight whitespace-nowrap animate-in fade-in duration-200">
                  {item.name}
                </span>
              )}

              {!isHovered && isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-sky-500 rounded-r-full" />
              )}
            </Link>
          );
        })}

        {/* Dynamic ERP Module (Insights only - CRM ERP & Design ERP removed per requirement) */}
        {erpItems.length > 0 && (
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/60">
            {isHovered && (
              <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1 animate-in fade-in duration-150">
                Presales Module
              </span>
            )}

            {erpItems.map((erpItem) => {
              const isActive = pathname.startsWith(erpItem.href);
              const ErpIcon = erpItem.icon;

              return (
                <Link
                  key={erpItem.href}
                  href={erpItem.href}
                  title={!isHovered ? erpItem.name : undefined}
                  className={`flex items-center rounded-xl text-xs sm:text-sm font-bold transition-all group relative overflow-hidden ${
                    isHovered ? 'px-3.5 py-2.5 gap-3' : 'px-0 py-2.5 justify-center'
                  } ${
                    isActive
                      ? 'bg-[#EBF2FE] dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300/60 dark:border-sky-800/60'
                      : 'text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40'
                  }`}
                >
                  <div className={`flex items-center justify-center shrink-0 ${isHovered ? 'w-5 h-5' : 'w-10 h-10'}`}>
                    <ErpIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </div>

                  {isHovered && (
                    <span className="truncate flex-1 tracking-tight whitespace-nowrap animate-in fade-in duration-200">
                      {erpItem.name}
                    </span>
                  )}

                  {isHovered && erpItem.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase bg-sky-600 text-white shrink-0 animate-in fade-in duration-200">
                      {erpItem.badge}
                    </span>
                  )}

                  {!isHovered && isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-sky-600 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
