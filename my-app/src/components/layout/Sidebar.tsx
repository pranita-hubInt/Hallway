'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  BarChart2,
  Award,
  Target,
  Users,
  Megaphone,
  Briefcase,
  Palette,
  Sun,
  Moon,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import HowsLogo from '../common/HowsLogo';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    sidebarCollapsed,
    toggleSidebar,
    currentUser,
    switchUser,
    logout,
    theme,
    toggleTheme
  } = useApp();

  const isDesigner = currentUser.department === 'Design';

  const mainNavItems = [
    { name: 'Home', href: '/', icon: Home, badge: undefined },
    { name: 'Leaderboards', href: '/leaderboards', icon: BarChart2, badge: undefined },
    { name: 'Book of Records', href: '/records', icon: Award, badge: undefined },
    { name: 'Targets', href: '/targets', icon: Target, badge: undefined },
    { name: 'People', href: '/people', icon: Users, badge: undefined },
    { name: 'Announcements', href: '/announcements', icon: Megaphone, badge: undefined },
  ];

  const erpItem = isDesigner
    ? { name: 'Design ERP', href: '/design-erp', icon: Palette, badge: 'Studio' }
    : { name: 'CRM ERP', href: '/crm-erp', icon: Briefcase, badge: 'Presales' };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-[#0B1320] text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out select-none shadow-xs font-sans ${
        sidebarCollapsed ? 'w-[76px]' : 'w-[240px]'
      }`}
    >
      {/* Brand Header with HOWS Logo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          {!sidebarCollapsed ? (
            <HowsLogo size={34} />
          ) : (
            <div className="w-9 h-9 rounded-xl border-2 border-sky-400 dark:border-sky-500 bg-sky-50 dark:bg-sky-950/40 p-1 flex flex-col justify-center items-center shadow-xs">
              <div className="flex justify-between w-full px-0.5 leading-none">
                <span className="text-[9px] font-black text-sky-600 dark:text-sky-400">H</span>
                <span className="text-[9px] font-black text-sky-600 dark:text-sky-400">O</span>
              </div>
              <div className="flex justify-between w-full px-0.5 leading-none mt-0.5">
                <span className="text-[9px] font-black text-sky-600 dark:text-sky-400">W</span>
                <span className="text-[9px] font-black text-sky-600 dark:text-sky-400">S</span>
              </div>
            </div>
          )}
        </Link>

        {/* Sidebar Collapse/Expand Toggle */}
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0"
        >
          {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={sidebarCollapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group relative ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`} />

              {!sidebarCollapsed && (
                <span className="truncate flex-1 tracking-tight">{item.name}</span>
              )}

              {sidebarCollapsed && isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-sky-500 rounded-r-full" />
              )}
            </Link>
          );
        })}

        {/* Dynamic ERP Module below Announcements */}
        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/60">
          {!sidebarCollapsed && (
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              {isDesigner ? 'Design Module' : 'Presales Module'}
            </span>
          )}

          {(() => {
            const isActive = pathname.startsWith(erpItem.href);
            const ErpIcon = erpItem.icon;

            return (
              <Link
                href={erpItem.href}
                title={sidebarCollapsed ? erpItem.name : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all group relative ${
                  isActive
                    ? isDesigner
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300/60 dark:border-purple-800/60'
                      : 'bg-[#EBF2FE] dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300/60 dark:border-sky-800/60'
                    : isDesigner
                    ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                    : 'text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40'
                }`}
              >
                <ErpIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                {!sidebarCollapsed && (
                  <span className="truncate flex-1 tracking-tight">{erpItem.name}</span>
                )}
                {!sidebarCollapsed && erpItem.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                      isDesigner ? 'bg-purple-600 text-white' : 'bg-sky-600 text-white'
                    }`}
                  >
                    {erpItem.badge}
                  </span>
                )}
                {sidebarCollapsed && isActive && (
                  <span
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${
                      isDesigner ? 'bg-purple-600' : 'bg-sky-600'
                    }`}
                  />
                )}
              </Link>
            );
          })()}
        </div>
      </nav>

      {/* Bottom Profile / User Info Card with ONLY Theme Toggle & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/40">
        <div className={`bg-white dark:bg-[#0D1829] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 shadow-xs ${sidebarCollapsed ? 'p-1.5 text-center' : 'space-y-2.5'}`}>
          {/* User Details */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => switchUser()}
            title="Click to switch user role (Ranjith <-> Maya Lin <-> A. Reynolds)"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate hover:text-sky-600 transition-colors">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate leading-tight">
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>

          {/* Theme & Logout Action Row */}
          {!sidebarCollapsed && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* Single Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`py-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#0A1322] border-blue-500/40 text-blue-400 shadow-inner'
                    : 'bg-amber-50 border-amber-300 text-amber-600 shadow-xs'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-blue-400 fill-blue-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </button>

              {/* Red Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="py-2 px-2.5 rounded-xl bg-[#EF4444] hover:bg-rose-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
