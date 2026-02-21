import { Search, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { FilterBar } from '@/app/components/ui/filter-bar';
import { Input } from '@/app/components/ui/input';
import { DatePickerInput } from '@/app/components/ui/date-picker-input';
import { Select } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/app/components/ui/dialog';
import { getStoredAuditEntries, type AuditEntry } from '@/app/utils/auditLog';
import { formatDateInput, parseDateRange } from '@/app/utils/dateFilter';

const mockAuditLog: AuditEntry[] = [
  {
    timestamp: '28.01.2025 10:30:15',
    user: 'Макаров И. С.',
    action: 'Добавлен автомобиль',
    target: 'А123ВС',
    details: 'Добавлен в чёрный список'
  },
  {
    timestamp: '28.01.2025 09:15:42',
    user: 'Соколова А. П.',
    action: 'Изменён статус',
    target: 'Х777ХХ',
    details: 'Переведён в белый список'
  }
];

const parseDateTimeToTimestamp = (value: string) => {
  const [datePart, timePart] = value.split(' ');
  if (!datePart || !timePart) return 0;
  const [day, month, year] = datePart.split('.').map((part) => Number(part));
  if (!day || !month || !year) return 0;
  const [hours = 0, minutes = 0, seconds = 0] = timePart
    .split(':')
    .map((part) => Number(part));
  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
};

const parseDateToTimestamp = (value: string) => {
  const [day, month, year] = value.split('.').map((part) => Number(part));
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day).getTime();
};

const normalizeText = (value: string) => value.toLowerCase().replaceAll('ё', 'е').trim();

const getAuditActionLabel = (entry: AuditEntry) => {
  const action = entry.action.trim();
  const actionNormalized = normalizeText(action);
  const detailsNormalized = normalizeText(entry.details);

  if (actionNormalized.includes('добавлен автомобиль')) return 'Добавление автомобиля';
  if (actionNormalized.includes('удален автомобиль')) return 'Удаление автомобиля';
  if (actionNormalized.includes('создан пользователь')) return 'Создание пользователя';
  if (actionNormalized.includes('удален пользователь')) return 'Удаление пользователя';
  if (actionNormalized.includes('изменен пароль')) return 'Изменение пароля пользователя';

  const isChangeAction =
    actionNormalized.startsWith('изменено') ||
    actionNormalized.startsWith('изменен') ||
    actionNormalized.startsWith('изменены');

  if (isChangeAction) {
    const userMarkers = ['фио:', 'роль:', 'email:', 'пароль:'];
    const vehicleMarkers = [
      'номер:',
      'регион:',
      'страна:',
      'срок доступа',
      'список:',
      'наименование:'
    ];

    if (userMarkers.some((marker) => detailsNormalized.includes(marker))) {
      return 'Изменение данных пользователя';
    }
    if (vehicleMarkers.some((marker) => detailsNormalized.includes(marker))) {
      return 'Изменение данных автомобиля';
    }
    return 'Изменение данных';
  }

  return action;
};

const getDetailsParts = (details: string) =>
  details
    .split(/\s*(?:·|В·)\s*/g)
    .map((part) => part.trim())
    .filter(Boolean);

