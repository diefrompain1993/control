import { useEffect, useMemo, useState } from 'react';
import { Download, Package, ShieldAlert, ShieldCheck, Table, Users } from 'lucide-react';
import { PageHeader } from '@/app/components/ui/page-header';
import { DatePickerInput } from '@/app/components/ui/date-picker-input';
import { TimePickerInput } from '@/app/components/ui/time-picker-input';
import { Input } from '@/app/components/ui/input';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import { MOCK_EVENTS } from '@/app/data/events';
import { getStoredVehicles, mergeVehicles } from '@/app/utils/vehicleStore';
import { formatDateInput, parseDateRange } from '@/app/utils/dateFilter';
import { mockUsers } from '@/auth/mockUsers';

const exportOptions = [
  {
    id: 'events',
    title: 'Журнал въездов',
    description: 'Экспорт всех событий распознавания',
    icon: Table,
    accent: 'blue'
  },
  {
    id: 'white',
    title: 'Белый список',
    description: 'Экспорт списка разрешённых автомобилей',
    icon: ShieldCheck,
    accent: 'green'
  },
  {
    id: 'black',
    title: 'Чёрный список',
    description: 'Экспорт списка запрещённых автомобилей',
    icon: ShieldAlert,
    accent: 'red'
  },
  {
    id: 'contractors',
    title: 'Подрядчики',
    description: 'Экспорт списка автомобилей подрядчиков',
    icon: Package,
    accent: 'purple'
  },
  {
    id: 'users',
    title: 'Пользователи',
    description: 'Экспорт списка пользователей системы',
    icon: Users,
    accent: 'purple'
  }
] as const;

const formatOptions = [
  { id: 'csv', label: 'CSV (.csv)', ext: 'csv', mime: 'text/csv;charset=utf-8' },
  { id: 'json', label: 'JSON (.json)', ext: 'json', mime: 'application/json' },
  { id: 'xls', label: 'Excel (.xls)', ext: 'xls', mime: 'application/vnd.ms-excel' }
] as const;

const periodOptions = [
  { id: 'today', label: 'За сегодня', months: 0 },
  { id: '1m', label: 'За месяц', months: 1 },
  { id: '3m', label: 'За 3 месяца', months: 3 },
  { id: '6m', label: 'За полгода', months: 6 },
  { id: '12m', label: 'За год', months: 12 },
  { id: 'all', label: 'За всё время', months: 0 }
] as const;

type ExportOptionId = (typeof exportOptions)[number]['id'];
type ExportFormatId = (typeof formatOptions)[number]['id'];
type PeriodOptionId = (typeof periodOptions)[number]['id'];

type ExportRow = Record<string, string | number>;

type PeriodRange = {
  start: number | null;
  end: number;
};

const normalizeRangeToWholeDays = (range: PeriodRange): PeriodRange => {
  if (range.start === null) return range;
  const startDay = new Date(range.start);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(range.end);
  endDay.setHours(23, 59, 59, 999);
  return {
    start: startDay.getTime(),
    end: endDay.getTime()
  };
};

const parseDateToTimestamp = (value: string) => {
  const [day, month, year] = value.split('.').map((part) => Number(part));
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day).getTime();
};

const formatDateForPicker = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
};

const parseDateTimeToTimestamp = (date: string, time: string) => {
  const [day, month, year] = date.split('.').map((part) => Number(part));
  if (!day || !month || !year) return 0;
  const [hours = 0, minutes = 0, seconds = 0] = time
    .split(':')
    .map((part) => Number(part));
  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
};

const parseTimeToSeconds = (value: string) => {
  const [hours = 0, minutes = 0, seconds = 0] = value
    .split(':')
    .map((part) => Number(part));

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds) ||
    hours > 23 ||
    minutes > 59 ||
    seconds > 59
  ) {
    return null;
  }

  return hours * 3600 + minutes * 60 + seconds;
};

const parseDateTimeString = (value: string) => {
  const [datePart, timePart = '00:00:00'] = value.split(' ');
  return parseDateTimeToTimestamp(datePart, timePart);
};

