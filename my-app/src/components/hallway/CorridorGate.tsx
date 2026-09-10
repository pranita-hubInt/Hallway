'use client';

import React from 'react';
import { CrmApiError } from '../../lib/crmApi';

export function corridorErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof CrmApiError) {
    if (error.status === 401) return error.message || 'CRM authorization failed.';
    if (error.status === 403) return error.message || 'You do not have access to this corridor.';
    if (error.status === 400) return error.message || 'Bad request.';
    if (error.status === 503) {
      return error.message || 'Hub CRM is unreachable. Confirm Project-ERP is running on http://localhost:8081.';
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'CRM request failed';
}

export function CorridorGate({ children }: { children: React.ReactNode; title?: string; description?: string; error?: unknown }) {
  return <>{children}</>;
}

export function CorridorBanner({ error }: { error: unknown }) {
  const message = corridorErrorMessage(error);
  if (!message) return null;
  return (
    <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-xs font-semibold text-rose-600">
      {message}
    </div>
  );
}

export function CorridorSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      ))}
    </div>
  );
}

export function PersonAvatar({
  name,
  src,
  size = 36,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      className="rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold inline-flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-700"
    >
      {initials || '—'}
    </div>
  );
}

export function displayRate(value: number | string | null | undefined): string {
  if (value == null || value === '') return '—';
  return `${value}%`;
}
