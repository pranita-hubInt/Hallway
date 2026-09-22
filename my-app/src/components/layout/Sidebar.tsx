'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  ChevronRight,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { openCrmDashboard, openDesignDashboard } from '../../lib/modulePortals';

/** 4-tile launcher icon as in HOWS CRM */
function Hows4TileIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="12" height="12" rx="3.5" fill="#1DA1E6" />
      <rect x="18" y="2" width="12" height="12" rx="3.5" fill="#1DA1E6" />
      <rect x="2" y="18" width="12" height="12" rx="3.5" fill="#1DA1E6" />
      <rect x="18" y="18" width="12" height="12" rx="3.5" fill="#1DA1E6" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    loginPortal,
    sidebarCollapsed,
    isSidebarHovered,
    setIsSidebarHovered,
    theme,
    toggleTheme,
    logout,
  } = useApp();

  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moduleMenuRef = useRef<HTMLDivElement>(null);

  // Effective expanded state: either hovered or pinned
  const isExpanded = !sidebarCollapsed || isSidebarHovered || isModuleMenuOpen;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsSidebarHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Safety buffer (120ms) so quick cursor slips don't trigger jarring collapses
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isModuleMenuOpen) {
        setIsSidebarHovered(false);
      }
    }, 120);
  };

  // Close module popup on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moduleMenuRef.current && !moduleMenuRef.current.contains(e.target as Node)) {
        setIsModuleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isDesigner = loginPortal === 'design' || currentUser.department === 'Design';

  const mainNavItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Leaderboards', href: '/leaderboards', icon: BarChart2 },
    { name: 'Book of Records', href: '/records', icon: Award },
    { name: 'Targets', href: '/targets', icon: Target },
    { name: 'People', href: '/people', icon: Users },
    { name: 'Announcements', href: '/announcements', icon: Megaphone },
  ];

  // User initials (defaults to 'SA' for Super Admin, or derived from name)
  const userInitials = currentUser?.initials || (currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SA');

  const displayName = currentUser?.name || 'Super Admin';
  const displayRole = currentUser?.role?.replace(/-/g, '_').toUpperCase() || 'SUPER_ADMIN';

  const modulesList = [
    {
      id: 'crm',
      label: 'CRM',
      sub: 'Sales & Leads',
      iconSrc: '/icons/module-crm.png',
      onClick: () => {
        setIsModuleMenuOpen(false);
        openCrmDashboard();
      },
    },
    {
      id: 'design',
      label: 'Design Studio',
      sub: '3D & Projects',
      iconSrc: '/icons/module-design.png',
      onClick: () => {
        setIsModuleMenuOpen(false);
        openDesignDashboard();
      },
    },
    {
      id: 'hr',
      label: 'HR Portal',
      sub: 'Keka Attendance',
      iconSrc: '/icons/module-hr.svg',
      onClick: () => {
        setIsModuleMenuOpen(false);
        window.location.assign(process.env.NEXT_PUBLIC_HR_PORTAL_URL || 'https://hubinterior.keka.com/');
      },
    },
  ];

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-[#0B1320] text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out select-none font-sans ${
        isExpanded ? 'w-[240px] shadow-2xl' : 'w-[76px] shadow-xs'
      }`}
    >
      {/* Top Section: HOWS Logo */}
      <div className="h-16 px-3 flex items-center border-b border-slate-100 dark:border-slate-800/70 shrink-0 overflow-hidden">
        {isExpanded ? (
          <Link
            href="/"
            className="flex items-center gap-3 min-w-0 animate-in fade-in duration-200"
          >
            {/* HOWS Authentic Logo Image - wide, clear, and unconfined */}
            <div className="w-11 h-11 shrink-0 select-none flex items-center justify-center">
              <img
                src="/hows-logo.png?v=5"
                alt="HOWS Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col min-w-0 justify-center">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-extrabold text-slate-900 dark:text-white text-[16px] tracking-tight font-sans">
                  Hows ERP
                </span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-wide mt-0.5 truncate">
                Digital Corridor
              </span>
            </div>
          </Link>
        ) : (
          /* Collapsed Centered HOWS Logo */
          <Link
            href="/"
            title="Hows ERP"
            className="w-11 h-11 flex items-center justify-center mx-auto shrink-0 hover:scale-105 transition-transform cursor-pointer select-none"
          >
            <img
              src="/hows-logo.png?v=5"
              alt="HOWS Logo"
              className="w-full h-full object-contain"
            />
          </Link>
        )}
      </div>

      {/* ALL MODULES Launcher Card (Image 1 & 2) */}
      <div className="px-3 pt-3 pb-1 shrink-0 relative" ref={moduleMenuRef}>
        {isExpanded ? (
          <button
            type="button"
            onClick={() => setIsModuleMenuOpen(!isModuleMenuOpen)}
            title="Switch Module"
            className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 hover:bg-sky-50 dark:hover:bg-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all px-3 py-2 flex items-center justify-between shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <Hows4TileIcon className="w-5 h-5 transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">
                  ALL MODULES
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight mt-0.5 truncate">
                  {isDesigner ? 'DESIGN STUDIO' : 'CRM'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        ) : (
          /* Collapsed 4-tile Button */
          <button
            type="button"
            onClick={() => setIsModuleMenuOpen(!isModuleMenuOpen)}
            title="All Modules"
            className="w-11 h-11 mx-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 hover:bg-sky-50 dark:hover:bg-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all flex items-center justify-center cursor-pointer shadow-2xs group"
          >
            <Hows4TileIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
        )}

        {/* Floating Module Picker Popover */}
        {isModuleMenuOpen && (
          <div className="absolute left-3 right-3 top-full mt-1.5 z-50 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1829] shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
              Switch Module
            </div>
            <div className="space-y-1">
              {modulesList.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={m.onClick}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <img src={m.iconSrc} alt={m.label} className="w-5 h-5 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-850 dark:text-slate-100 truncate">
                      {m.label}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{m.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={!isExpanded ? item.name : undefined}
              className={`flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all group relative overflow-hidden ${
                isExpanded ? 'px-3.5 py-2.5' : 'px-0 py-2.5 justify-center'
              } ${
                isActive
                  ? 'bg-[#E8F1FD] dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`flex items-center justify-center shrink-0 ${isExpanded ? 'w-5 h-5 mr-3' : 'w-10 h-10'}`}>
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400'
                  }`}
                />
              </div>

              {isExpanded && (
                <>
                  <span className="truncate flex-1 tracking-tight whitespace-nowrap animate-in fade-in duration-150">
                    {item.name}
                  </span>

                  {/* Active Blue Dot Indicator (Image 2) */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 ml-1.5" />
                  )}
                </>
              )}
            </Link>
          );
        })}

        {/* Dashboards Section */}
        <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
          {isDesigner ? (
            <button
              type="button"
              onClick={openDesignDashboard}
              title={!isExpanded ? 'Design Module' : undefined}
              className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all group relative overflow-hidden text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer ${
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
              onClick={openCrmDashboard}
              title={!isExpanded ? 'CRM' : undefined}
              className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-semibold transition-all group relative overflow-hidden text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer ${
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

      {/* Bottom Section: Profile Card, Theme Toggle & Logout (Image 1 & 2) */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 shrink-0 bg-white/50 dark:bg-[#0B1320]/50">
        {isExpanded ? (
          /* Extended Bottom Section (Image 2) */
          <div className="p-3 space-y-2.5 animate-in fade-in duration-150">
            {/* User Profile Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 p-2.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Avatar with Initials "SA" */}
                <div className="w-9 h-9 rounded-full bg-[#E0EDFD] dark:bg-sky-950 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {userInitials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {displayName}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 truncate mt-0.5">
                    {displayRole}
                  </span>
                </div>
              </div>
              {/* Online Green Status Dot */}
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-100 dark:ring-emerald-950" />
            </div>

            {/* Action Row: Theme Toggle + Red Pill Logout Button */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="w-10 h-9 rounded-xl border border-amber-200/80 dark:border-slate-700 bg-amber-50/70 dark:bg-slate-800 flex items-center justify-center text-amber-500 hover:bg-amber-100/70 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-sky-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </button>

              {/* Red Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 h-9 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5 text-white" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          /* Collapsed Bottom Section (Image 1) */
          <div className="py-3 flex flex-col items-center gap-2.5 animate-in fade-in duration-150">
            {/* Circular Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-10 h-10 rounded-full border border-amber-200/80 dark:border-slate-700 bg-amber-50/70 dark:bg-slate-800 flex items-center justify-center text-amber-500 hover:scale-105 transition-transform cursor-pointer shadow-2xs"
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-sky-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {/* Circular User Avatar "SA" */}
            <div
              title={`${displayName} (${displayRole})`}
              className="w-10 h-10 rounded-full bg-[#E0EDFD] dark:bg-sky-950 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 font-black text-xs flex items-center justify-center shadow-2xs"
            >
              {userInitials}
            </div>

            {/* Circular Red Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="w-10 h-10 rounded-full bg-[#EF4444] hover:bg-red-600 text-white flex items-center justify-center shadow-xs hover:scale-105 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
