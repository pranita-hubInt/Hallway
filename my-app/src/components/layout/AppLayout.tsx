'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarCollapsed, isAuthenticated } = useApp();

  if (pathname === '/login' || !isAuthenticated) {
    return <main className="min-h-screen bg-slate-50 dark:bg-[#060B13] text-slate-900 dark:text-slate-100">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#060B13] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Sidebar />
      <Header />
      <main
        className={`flex-1 pt-16 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'pl-[76px]' : 'pl-[240px]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto p-5 sm:p-6 lg:p-7">
          {children}
        </div>
      </main>
    </div>
  );
}
