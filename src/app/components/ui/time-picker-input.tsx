import { Clock } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';

interface TimePickerInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const pad = (value: number) => String(value).padStart(2, '0');

const clamp = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

const parseTimeValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?$/);
  if (!match) return null;
  const hours = clamp(Number(match[1]), 0, 23);
  const minutes = clamp(Number(match[2] ?? '0'), 0, 59);
  const seconds = clamp(Number(match[3] ?? '0'), 0, 59);
  return { hours, minutes, seconds };
};

const formatTimeInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 6);
  if (!digits) return '';
  const hours = clamp(Number(digits.slice(0, 2) || '0'), 0, 23);

  if (digits.length <= 2) {
    return digits.length === 2 ? pad(hours) : digits;
  }

  const minutesRaw = digits.slice(2, 4);
  const minutes = clamp(Number(minutesRaw || '0'), 0, 59);

  if (digits.length <= 4) {
    const minutesPart = digits.length === 3 ? digits.slice(2) : pad(minutes);
    return `${pad(hours)}:${minutesPart}`;
  }

  const secondsRaw = digits.slice(4, 6);
  const seconds = clamp(Number(secondsRaw || '0'), 0, 59);
  const secondsPart = digits.length === 5 ? digits.slice(4) : pad(seconds);
  return `${pad(hours)}:${pad(minutes)}:${secondsPart}`;
};

const buildTimeValue = (hours: number, minutes: number, seconds: number) =>
  `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

export function TimePickerInput({
  label,
  value,
  onChange,
  placeholder = '00:00:00',
  disabled = false,
  className
}: TimePickerInputProps) {
  const [open, setOpen] = useState(false);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);
  const parsed = useMemo(() => parseTimeValue(value), [value]);
  const hours = parsed?.hours ?? 0;
  const minutes = parsed?.minutes ?? 0;
  const seconds = parsed?.seconds ?? 0;
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const handlePick = (nextHours: number, nextMinutes: number, nextSeconds: number) => {
    onChange(buildTimeValue(nextHours, nextMinutes, nextSeconds));
  };

  const hoursList = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutesList = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const secondsList = minutesList;

  return (
    <div>
      {label && <label className="block text-sm text-gray-600 mb-2">{label}</label>}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <div className="relative" ref={inputWrapperRef}>
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(formatTimeInput(event.target.value))}
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
            className={`w-full pl-4 pr-10 py-2 border border-gray-300 rounded text-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`}
          />
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Открыть выбор времени"
            >
              <Clock className="w-4 h-4" />
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          align="start"
          className="w-[320px] p-0 overflow-hidden bg-white text-slate-900 border border-gray-200 shadow-xl"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            const target = event.target as Node | null;
            if (target && inputWrapperRef.current?.contains(target)) {
              event.preventDefault();
            }
          }}
        >
          <div className="flex items-center justify-between border-b border-gray-200 bg-slate-50/70 px-4 py-3 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-7 items-center rounded-md border border-slate-200 bg-white px-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Закрыть
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex h-7 items-center rounded-md border border-slate-200 bg-white px-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Сбросить
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-7 items-center rounded-md bg-blue-600 px-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Готово
              </button>
            </div>
          </div>
          <div className="px-4 pb-4 pt-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">
                  Часы
                </div>
                <div className="max-h-40 overflow-y-auto rounded border border-slate-200">
                  {hoursList.map((entry) => (
                    <button
                      key={`h-${entry}`}
                      type="button"
                      onClick={() => handlePick(entry, minutes, seconds)}
                      className={`w-full px-3 py-1.5 text-left text-sm transition-colors ${
                        entry === hours
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {pad(entry)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">
                  Минуты
                </div>
                <div className="max-h-40 overflow-y-auto rounded border border-slate-200">
                  {minutesList.map((entry) => (
                    <button
                      key={`m-${entry}`}
                      type="button"
                      onClick={() => handlePick(hours, entry, seconds)}
                      className={`w-full px-3 py-1.5 text-left text-sm transition-colors ${
                        entry === minutes
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {pad(entry)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">
                  Секунды
                </div>
                <div className="max-h-40 overflow-y-auto rounded border border-slate-200">
                  {secondsList.map((entry) => (
                    <button
                      key={`s-${entry}`}
                      type="button"
                      onClick={() => handlePick(hours, minutes, entry)}
                      className={`w-full px-3 py-1.5 text-left text-sm transition-colors ${
                        entry === seconds
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {pad(entry)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
