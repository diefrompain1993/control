import { Calendar as CalendarIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { ru } from 'date-fns/locale';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { finalizeDateInput } from '@/app/utils/dateFilter';

interface DatePickerInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  mode?: 'range' | 'single';
}

const formatDateValue = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};

const formatLongDate = (date: Date) =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date);

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const parseSingleDateValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-').map((part) => Number(part));
    const parsed = new Date(year, month - 1, day);
    if (
      !Number.isNaN(parsed.getTime()) &&
      parsed.getDate() === day &&
      parsed.getMonth() === month - 1
    ) {
      return parsed;
    }
  }

  const parts = trimmed.split('.');
  if (parts.length === 3) {
    const [day, month, year] = parts.map((part) => Number(part));
    if (!day || !month || !year) return undefined;
    const parsed = new Date(year, month - 1, day);
    if (
      !Number.isNaN(parsed.getTime()) &&
      parsed.getDate() === day &&
      parsed.getMonth() === month - 1
    ) {
      return parsed;
    }
  }

  return undefined;
};

const RANGE_SPLIT_REGEX = /\s*[-\u2013\u2014]\s*/;
const RANGE_SEPARATOR_REGEX = /\s[-\u2013\u2014]|[-\u2013\u2014]\s/;

const parseRangeValue = (value: string): DateRange | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const singleDate = parseSingleDateValue(trimmed);
  if (singleDate) {
    return { from: singleDate };
  }

  if (RANGE_SEPARATOR_REGEX.test(trimmed)) {
    const parts = trimmed.split(RANGE_SPLIT_REGEX);
    if (parts.length >= 2) {
      const startDate = parseSingleDateValue(parts[0] ?? '');
      const endDate = parseSingleDateValue(parts[1] ?? '');

      if (startDate && endDate) {
        return { from: startDate, to: endDate };
      }
      if (startDate) {
        return { from: startDate };
      }
      if (endDate) {
        return { to: endDate };
      }
    }
  }

  return undefined;
};

const normalizeSingleInputValue = (value: string) => {
  if (!value) return '';
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const firstDashIndex = value.search(/[-\u2013\u2014]/);
  if (firstDashIndex >= 0) {
    return value.slice(0, firstDashIndex).trim();
  }
  const separatorMatch = value.match(RANGE_SEPARATOR_REGEX);
  if (!separatorMatch || separatorMatch.index === undefined) {
    return value;
  }
  return value.slice(0, separatorMatch.index).trim();
};

const finalizeSingleDateInput = (value: string) => {
  const normalized = normalizeSingleInputValue(value).trim();
  if (!normalized) return '';
  const parsed = parseSingleDateValue(normalized);
  if (!parsed) return normalized;
  return formatDateValue(parsed);
};

