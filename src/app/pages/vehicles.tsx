import { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import { FilterBar } from '@/app/components/ui/filter-bar';
import { Input } from '@/app/components/ui/input';
import { Select } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { formatPlateNumber, normalizePlateNumber } from '@/app/utils/plate';
import { getStoredVehicles, mergeVehicles, type StoredVehicle } from '@/app/utils/vehicleStore';
import { formatDateInput, normalizeDateInput } from '@/app/utils/dateFilter';

const categoryLabels: Record<StoredVehicle['category'], string> = {
  white: 'Белый список',
  black: 'Чёрный список',
  contractor: 'Подрядчики',
  unlisted: 'Нет в списках'
};

const categoryColors: Record<StoredVehicle['category'], string> = {
  white: 'bg-emerald-50 text-emerald-600',
  black: 'bg-red-50 text-red-600',
  contractor: 'bg-purple-50 text-purple-600',
  unlisted: 'bg-amber-50 text-amber-600'
};

const parseDateToTimestamp = (value: string) => {
  const [day, month, year] = value.split('.').map((part) => Number(part));
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day).getTime();
};

export function Vehicles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');

  const vehicles = useMemo(() => {
    const stored = getStoredVehicles();
    const baseVehicles = [
      ...BASE_VEHICLES.white,
      ...BASE_VEHICLES.black,
      ...BASE_VEHICLES.contractor,
      ...BASE_VEHICLES.unlisted
    ];
    return mergeVehicles(baseVehicles, stored);
  }, []);

  const filteredVehicles = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const normalizedQuery = normalizePlateNumber(rawQuery);
    const normalizedDate = normalizeDateInput(dateFilter);

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !rawQuery ||
        vehicle.owner.toLowerCase().includes(rawQuery) ||
        (normalizedQuery
          ? normalizePlateNumber(vehicle.plateNumber).includes(normalizedQuery)
          : false);

      const matchesCategory = !categoryFilter || vehicle.category === categoryFilter;
      const matchesDate = !normalizedDate || vehicle.addedDate.startsWith(normalizedDate);

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [vehicles, searchQuery, categoryFilter, dateFilter]);

  const sortedVehicles = useMemo(() => {
    const next = [...filteredVehicles];
    next.sort((a, b) => {
      const diff = parseDateToTimestamp(a.addedDate) - parseDateToTimestamp(b.addedDate);
      return dateSort === 'asc' ? diff : -diff;
    });
    return next;
  }, [filteredVehicles, dateSort]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setDateFilter('');
    setDateSort('desc');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Все автомобили</h1>
        <p className="text-sm text-muted-foreground">
          Общий список автомобилей из белого, чёрного списка, подрядчиков и "Нет в списках".
        </p>
      </div>

      <FilterBar>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
          <div className="max-w-[520px]">
            <Input
              label="Поиск по номеру или владельцу"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Введите номер или ФИО"
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Дата добавления"
            value={dateFilter}
            onChange={(value) => setDateFilter(formatDateInput(value))}
            placeholder="ДД.ММ.ГГГГ"
            type="text"
          />

          <Select
            label="Список"
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Все списки"
            options={[
              { value: 'white', label: 'Белый список' },
              { value: 'black', label: 'Чёрный список' },
              { value: 'contractor', label: 'Подрядчики' },
              { value: 'unlisted', label: 'Нет в списках' }
            ]}
            size="sm"
          />

          <div className="flex">
            <Button variant="destructive" onClick={handleResetFilters}>
              Сбросить фильтры
            </Button>
          </div>
        </div>

      </FilterBar>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground tracking-tight">Общий список</h2>
          <span className="text-sm text-muted-foreground">Всего: {sortedVehicles.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="text-left py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Список
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Номер
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Владелец
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setDateSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                    className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Дата добавления
                    {dateSort === 'asc' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </th>
                <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Примечание
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedVehicles.length > 0 ? (
                sortedVehicles.map((vehicle) => {
                  const isUnlisted = vehicle.category === 'unlisted';
                  const ownerLabel = isUnlisted ? 'Неизвестно' : vehicle.owner;

                  return (
                    <tr
                      key={vehicle.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-smooth"
                    >
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${
                            categoryColors[vehicle.category]
                          }`}
                        >
                          {categoryLabels[vehicle.category]}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[14px] font-semibold text-foreground/90 font-mono">
                        <span className="inline-flex items-center gap-2">
                          {formatPlateNumber(vehicle.plateNumber)}
                          {isUnlisted && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  aria-label="Плохо распознан номер"
                                  className="inline-flex items-center text-amber-500 opacity-80 animate-pulse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 rounded-sm"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                sideOffset={6}
                                className="tooltip-cloud"
                                arrowClassName="tooltip-cloud-arrow"
                                showArrow={false}
                              >
                                Плохо распознан номер
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[14px] text-foreground/80">
                        {ownerLabel}
                      </td>
                      <td className="py-4 px-4 text-[14px] text-foreground/80 font-mono transition-colors hover:text-foreground">
                        {vehicle.addedDate}
                      </td>
                      <td className="py-4 px-4 text-[14px] text-foreground/70">
                        {vehicle.notes || '—'}
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
      </div>
    </div>
  );
}