export function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDetailsEntry, setSelectedDetailsEntry] = useState<AuditEntry | null>(null);
  const tableHostRef = useRef<HTMLDivElement | null>(null);
  const pageScrollByPageRef = useRef<Record<number, { top: number; stickBottom: boolean }>>({});
  const itemsPerPage = 10;

  const getMainScrollContainer = useCallback(() => {
    const host = tableHostRef.current;
    if (!host) return null;
    return host.closest('main') as HTMLElement | null;
  }, []);

  const rememberCurrentPageScroll = useCallback(
    (page: number) => {
      const container = getMainScrollContainer();
      if (!container) return;
      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
      const top = container.scrollTop;
      pageScrollByPageRef.current[page] = {
        top,
        stickBottom: maxScrollTop - top <= 8
      };
    },
    [getMainScrollContainer]
  );

  const handleTablePageChange = useCallback(
    (nextPage: number) => {
      if (nextPage === currentPage) return;
      rememberCurrentPageScroll(currentPage);
      setCurrentPage(nextPage);
    },
    [currentPage, rememberCurrentPageScroll]
  );

  const allEntries = useMemo(() => {
    const stored = getStoredAuditEntries();
    return [...stored, ...mockAuditLog];
  }, []);

  const filteredData = useMemo(() => {
    const { start: dateStart, end: dateEnd } = parseDateRange(dateFilter);
    const startTimestamp = dateStart.length === 10 ? parseDateToTimestamp(dateStart) : null;
    const endTimestamp = dateEnd.length === 10 ? parseDateToTimestamp(dateEnd) : null;
    const hasRange = startTimestamp !== null && endTimestamp !== null;
    const matchesDateValue = (timestamp: string) => {
      if (!dateStart && !dateEnd) return true;
      const datePart = timestamp.split(' ')[0] ?? '';
      if (hasRange) {
        const valueTimestamp = parseDateToTimestamp(datePart);
        const min = Math.min(startTimestamp!, endTimestamp!);
        const max = Math.max(startTimestamp!, endTimestamp!);
        return valueTimestamp >= min && valueTimestamp <= max;
      }
      if (startTimestamp !== null) {
        return datePart === dateStart;
      }
      if (endTimestamp !== null) {
        return datePart === dateEnd;
      }
      const partial = dateStart || dateEnd;
      return partial ? datePart.startsWith(partial) : true;
    };

    return allEntries.filter((entry) => {
      const matchesSearch =
        searchQuery === '' ||
        entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.target.toLowerCase().includes(searchQuery.toLowerCase());

      const actionLower = normalizeText(getAuditActionLabel(entry));
      const matchesAction =
        actionFilter === '' ||
        (actionFilter === 'add' &&
          (actionLower.includes('добав') || actionLower.includes('создан'))) ||
        (actionFilter === 'edit' && actionLower.includes('измен')) ||
        (actionFilter === 'delete' && actionLower.includes('удал'));

      const matchesDate = matchesDateValue(entry.timestamp);

      return matchesSearch && matchesAction && matchesDate;
    });
  }, [allEntries, searchQuery, actionFilter, dateFilter]);

  const sortedData = useMemo(() => {
    const next = [...filteredData];
    next.sort((a, b) => {
      const diff =
        parseDateTimeToTimestamp(a.timestamp) - parseDateTimeToTimestamp(b.timestamp);
      return dateSort === 'asc' ? diff : -diff;
    });
    return next;
  }, [filteredData, dateSort]);

  useEffect(() => {
    pageScrollByPageRef.current = {};
    setCurrentPage(1);
  }, [searchQuery, actionFilter, dateFilter, dateSort]);

  useEffect(() => {
    const container = getMainScrollContainer();
    const saved = pageScrollByPageRef.current[currentPage];
    if (!container || !saved) return;

    let rafA = 0;
    let rafB = 0;
    const restore = () => {
      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
      const targetTop = saved.stickBottom ? maxScrollTop : Math.min(saved.top, maxScrollTop);
      container.scrollTo({ top: targetTop, behavior: 'auto' });
    };

    rafA = window.requestAnimationFrame(() => {
      restore();
      rafB = window.requestAnimationFrame(restore);
    });

    return () => {
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, [currentPage, getMainScrollContainer]);

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleFilterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActionFilter('');
    setDateFilter('');
    setDateSort('desc');
    pageScrollByPageRef.current = {};
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader
        title="Журнал действий"
        description="История действий пользователей в системе"
      />

      <FilterBar>
        <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 items-end">
          <div className="w-[390px] flex-none">
            <Input
              label="Поиск по пользователю или объекту"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Введите имя или объект"
              icon={<Search className="w-4 h-4" />}
              className="h-[36px]"
            />
          </div>

          <div className="w-[220px] flex-none">
            <Select
              label="Тип действия"
              value={actionFilter}
              onChange={setActionFilter}
              placeholder="Все типы"
              options={[
                { value: 'add', label: 'Добавление' },
                { value: 'edit', label: 'Изменение' },
                { value: 'delete', label: 'Удаление' }
              ]}
              size="md"
              className="h-[36px]"
            />
          </div>

          <div className="w-56 min-w-[220px]">
            <DatePickerInput
              label="Дата"
              value={dateFilter}
              onChange={(value) => setDateFilter(formatDateInput(value))}
              placeholder="ДД.ММ.ГГГГ"
              className="h-[36px]"
            />
          </div>

          <div className="flex items-end gap-2">
            <Button type="submit" className="h-[36px] px-4">
              Применить
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleResetFilters}
              className="h-[36px] px-4"
            >
              Сбросить
            </Button>
          </div>
        </form>
      </FilterBar>

      <div ref={tableHostRef} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground tracking-tight">История действий</h2>
          <span className="text-sm text-muted-foreground">Всего: {sortedData.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[220px]" />
              <col className="w-[220px]" />
              <col className="w-[220px]" />
              <col className="w-[200px]" />
              <col className="w-[300px]" />
            </colgroup>
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="text-center py-4 px-4 text-[12px] font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setDateSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                    className="inline-flex items-center justify-center gap-1 text-foreground/70 hover:text-foreground transition-colors text-[12px] font-bold uppercase tracking-wider"
                  >
                    Дата и время
                    {dateSort === 'asc' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </th>
                <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Действие
                </th>
                <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Объект
                </th>
                <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Детали
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pageData.length > 0 ? (
                pageData.map((entry, index) => {
                  const actionLabel = getAuditActionLabel(entry);
                  return (
                    <tr
                      key={index}
                      className="h-14 border-b border-border/50 hover:bg-muted/30 transition-smooth"
                    >
                      <td className="h-14 px-4 align-middle text-center text-[14px] text-foreground/80 font-mono transition-colors hover:text-foreground">
                        <span className="block truncate">{entry.timestamp}</span>
                      </td>
                      <td className="h-14 px-4 align-middle text-center text-[14px] font-medium text-foreground">
                        <span className="block truncate">{entry.user}</span>
                      </td>
                      <td className="h-14 px-4 align-middle text-center text-[14px] text-foreground/80">
                        <span className="block truncate">{actionLabel}</span>
                      </td>
                      <td className="h-14 px-4 align-middle text-center text-[14px] font-medium text-foreground">
                        <span className="block truncate">{entry.target}</span>
                      </td>
                      <td className="h-14 px-4 align-middle text-center text-[14px] text-foreground/70">
                        <button
                          type="button"
                          onClick={() => setSelectedDetailsEntry(entry)}
                          className="text-[13px] font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-sm px-1"
                        >
                          Посмотреть детали
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Нет данных по заданным критериям
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-5 border-t border-border flex items-center justify-between bg-muted/20">
          <div className="text-sm font-medium text-muted-foreground">
            Всего записей: {sortedData.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTablePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>

            {totalPages > 0 &&
              [...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleTablePageChange(i + 1)}
                  className={`px-3 py-1 rounded text-sm transition-smooth ${
                    currentPage === i + 1
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border hover:bg-muted/50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

            <button
              onClick={() => handleTablePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={selectedDetailsEntry !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDetailsEntry(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали действия</DialogTitle>
            <DialogDescription>
              Полная информация по выбранной записи журнала.
            </DialogDescription>
          </DialogHeader>
          {selectedDetailsEntry && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-[160px_1fr] gap-x-3 gap-y-2">
                <span className="text-muted-foreground">Дата и время</span>
                <span className="font-medium text-foreground">{selectedDetailsEntry.timestamp}</span>
                <span className="text-muted-foreground">Пользователь</span>
                <span className="font-medium text-foreground">{selectedDetailsEntry.user}</span>
                <span className="text-muted-foreground">Действие</span>
                <span className="font-medium text-foreground">{getAuditActionLabel(selectedDetailsEntry)}</span>
                <span className="text-muted-foreground">Объект</span>
                <span className="font-medium text-foreground">{selectedDetailsEntry.target}</span>
              </div>
              <div className="rounded-md border border-border bg-muted/20 p-3 text-foreground/90">
                {getDetailsParts(selectedDetailsEntry.details).length > 1 ? (
                  <ul className="space-y-1.5">
                    {getDetailsParts(selectedDetailsEntry.details).map((part, index) => (
                      <li key={index} className="break-words leading-relaxed">
                        {part}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{selectedDetailsEntry.details}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}






