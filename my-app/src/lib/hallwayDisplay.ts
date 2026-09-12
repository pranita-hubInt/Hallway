export function istYmd(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function istMonthBounds() {
  const today = istYmd();
  const [year, month] = today.split('-');
  return { dateFrom: `${year}-${month}-01`, dateTo: today };
}

export function milestoneLabel(item: { name?: string; key?: string }): string {
  return item.name || item.key || 'Unknown';
}

export function progressWidth(value: number | null | undefined): string {
  if (value == null || Number.isNaN(Number(value))) return '0%';
  return `${Math.max(0, Math.min(100, Number(value)))}%`;
}

export function formatRelativeTime(dateInput?: string | Date | null): string {
  if (!dateInput) return 'Just now';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return typeof dateInput === 'string' ? dateInput : 'Just now';
  }
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0 || diffMs < 45_000) return 'Just now';
  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

