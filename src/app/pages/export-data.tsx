import { useMemo, useState } from 'react';
import { Download, ShieldAlert, ShieldCheck, Table, Users } from 'lucide-react';
import { PageHeader } from '@/app/components/ui/page-header';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import { MOCK_EVENTS } from '@/app/data/events';
import { getStoredVehicles, mergeVehicles } from '@/app/utils/vehicleStore';
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

const parseDateToTimestamp = (value: string) => {
  const [day, month, year] = value.split('.').map((part) => Number(part));
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day).getTime();
};

const parseDateTimeToTimestamp = (date: string, time: string) => {
  const [day, month, year] = date.split('.').map((part) => Number(part));
  if (!day || !month || !year) return 0;
  const [hours = 0, minutes = 0, seconds = 0] = time
    .split(':')
    .map((part) => Number(part));
  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
};

const parseDateTimeString = (value: string) => {
  const [datePart, timePart = '00:00:00'] = value.split(' ');
  return parseDateTimeToTimestamp(datePart, timePart);
};

const getPeriodRange = (periodId: PeriodOptionId): PeriodRange => {
  const now = new Date();
  const end = now.getTime();
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

  const vehicles = useMemo(() => {
    const baseVehicles = [
      ...BASE_VEHICLES.white,
      ...BASE_VEHICLES.black,
      ...BASE_VEHICLES.contractor,
      ...BASE_VEHICLES.unlisted
    ];
    return mergeVehicles(baseVehicles, getStoredVehicles());
  }, []);

  const handleExport = () => {
    if (!selectedExport || !selectedFormat || !selectedPeriod) return;

    const range = getPeriodRange(selectedPeriod);
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
      const filtered = vehicles.filter((vehicle) => vehicle.category === target);
      const byPeriod = filtered.filter((vehicle) =>
        isWithinPeriod(parseDateToTimestamp(vehicle.addedDate), range)
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

    const periodLabel = periodOptions.find((option) => option.id === selectedPeriod)?.label
      .replace(/\s+/g, '-')
      .toLowerCase();
    const filename = `${name}-${periodLabel ?? 'all'}.${format.ext}`;
    downloadFile(content, filename, format.mime);
  };

  const canExport = Boolean(selectedExport && selectedFormat && selectedPeriod);

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
                      onClick={() => setSelectedPeriod(period.id)}
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
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-h-[40px] items-center text-sm text-gray-600">
                Выберите формат и период, затем нажмите экспорт.
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={!canExport}
                className={`inline-flex h-10 -translate-y-[14px] items-center gap-2 px-4 rounded-lg text-sm font-medium transition-all ${
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
