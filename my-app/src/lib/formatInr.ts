export function formatInr(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

export function formatInrCompact(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return '₹0';
  const abs = Math.abs(n);
  if (abs >= 1_00_00_000) {
    return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (abs >= 1_00_000) {
    return `₹${(n / 1_00_000).toFixed(1)} L`;
  }
  return formatInr(n);
}

export function formatNumber(value: number | null | undefined, digits = 0): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number.isFinite(n) ? n : 0);
}

export function formatPercent(value: number | null | undefined, digits = 1): string {
  const n = Number(value ?? 0);
  return `${formatNumber(n, digits)}%`;
}

export function signedNumber(value: number | null | undefined, digits = 1): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n === 0) return formatNumber(0, digits);
  const prefix = n > 0 ? '+' : '';
  return `${prefix}${formatNumber(n, digits)}`;
}
