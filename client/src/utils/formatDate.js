import { format, parseISO, differenceInDays } from 'date-fns';

export const fmtDate = (date, fmt = 'MMM d, yyyy') => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, fmt);
  } catch {
    return '—';
  }
};

export const fmtDateRange = (start, end) => {
  if (!start) return '';
  if (!end) return fmtDate(start);
  return `${fmtDate(start, 'MMM d')} – ${fmtDate(end, 'MMM d, yyyy')}`;
};

export const daysBetween = (start, end) => {
  if (!start || !end) return 0;
  return Math.abs(differenceInDays(new Date(end), new Date(start))) + 1;
};