const normalizeOrganizationName = (value: string) => {
  const cleaned = value
    .toLowerCase()
    .replace(/[\"'«»]/g, '')
    .replace(/[^a-zа-яё0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned
    .replace(/^(ооо|оао|зао|пао|ао|тоо|ип|чп|ooo|oao|zao|pao|ao)\s*/g, '')
    .trim();
};

const getPeriodRange = (periodId: PeriodOptionId): PeriodRange => {
  const now = new Date();
  const end = now.getTime();

  if (periodId === 'today') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return { start: startOfDay, end };
  }

  const period = periodOptions.find((option) => option.id === periodId);
  const months = period?.months ?? 0;
  if (!months) {
    return { start: null, end };
  }

  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - months);
  return { start: startDate.getTime(), end };
};

const isWithinPeriod = (timestamp: number, range: PeriodRange) => {
  if (!range.start) return true;
  return timestamp >= range.start && timestamp <= range.end;
};

const escapeCsvValue = (value: string | number) => {
  const text = String(value ?? '');
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
};

const toCsv = (rows: ExportRow[], headers: string[]) => {
  const headerLine = headers.map(escapeCsvValue).join(',');
  const lines = rows.map((row) => headers.map((key) => escapeCsvValue(row[key] ?? '')).join(','));
  return [headerLine, ...lines].join('\n');
};

const toXls = (rows: ExportRow[], headers: string[]) => {
  const headerCells = headers.map((header) => `<th>${header}</th>`).join('');
  const bodyRows = rows
    .map((row) => {
      const cells = headers.map((key) => `<td>${row[key] ?? ''}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');
  return `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body><table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></body></html>`;
};

const downloadFile = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const accentStyles = {
  blue: {
    border: 'border-blue-500',
    ring: 'ring-blue-200',
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
    text: 'text-blue-600'
  },
  green: {
    border: 'border-emerald-500',
    ring: 'ring-emerald-200',
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    text: 'text-emerald-600'
  },
  red: {
    border: 'border-red-500',
    ring: 'ring-red-200',
    iconBg: 'bg-red-50',
    iconText: 'text-red-500',
    text: 'text-red-500'
  },
  purple: {
    border: 'border-purple-500',
    ring: 'ring-purple-200',
    iconBg: 'bg-purple-50',
    iconText: 'text-purple-600',
    text: 'text-purple-600'
  }
};

export function ExportData() {
  const [selectedExport, setSelectedExport] = useState<ExportOptionId | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatId | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOptionId | null>(null);
  const [selectedContractor, setSelectedContractor] = useState('all');
  const [contractorInputValue, setContractorInputValue] = useState('');
  const [contractorSuggestionsOpen, setContractorSuggestionsOpen] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualDate, setManualDate] = useState('');
  const [manualTimeFrom, setManualTimeFrom] = useState('');
  const [manualTimeTo, setManualTimeTo] = useState('');

  const vehicles = useMemo(() => {
    const baseVehicles = [
      ...BASE_VEHICLES.white,
      ...BASE_VEHICLES.black,
      ...BASE_VEHICLES.contractor,
      ...BASE_VEHICLES.unlisted
    ];
    return mergeVehicles(baseVehicles, getStoredVehicles());
  }, []);

  const contractorOrganizations = useMemo(() => {
    const names = vehicles
      .filter((vehicle) => vehicle.category === 'contractor')
      .map((vehicle) => vehicle.owner.trim())
      .filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [vehicles]);

  const filteredContractorOrganizations = useMemo(() => {
    const query = contractorInputValue.trim().toLowerCase();
    if (!query) return contractorOrganizations;
    const normalizedQuery = normalizeOrganizationName(query);

    return contractorOrganizations.filter((name) => {
      const lowerName = name.toLowerCase();
      const normalizedName = normalizeOrganizationName(lowerName);

      if (normalizedQuery) {
        return (
          lowerName.startsWith(query) || normalizedName.startsWith(normalizedQuery)
        );
      }

      return lowerName.startsWith(query);
    });
  }, [contractorInputValue, contractorOrganizations]);

  useEffect(() => {
    if (selectedExport !== 'contractors') {
      setContractorSuggestionsOpen(false);
      return;
    }

    if (selectedContractor === 'all') {
      setContractorInputValue('');
      return;
    }

    const matched = contractorOrganizations.find(
      (owner) => owner.toLowerCase() === selectedContractor.toLowerCase()
    );
    if (matched) {
      setContractorInputValue(matched);
    }
  }, [selectedExport, selectedContractor, contractorOrganizations]);

  const manualDateParts = useMemo(() => parseDateRange(manualDate), [manualDate]);

  const supportsTimeFilter =
    Boolean(selectedExport) &&
    selectedExport !== 'white' &&
    selectedExport !== 'black';
  const manualStartDate = manualDateParts.start;
  const manualEndDate = manualDateParts.end;
  const hasManualStart = manualStartDate.length === 10;
  const hasManualEnd = manualEndDate.length === 10;
  const isManualSingleDay = hasManualStart && (!hasManualEnd || manualEndDate === manualStartDate);
  const isPresetToday = !manualMode && selectedPeriod === 'today' && supportsTimeFilter;
  const shouldApplyTimeFilter =
    supportsTimeFilter && ((manualMode && isManualSingleDay) || isPresetToday);
  const showPresetTimeInputs = !manualMode && isPresetToday;
  const showManualTimeInputs = manualMode && isManualSingleDay;
  const showManualTimeHint = manualMode && !isManualSingleDay && hasManualStart;
  const normalizedTimeFrom = manualTimeFrom.trim() || '00:00:00';
  const normalizedTimeTo = manualTimeTo.trim() || '23:59:59';

  const timeRangeError = useMemo(() => {
    if (!shouldApplyTimeFilter) return '';

    const fromSeconds = parseTimeToSeconds(normalizedTimeFrom);
    const toSeconds = parseTimeToSeconds(normalizedTimeTo);
    if (fromSeconds === null || toSeconds === null) {
      return 'Введите корректное время.';
    }
    if (fromSeconds > toSeconds) {
      return 'Время "с" не может быть позже времени "до".';
    }

    return '';
  }, [shouldApplyTimeFilter, normalizedTimeFrom, normalizedTimeTo]);
  const showTimeRangeError = Boolean(timeRangeError);

  const manualDateRange = useMemo(() => {
    if (!manualMode) return null;
    if (!hasManualStart) return null;
    if (manualEndDate && !hasManualEnd) return null;

    const endDate = hasManualEnd ? manualEndDate : manualStartDate;
    const startTimestamp = parseDateToTimestamp(manualStartDate);
    const endTimestamp = parseDateToTimestamp(endDate);
    if (!startTimestamp || !endTimestamp) return null;

    const startDay = Math.min(startTimestamp, endTimestamp);
    const endDay = Math.max(startTimestamp, endTimestamp) + 24 * 60 * 60 * 1000 - 1;
    return { start: startDay, end: endDay };
  }, [manualMode, hasManualEnd, hasManualStart, manualEndDate, manualStartDate]);

  const effectiveManualRange = useMemo(() => {
    if (!manualMode) return null;
    if (!manualDateRange) return null;
    if (!supportsTimeFilter || !isManualSingleDay) return manualDateRange;
    if (timeRangeError) return null;

    const startTimestamp = parseDateTimeToTimestamp(manualStartDate, normalizedTimeFrom);
    const endTimestamp = parseDateTimeToTimestamp(manualStartDate, normalizedTimeTo);
    if (!startTimestamp || !endTimestamp) return null;

    return { start: startTimestamp, end: endTimestamp };
  }, [
    manualMode,
    manualDateRange,
    supportsTimeFilter,
    isManualSingleDay,
    timeRangeError,
    manualStartDate,
    normalizedTimeFrom,
    normalizedTimeTo
  ]);

  const effectivePeriodRange = useMemo(() => {
    if (manualMode || !selectedPeriod) return null;
    if (!isPresetToday) {
      return getPeriodRange(selectedPeriod);
    }
    if (timeRangeError) return null;

    const today = formatDateForPicker(new Date());
    const start = parseDateTimeToTimestamp(today, normalizedTimeFrom);
    const end = parseDateTimeToTimestamp(today, normalizedTimeTo);
    if (!start || !end) return null;

    return { start, end };
  }, [
    manualMode,
    selectedPeriod,
    isPresetToday,
    timeRangeError,
    normalizedTimeFrom,
    normalizedTimeTo
  ]);

  const handleExport = () => {
    if (!selectedExport || !selectedFormat || (!selectedPeriod && !effectiveManualRange)) return;

    const range = manualMode ? effectiveManualRange : effectivePeriodRange;
    if (!range) return;

    let rows: ExportRow[] = [];
    let headers: string[] = [];
    let name = 'export';

    if (selectedExport === 'events') {
      const filtered = MOCK_EVENTS.filter((event) =>
        isWithinPeriod(parseDateTimeToTimestamp(event.date, event.time), range)
      );
      headers = ['Дата', 'Время', 'Камера', 'Номер', 'Владелец', 'Список'];
      rows = filtered.map((event) => ({
        Дата: event.date,
        Время: event.time,
        Камера: event.camera,
        Номер: event.plateNumber,
        Владелец: event.owner,
        Список: event.status
      }));
      name = 'events-log';
    }

    if (selectedExport === 'white' || selectedExport === 'black') {
      const target = selectedExport === 'white' ? 'white' : 'black';
      const normalizedRange = normalizeRangeToWholeDays(range);
      const filtered = vehicles.filter((vehicle) => vehicle.category === target);
      const byPeriod = filtered.filter((vehicle) =>
        isWithinPeriod(parseDateToTimestamp(vehicle.addedDate), normalizedRange)
      );
      headers = ['Номер', 'Регион', 'Страна', 'Владелец', 'Дата добавления', 'Примечание', 'Список'];
      rows = byPeriod.map((vehicle) => ({
        Номер: vehicle.plateNumber,
        Регион: vehicle.region ?? '—',
        Страна: vehicle.country ?? '—',
        Владелец: vehicle.owner,
        'Дата добавления': vehicle.addedDate,
        Примечание: vehicle.notes ?? '—',
        Список: target === 'white' ? 'Белый список' : 'Чёрный список'
      }));
      name = target === 'white' ? 'white-list' : 'black-list';
    }

    if (selectedExport === 'contractors') {
      const filtered = vehicles.filter((vehicle) => vehicle.category === 'contractor');
      const selectedContractorNormalized = selectedContractor.trim().toLowerCase();
      const normalizedRange = normalizeRangeToWholeDays(range);
      const byContractor =
        selectedContractor === 'all'
          ? filtered
          : filtered.filter(
              (vehicle) => vehicle.owner.trim().toLowerCase() === selectedContractorNormalized
            );
      const byPeriod = byContractor.filter((vehicle) =>
        isWithinPeriod(parseDateToTimestamp(vehicle.addedDate), normalizedRange)
      );
      headers = [
        'Номер',
        'Регион',
        'Страна',
        'Организация',
        'Дата добавления',
        'Срок доступа с',
        'Срок доступа до',
        'Примечание',
        'Список'
      ];
      rows = byPeriod.map((vehicle) => ({
        Номер: vehicle.plateNumber,
        Регион: vehicle.region ?? '—',
        Страна: vehicle.country ?? '—',
        Организация: vehicle.owner,
        'Дата добавления': vehicle.addedDate,
        'Срок доступа с': vehicle.accessFrom ?? '—',
        'Срок доступа до': vehicle.accessTo ?? '—',
        Примечание: vehicle.notes ?? '—',
        Список: 'Подрядчики'
      }));
      name = selectedContractor === 'all' ? 'contractors-list' : 'contractor';
    }

    if (selectedExport === 'users') {
      const filtered = mockUsers.filter((user) =>
        isWithinPeriod(parseDateTimeString(user.lastLogin), range)
      );
      headers = ['ФИО', 'Email', 'Роль', 'Последний вход'];
      rows = filtered.map((user) => ({
        ФИО: user.fullName,
        Email: user.email,
        Роль: user.role,
        'Последний вход': user.lastLogin
      }));
      name = 'users';
    }

    const format = formatOptions.find((option) => option.id === selectedFormat);
    if (!format) return;

    let content = '';
    if (format.id === 'json') {
      content = JSON.stringify(rows, null, 2);
    } else if (format.id === 'xls') {
      content = toXls(rows, headers);
      content = `\ufeff${content}`;
    } else {
      content = toCsv(rows, headers);
      content = `\ufeff${content}`;
    }

    const periodLabel = manualMode
      ? `manual-${manualDate.trim().replace(/\./g, '-') || 'custom'}`
      : periodOptions
          .find((option) => option.id === selectedPeriod)
          ?.label.replace(/\s+/g, '-')
          .toLowerCase();

    const filename = `${name}-${periodLabel ?? 'all'}.${format.ext}`;
    downloadFile(content, filename, format.mime);
  };

  const canExport = Boolean(
    selectedExport &&
      selectedFormat &&
      !timeRangeError &&
      (manualMode ? effectiveManualRange : effectivePeriodRange)
  );

  return (
    <>
      <PageHeader
        title="Экспорт данных"
        description="Выберите тип экспорта, формат файла и период"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const accent = accentStyles[option.accent];
          const isSelected = selectedExport === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedExport(option.id)}
              className={`text-left bg-white rounded-xl p-5 border transition-all duration-200 group ${
                isSelected
                  ? `${accent.border} ring-2 ${accent.ring} shadow-sm`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${accent.iconBg} ${accent.iconText}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{option.title}</h3>
                    {isSelected && (
                      <span className={`text-xs font-semibold uppercase ${accent.text}`}>
                        Выбрано
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 bg-white rounded-xl border border-border p-6">
        {!selectedExport ? (
          <div className="text-sm text-gray-600">Выберите вариант экспорта выше.</div>
        ) : (
          <div className="grid gap-6">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">Формат файла</div>
              <div className="flex flex-wrap gap-2">
                {formatOptions.map((format) => {
                  const isActive = selectedFormat === format.id;
                  return (
                    <button
                      key={format.id}
                      type="button"
                      onClick={() => setSelectedFormat(format.id)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {format.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">Период</div>
              <div className="flex flex-wrap gap-2">
                {periodOptions.map((period) => {
                  const isActive = selectedPeriod === period.id;
                  return (
                    <button
                      key={period.id}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(period.id);
                        setManualMode(false);
                      }}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {period.label}
                    </button>
                  );
                })}
              </div>

              {selectedExport === 'contractors' && (
                <div className="mt-4 relative max-w-[360px]">
                  <Input
                    label="Подрядчик"
                    value={contractorInputValue}
                    onChange={(value) => {
                      setContractorInputValue(value);
                      setContractorSuggestionsOpen(true);
                      const trimmed = value.trim();
                      setSelectedContractor(trimmed ? trimmed : 'all');
                    }}
                    onFocus={() => setContractorSuggestionsOpen(true)}
                    onBlur={() => {
                      window.setTimeout(() => setContractorSuggestionsOpen(false), 120);
                    }}
                    placeholder="Все подрядчики"
                    className="h-[36px]"
                  />

                  {contractorSuggestionsOpen && (
                    <div className="absolute left-0 right-0 top-full mt-2 max-h-36 overflow-y-auto rounded-lg border border-gray-300 bg-white text-[13px] shadow-lg z-20">
                      <button
                        type="button"
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-50 transition-colors"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setSelectedContractor('all');
                          setContractorInputValue('');
                          setContractorSuggestionsOpen(false);
                        }}
                      >
                        Все подрядчики
                      </button>

                      {filteredContractorOrganizations.map((owner) => (
                        <button
                          key={owner}
                          type="button"
                          className="w-full text-left px-3 py-1.5 hover:bg-blue-50 transition-colors"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setSelectedContractor(owner);
                            setContractorInputValue(owner);
                            setContractorSuggestionsOpen(false);
                          }}
                        >
                          {owner}
                        </button>
                      ))}

                      {filteredContractorOrganizations.length === 0 && (
                        <div className="px-3 py-1.5 text-gray-500">Ничего не найдено</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div
                className={`transition-[max-height,opacity,transform,margin] duration-300 ease-out ${
                  showPresetTimeInputs
                    ? 'mt-4 max-h-24 opacity-100 translate-y-0'
                    : 'mt-0 max-h-0 opacity-0 -translate-y-1 pointer-events-none'
                }`}
                style={{ overflow: 'hidden' }}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_260px] md:justify-start">
                  <TimePickerInput
                    label="Время с"
                    value={manualTimeFrom}
                    onChange={setManualTimeFrom}
                    placeholder="00:00:00"
                    className="h-[36px]"
                  />
                  <TimePickerInput
                    label="Время до"
                    value={manualTimeTo}
                    onChange={setManualTimeTo}
                    placeholder="23:59:59"
                    className="h-[36px]"
                  />
                </div>
              </div>

              <div
                className={`transition-[max-height,opacity,transform] duration-300 ease-out ${
                  manualMode
                    ? 'max-h-0 opacity-0 -translate-y-1 pointer-events-none'
                    : 'max-h-16 opacity-100 translate-y-0'
                }`}
                style={{ overflow: 'hidden' }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setManualMode(true);
                    setSelectedPeriod(null);
                  }}
                  className="mt-3 inline-flex items-center rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                  Выбор вручную
                </button>
              </div>

              <div
                className={`transition-[max-height,opacity,transform,margin] duration-300 ease-out ${
                  manualMode
                    ? 'mt-4 max-h-72 opacity-100 translate-y-0'
                    : 'mt-0 max-h-0 opacity-0 -translate-y-1 pointer-events-none'
                }`}
                style={{ overflow: 'hidden' }}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px] md:justify-start">
                  <DatePickerInput
                    label="Дата"
                    value={manualDate}
                    onChange={(value) => setManualDate(formatDateInput(value))}
                    placeholder="ДД.ММ.ГГГГ"
                    className="h-[36px]"
                  />
                </div>

                <div
                  className={`transition-[max-height,opacity,transform,margin] duration-300 ease-out ${
                    showManualTimeInputs
                      ? 'mt-4 max-h-24 opacity-100 translate-y-0'
                      : 'mt-0 max-h-0 opacity-0 -translate-y-1 pointer-events-none'
                  }`}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_260px] md:justify-start">
                    <TimePickerInput
                      label="Время с"
                      value={manualTimeFrom}
                      onChange={setManualTimeFrom}
                      placeholder="00:00:00"
                      className="h-[36px]"
                    />
                    <TimePickerInput
                      label="Время до"
                      value={manualTimeTo}
                      onChange={setManualTimeTo}
                      placeholder="23:59:59"
                      className="h-[36px]"
                    />
                  </div>
                </div>

                <div
                  className={`transition-[max-height,opacity,transform,margin] duration-300 ease-out ${
                    showManualTimeHint
                      ? 'mt-2 max-h-10 opacity-100 translate-y-0'
                      : 'mt-0 max-h-0 opacity-0 -translate-y-1 pointer-events-none'
                  }`}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="text-xs text-gray-500">
                    Время доступно только при выборе одного дня.
                  </p>
                </div>
              </div>

              <div
                className={`transition-[max-height,opacity,transform,margin] duration-300 ease-out ${
                  showTimeRangeError
                    ? 'mt-2 max-h-10 opacity-100 translate-y-0'
                    : 'mt-0 max-h-0 opacity-0 -translate-y-1 pointer-events-none'
                }`}
                style={{ overflow: 'hidden' }}
              >
                <p className="text-xs text-red-600">{timeRangeError}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-h-[40px] items-center text-sm text-gray-600">
                Выберите формат и период, затем нажмите экспорт.
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={!canExport}
                className={`inline-flex h-10 -translate-y-[8px] items-center gap-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  canExport
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" />
                Экспортировать
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


