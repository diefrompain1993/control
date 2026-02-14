import { Search, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { FilterBar } from '@/app/components/ui/filter-bar';
import { Input } from '@/app/components/ui/input';
import { Select } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import { getStoredAuditEntries, type AuditEntry } from '@/app/utils/auditLog';
import { formatDateInput, normalizeDateInput } from '@/app/utils/dateFilter';

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
  },
  {
    timestamp: '28.01.2025 08:45:03',
    user: 'Крылов Д. О.',
    action: 'Создан пользователь',
    target: 'Наблюдатель 1',
    details: 'Роль: Наблюдатель'
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

export function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const allEntries = useMemo(() => {
    const stored = getStoredAuditEntries();
    return [...stored, ...mockAuditLog];
  }, []);

  const filteredData = useMemo(() => {
    const normalizedDate = normalizeDateInput(dateFilter);

    return allEntries.filter((entry) => {
      const matchesSearch =
        searchQuery === '' ||
        entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.target.toLowerCase().includes(searchQuery.toLowerCase());

      const actionLower = entry.action.toLowerCase();
      const matchesAction =
        actionFilter === '' ||
        (actionFilter === 'add' &&
          (actionLower.includes('добав') || actionLower.includes('создан'))) ||
        (actionFilter === 'edit' && actionLower.includes('измен')) ||
        (actionFilter === 'delete' && actionLower.includes('удал'));

      const matchesDate = !normalizedDate || entry.timestamp.startsWith(normalizedDate);

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
    setCurrentPage(1);
  }, [searchQuery, actionFilter, dateFilter, dateSort]);

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
    setCurrentPage(1);
  };

  return (
    <>
      <PageHeader
        title="Журнал действий"
        description="История действий пользователей в системе"
      />

      <FilterBar>
        <form onSubmit={handleFilterSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
            <Input
              label="Поиск по пользователю или объекту"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Введите имя или объект"
              icon={<Search className="w-4 h-4" />}
            />

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
              size="sm"
            />

            <Input
              label="Дата"
              value={dateFilter}
              onChange={(value) => setDateFilter(formatDateInput(value))}
              placeholder="ДД.ММ.ГГГГ"
            />

            <div className="flex items-end gap-2">
              <Button type="submit">Применить</Button>
              <Button type="button" variant="destructive" onClick={handleResetFilters}>
                Сбросить
              </Button>
            </div>
          </div>
        </form>
      </FilterBar>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground tracking-tight">История действий</h2>
          <span className="text-sm text-muted-foreground">Всего: {sortedData.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="text-left py-4 px-4 text-[12px] font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setDateSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                    className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Дата и время
                    {dateSort === 'asc' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Действие
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Объект
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Детали
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pageData.length > 0 ? (
                pageData.map((entry, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/50 hover:bg-muted/30 transition-smooth"
                  >
                    <td className="py-4 px-4 text-[14px] text-foreground/80 font-mono transition-colors hover:text-foreground">
                      {entry.timestamp}
                    </td>
                    <td className="py-4 px-4 text-[14px] font-medium text-foreground">
                      {entry.user}
                    </td>
                    <td className="py-4 px-4 text-[14px] text-foreground/80">{entry.action}</td>
                    <td className="py-4 px-4 text-[14px] font-medium text-foreground">
                      {entry.target}
                    </td>
                    <td className="py-4 px-4 text-[14px] text-foreground/70">
                      {entry.details}
                    </td>
                  </tr>
                ))
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
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>

            {totalPages > 0 &&
              [...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}




