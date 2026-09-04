'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Palette, Briefcase, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, theme, toggleTheme } = useApp();
  const [email, setEmail] = useState('ranjith@hub.internal');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('maya')) {
      login('maya.lin@hub.internal', 'Maya Lin', 'Lead Spatial Designer', 'Design');
    } else if (email.includes('reynolds')) {
      login('a.reynolds@hub.internal', 'A. Reynolds', 'Dir. Sales Ops', 'Operations');
    } else {
      login(email, 'Ranjith', 'CRM & Sales Operations Lead', 'Sales');
    }
    router.push('/');
  };

  const handleQuickDemo = (userType: 'ranjith' | 'reynolds' | 'maya') => {
    if (userType === 'ranjith') {
      login('ranjith@hub.internal', 'Ranjith', 'CRM & Sales Operations Lead', 'Sales');
    } else if (userType === 'maya') {
      login('maya.lin@hub.internal', 'Maya Lin', 'Lead Spatial Designer', 'Design');
    } else {
      login('a.reynolds@hub.internal', 'A. Reynolds', 'Dir. Sales Ops', 'Operations');
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none transition-colors">
      {/* Theme toggle on login */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
      </button>

      {/* Ambient glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 shadow-xl shadow-rose-950/40 mb-2 font-black text-2xl text-white font-sans">
            H
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign in to Hallway
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            HUB Digital Corridor • CRM & Design Enterprise Suites
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-sans"
                  placeholder="name@hub.internal"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <span className="text-[11px] text-rose-500 hover:underline cursor-pointer">
                  Demo auto-auth
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-rose-500 focus:ring-rose-500"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter Corridor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Role Demo Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              One-Click Role Switcher
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('ranjith')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">Ranjith</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">CRM ERP Role</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('maya')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <Palette className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">Maya Lin</p>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 truncate">Design ERP Role</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
