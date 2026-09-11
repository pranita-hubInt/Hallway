'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Sun, Moon, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, theme, toggleTheme } = useApp();
  const [identifier, setIdentifier] = useState('ranjith@hubinterior.com');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const passwordTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleShowPassword = () => {
    if (showPassword) {
      setShowPassword(false);
      if (passwordTimerRef.current) clearTimeout(passwordTimerRef.current);
    } else {
      setShowPassword(true);
      if (passwordTimerRef.current) clearTimeout(passwordTimerRef.current);
      // Automatically mask password back after 3.5 seconds
      passwordTimerRef.current = setTimeout(() => {
        setShowPassword(false);
      }, 3500);
    }
  };

  useEffect(() => {
    return () => {
      if (passwordTimerRef.current) clearTimeout(passwordTimerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = identifier.trim();
    if (id.toLowerCase().includes('maya')) {
      login('maya.lin@hubinterior.com', 'Maya Lin', 'Lead Spatial Designer', 'Design');
    } else if (id.toLowerCase().includes('reynolds')) {
      login('a.reynolds@hubinterior.com', 'A. Reynolds', 'Dir. Sales Ops', 'Operations');
    } else {
      login(id || 'ranjith@hubinterior.com', id || 'Ranjith', 'CRM & Sales Operations Lead', 'Sales');
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C14] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none transition-colors duration-300">
      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer z-20"
        title="Toggle Theme"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
      </button>

      {/* Ambient background glows for Pinterest-inspired warm depth */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-rose-500/8 dark:bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-amber-500/8 dark:bg-slate-900/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-[430px] w-full z-10">
        {/* Pinterest-style Elevated Card */}
        <div className="bg-white/95 dark:bg-[#0F1523]/95 backdrop-blur-2xl border border-slate-200/70 dark:border-slate-800/80 rounded-[32px] p-8 sm:p-9 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.07),0_4px_16px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_1px_1px_rgba(255,255,255,0.05)] space-y-7">
          
          {/* Brand Header */}
          <div className="text-center space-y-3">
            {/* Theme-aware HUB Logo - Identical size and prominence in both Light and Dark themes */}
            <div className="flex justify-center items-center">
              <img
                src="/images/hub-logo-trimmed.png"
                alt="HUB"
                className="h-11 sm:h-12 w-auto object-contain transition-all duration-300 select-none"
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome to HUB
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Unified Portal for CRM &amp; Design Studios
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Username or Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-0.5">
                Username or Email
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 transition-all font-sans"
                  placeholder="e.g. ranjith or name@hubinterior.com"
                />
              </div>
            </div>

            {/* Field 2: Password with timed Eye Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5 ml-0.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-slate-50/80 hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 transition-all font-sans"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
                  title={showPassword ? 'Hide password' : 'View password for a few seconds'}
                  aria-label={showPassword ? 'Hide password' : 'View password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-red-500" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1 px-0.5">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-red-600 accent-red-600 focus:ring-red-500/30 cursor-pointer"
                />
                <span className="group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors font-medium">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={() => alert('Please contact your System Administrator or IT Support to reset your password.')}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Primary Submit Button: Login */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-[#FF2B34] via-[#EE1D23] to-[#D50C13] hover:from-[#FF3D45] hover:via-[#F3282E] hover:to-[#E0131B] text-white rounded-2xl text-sm font-bold tracking-wide transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </form>

          {/* Access Help / Support Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Not a member?{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Contact your Admin or TDM for access
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
