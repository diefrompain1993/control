const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const RANGE_SPLIT_REGEX = /\s*[-\u2013\u2014]\s*/;
const RANGE_SEPARATOR_REGEX = /\s[-\u2013\u2014]|[-\u2013\u2014]\s/;

const clamp = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

const pad2 = (value: number) => String(value).padStart(2, '0');

const getMaxDaysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

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
  if (digits.length === 3) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }

  const dayRaw = digits.slice(0, 2);
  const monthRaw = digits.slice(2, 4);
  const yearRaw = digits.slice(4);
  const month = clamp(Number(monthRaw || '0'), 1, 12);
  const year = yearRaw.length === 4 ? Number(yearRaw) : new Date().getFullYear();
  const maxDay = getMaxDaysInMonth(year, month);
  const day = clamp(Number(dayRaw || '0'), 1, maxDay);
  const dayPart = pad2(day);
  const monthPart = pad2(month);

  if (!yearRaw) {
    return `${dayPart}.${monthPart}`;
  }
  return `${dayPart}.${monthPart}.${yearRaw}`;
};

export const formatDateInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (ISO_DATE_REGEX.test(trimmed)) {
    return formatSingleDateInput(normalizeSingleDate(trimmed));
  }

  if (RANGE_SEPARATOR_REGEX.test(trimmed)) {
    const parts = trimmed.split(RANGE_SPLIT_REGEX);
    if (parts.length >= 2) {
      const start = formatSingleDateInput(parts[0] ?? '');
      const end = formatSingleDateInput(parts[1] ?? '');
      if (!start && !end) return '';
      if (!end) return `${start} - `;
      return `${start} - ${end}`;
    }
  }

  const digits = value.replace(/\D/g, '').slice(0, 16);
  if (digits.length > 8) {
    const start = formatSingleDateInput(digits.slice(0, 8));
    const end = formatSingleDateInput(digits.slice(8));
    if (!start && !end) return '';
    if (end) return `${start} - ${end}`;
    return start;
  }

  return formatSingleDateInput(trimmed);
};

export const finalizeDateInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (ISO_DATE_REGEX.test(trimmed)) {
    return formatSingleDateInput(normalizeSingleDate(trimmed));
  }

  if (RANGE_SEPARATOR_REGEX.test(trimmed)) {
    const parts = trimmed.split(RANGE_SPLIT_REGEX);
    if (parts.length >= 2) {
      const startDigits = (parts[0] ?? '').replace(/\D/g, '');
      const endDigits = (parts[1] ?? '').replace(/\D/g, '');
      if (startDigits.length < 8) return '';
      const start = formatSingleDateInput(parts[0] ?? '');
      if (endDigits.length < 8) return start;
      const end = formatSingleDateInput(parts[1] ?? '');
      return `${start} - ${end}`;
    }
  }

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 8) return '';
  if (digits.length > 8) {
    const start = formatSingleDateInput(digits.slice(0, 8));
    const endDigits = digits.slice(8);
    if (endDigits.length < 8) return start;
    const end = formatSingleDateInput(endDigits);
    return `${start} - ${end}`;
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