export function DatePickerInput({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
  mode = 'range'
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);
  const selectedRange = useMemo(() => parseRangeValue(value), [value]);
  const selectedDate = useMemo(() => parseSingleDateValue(value), [value]);
  const startLabel = selectedRange?.from ? formatLongDate(selectedRange.from) : '—';
  const endLabel = selectedRange?.to ? formatLongDate(selectedRange.to) : '—';
  const currentYear = new Date().getFullYear();
  const fromYear = 2025;
  const toYear = currentYear + 5;

  const handleSelect = (range: DateRange | undefined) => {
    if (!range || (!range.from && !range.to)) {
      onChange('');
      return;
    }

    const currentIsSingle =
      selectedRange?.from &&
      (!selectedRange.to || isSameDay(selectedRange.from, selectedRange.to));
    const nextIsSameSingle =
      currentIsSingle &&
      range.from &&
      isSameDay(range.from, selectedRange!.from!) &&
      (!range.to || isSameDay(range.from, range.to));

    if (nextIsSameSingle) {
      onChange('');
      return;
    }

    if (range.from && range.to) {
      if (isSameDay(range.from, range.to)) {
        onChange(formatDateValue(range.from));
      } else {
        onChange(`${formatDateValue(range.from)} - ${formatDateValue(range.to)}`);
      }
      return;
    }

    if (range.from) {
      onChange(formatDateValue(range.from));
      return;
    }

    if (range.to) {
      onChange(formatDateValue(range.to));
    }
  };

  const handleSelectSingle = (date: Date | undefined) => {
    if (!date) {
      onChange('');
      return;
    }

    if (selectedDate && isSameDay(selectedDate, date)) {
      onChange('');
      return;
    }

    onChange(formatDateValue(date));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      const finalized = mode === 'single' ? finalizeSingleDateInput(value) : finalizeDateInput(value);
      if (finalized !== value) {
        onChange(finalized);
      }
    }
    setOpen(nextOpen);
  };

  return (
    <div>
      {label && <label className="block text-sm text-gray-600 mb-2">{label}</label>}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <div className="relative" ref={inputWrapperRef}>
          <input
            type="text"
            value={value}
            onChange={(event) => {
              const nextValue =
                mode === 'single'
                  ? normalizeSingleInputValue(event.target.value)
                  : event.target.value;
              onChange(nextValue);
            }}
            onFocus={() => {
              if (!disabled) {
                setOpen(true);
              }
            }}
            onClick={() => {
              if (!disabled) {
                setOpen(true);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setOpen(false);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full pl-4 pr-10 py-2 border border-gray-300 rounded text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`}
          />
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Открыть календарь"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          align="start"
          className="w-[360px] p-0 overflow-hidden bg-white text-slate-900 border border-gray-200 shadow-xl"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            const target = event.target as Node | null;
            if (target && inputWrapperRef.current?.contains(target)) {
              event.preventDefault();
            }
          }}
        >
          <div className="flex items-center justify-between px-4 pt-3 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Закрыть
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Сбросить
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Готово
              </button>
            </div>
          </div>
          <div className="px-4 pb-3 pt-3 border-b border-gray-200">
            {mode === 'single' ? (
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500">Выбранная дата</div>
                <div
                  className={`text-lg font-semibold ${
                    selectedDate ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {selectedDate ? formatLongDate(selectedDate) : '—'}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">Дата начала</div>
                  <div
                    className={`text-lg font-semibold ${
                      selectedRange?.from ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {startLabel}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">Дата окончания</div>
                  <div
                    className={`text-lg font-semibold ${
                      selectedRange?.to ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {endLabel}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Calendar
            mode={mode}
            selected={mode === 'single' ? selectedDate : selectedRange}
            onSelect={mode === 'single' ? handleSelectSingle : handleSelect}
            locale={ru}
            weekStartsOn={1}
            captionLayout="dropdown"
            fromYear={fromYear}
            toYear={toYear}
            className="p-3 pt-2"
            labels={{
              labelMonthDropdown: () => 'Месяц',
              labelYearDropdown: () => 'Год'
            }}
            classNames={{
              months: 'flex flex-col gap-3',
              month: 'flex flex-col gap-2',
              caption: 'flex justify-center relative items-center',
              caption_dropdowns: 'flex items-center justify-center gap-4',
              caption_label:
                'text-lg font-semibold text-slate-900 inline-flex items-center gap-2',
              dropdown_month: 'relative',
              dropdown_year: 'relative',
              dropdown:
                'absolute inset-0 w-full h-full opacity-0 cursor-pointer text-slate-900 bg-white',
              dropdown_icon: 'text-slate-500',
              vhidden: 'hidden',
              nav: 'flex items-center gap-1',
              nav_button:
                'h-7 w-7 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100',
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse',
              head_row: 'flex w-full mt-2',
              head_cell: 'flex-1 text-slate-500 text-[11px] font-medium text-center',
              row: 'flex w-full mt-1',
              cell:
                'relative flex-1 p-0 flex items-center justify-center text-sm focus-within:relative focus-within:z-20',
              day: 'h-8 w-8 rounded-full text-slate-700 hover:bg-slate-100 transition-colors',
              day_selected:
                'bg-blue-600 text-white hover:bg-blue-500 focus:bg-blue-600 focus:text-white',
              day_today: 'text-blue-600',
              day_outside: 'text-slate-300',
              day_disabled: 'text-slate-300 opacity-50',
              day_range_start: 'bg-blue-600 text-white hover:bg-blue-500',
              day_range_end: 'bg-blue-600 text-white hover:bg-blue-500',
              day_range_middle: 'aria-selected:bg-blue-50 aria-selected:text-blue-700'
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
