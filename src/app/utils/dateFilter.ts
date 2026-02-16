const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const RANGE_SPLIT_REGEX = /\s*[-\u2013\u2014]\s*/;
const RANGE_SEPARATOR_REGEX = /\s[-\u2013\u2014]|[-\u2013\u2014]\s/;

const normalizeSingleDate = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (ISO_DATE_REGEX.test(trimmed)) {
    const [year, month, day] = trimmed.split('-');
    return `${day}.${month}.${year}`;
  }
  return trimmed.replace(/[/-]/g, '.');
};

export const normalizeDateInput = (value: string) => normalizeSingleDate(value);

const formatSingleDateInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (!digits) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
};

export const formatDateInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (ISO_DATE_REGEX.test(trimmed)) {
    return normalizeSingleDate(trimmed);
  }
  if (RANGE_SEPARATOR_REGEX.test(trimmed)) {
    const parts = trimmed.split(RANGE_SPLIT_REGEX);
    if (parts.length >= 2) {
      const start = formatSingleDateInput(parts[0] ?? '');
      const end = formatSingleDateInput(parts[1] ?? '');
      if (!start && !end) return '';
      if (end) return `${start} - ${end}`;
      return `${start} - `;
    }
  }
  return formatSingleDateInput(trimmed);
};

export const parseDateRange = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return { start: '', end: '' };
  if (ISO_DATE_REGEX.test(trimmed)) {
    return { start: normalizeSingleDate(trimmed), end: '' };
  }
  if (RANGE_SEPARATOR_REGEX.test(trimmed)) {
    const parts = trimmed.split(RANGE_SPLIT_REGEX);
    if (parts.length >= 2) {
      return {
        start: normalizeSingleDate(parts[0] ?? ''),
        end: normalizeSingleDate(parts[1] ?? '')
      };
    }
  }
  return { start: normalizeSingleDate(trimmed), end: '' };
};
