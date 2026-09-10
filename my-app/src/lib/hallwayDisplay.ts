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
