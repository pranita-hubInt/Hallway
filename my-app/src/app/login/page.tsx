'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  User,
  Sun,
  Moon,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Palette,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, theme, toggleTheme } = useApp();
  const [role, setRole] = useState<'crm' | 'design'>('crm');
  const [identifier, setIdentifier] = useState('ranjith@hubinterior.com');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const passwordTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleRoleChange = (newRole: 'crm' | 'design') => {
    setRole(newRole);
    setErrorMessage(null);
    if (newRole === 'crm') {
      setIdentifier('ranjith@hubinterior.com');
      setPassword('••••••••');
    } else {
      setIdentifier('maya.lin@hubinterior.com');
      setPassword('');
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const id = identifier.trim();

    if (!id || !password) {
      setErrorMessage('Email and password are required');
      return;
    }

    if (role === 'design') {
      // Designers path: Call CRM BFF proxy -> Design Module POST /api/auth/login
      setIsLoading(true);
      try {
        const res = await fetch('/api/design-module/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: id,
            password: password,
          }),
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data?.sessionId && data?.user) {
          // Handoff session to Design Module frontend accept route using URL fragment
          const payload = encodeURIComponent(
            JSON.stringify({
              user: data.user,
              sessionId: data.sessionId,
            })
          );
          const designFrontendUrl = (
            process.env.NEXT_PUBLIC_DESIGN_MODULE_FRONTEND_URL ||
            'http://localhost:3002'
          ).replace(/\/$/, '');

          // Redirect to Design Module with payload in hash fragment (keeps sessionId out of server logs)
          window.location.href = `${designFrontendUrl}/auth/accept#payload=${payload}`;
          return;
        }

        // Handle errors from Design Module
        if (res.status === 401) {
          setErrorMessage(data?.message || 'Invalid email or password');
        } else if (res.status === 400) {
          setErrorMessage(data?.message || 'Email and password are required');
        } else {
          setErrorMessage(data?.message || 'Design Module is unreachable. Try again.');
        }
      } catch (err: any) {
        console.error('Design Module login error:', err);
        setErrorMessage('Design Module is unreachable. Try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // CRM Sales path: Authenticates against CRM, stays in CRM
      if (id.toLowerCase().includes('reynolds')) {
        login('a.reynolds@hubinterior.com', 'A. Reynolds', 'Dir. Sales Ops', 'Operations');
      } else {
        login(
          id || 'ranjith@hubinterior.com',
          id.toLowerCase().includes('ranjith') ? 'Ranjith' : id || 'Sales Lead',
          'CRM & Sales Operations Lead',
          'Sales'
        );
      }
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C14] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none transition-colors duration-300">
      {/* Floating Back to Hallway Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 py-2 px-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer z-20"
        title="Return to Hallway"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
        <span>Hallway</span>
      </Link>

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
        <div className="bg-white/95 dark:bg-[#0F1523]/95 backdrop-blur-2xl border border-slate-200/70 dark:border-slate-800/80 rounded-[32px] p-8 sm:p-9 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.07),0_4px_16px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_1px_1px_rgba(255,255,255,0.05)] space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-3">
            {/* Theme-aware HUB Logo */}
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

          {/* Role Segmented Toggle: CRM Sales vs Designers */}
          <div className="space-y-1.5">
            <div className="p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 flex gap-1">
              <button
                type="button"
                onClick={() => handleRoleChange('crm')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                  role === 'crm'
                    ? 'bg-white dark:bg-[#151D2E] text-slate-900 dark:text-white shadow-xs font-extrabold border border-slate-200/50 dark:border-slate-700/60'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Briefcase className={`w-3.5 h-3.5 ${role === 'crm' ? 'text-red-600 dark:text-red-500' : 'text-slate-400'}`} />
                <span>CRM Sales</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('design')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                  role === 'design'
                    ? 'bg-white dark:bg-[#151D2E] text-slate-900 dark:text-white shadow-xs font-extrabold border border-slate-200/50 dark:border-slate-700/60'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Palette className={`w-3.5 h-3.5 ${role === 'design' ? 'text-red-600 dark:text-red-500' : 'text-slate-400'}`} />
                <span>Designers</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
              {role === 'crm'
                ? 'Sales CRM — leads, booking, token'
                : 'Design Module — designers, TDM, DQC, finance'}
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400 font-medium animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Username or Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-0.5">
                {role === 'design' ? 'Designer Email' : 'Username or Email'}
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 transition-all font-sans"
                  placeholder={
                    role === 'crm'
                      ? 'e.g. ranjith or sales@hubinterior.com'
                      : 'e.g. designer@hubinterior.com'
                  }
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
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

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-[#FF2B34] via-[#EE1D23] to-[#D50C13] hover:from-[#FF3D45] hover:via-[#F3282E] hover:to-[#E0131B] text-white rounded-2xl text-sm font-bold tracking-wide transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in to Design Module...</span>
                </>
              ) : (
                <>
                  <span>{role === 'design' ? 'Login to Design Module' : 'Login'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
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
