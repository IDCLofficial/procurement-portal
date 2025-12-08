export const FormatDate = (dateInput?: string | Date | null): string => {
  if (!dateInput) return '-';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  if (!date || Number.isNaN(date.getTime())) {
    return typeof dateInput === 'string' ? dateInput : '-';
  }

  const day = date.toLocaleString('en-GB', { day: '2-digit' });
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();

  // Example: 11 Nov, 2024
  return `${day} ${month}, ${year}`;
}