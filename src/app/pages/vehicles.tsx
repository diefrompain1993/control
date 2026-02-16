import { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Plus, Search } from 'lucide-react';
import { useAuth } from '@/auth/authContext';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import { FilterBar } from '@/app/components/ui/filter-bar';
import { Input } from '@/app/components/ui/input';
import { DatePickerInput } from '@/app/components/ui/date-picker-input';
import { Select } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import {
  formatPlateNumber,
  formatPlateWithRegion,
  getPlateRegionCode,
  normalizePlateNumber
} from '@/app/utils/plate';
import {
  addStoredVehicle,
  getStoredVehicles,
  mergeVehicles,
  type StoredVehicle
} from '@/app/utils/vehicleStore';
import { formatDateInput, parseDateRange } from '@/app/utils/dateFilter';
import { addAuditLogEntry } from '@/app/utils/auditLog';
import { getCurrentTimestamp } from '@/auth/authService';
import { getNameWithInitials } from '@/app/utils/name';
import {
  getOwnerShortLabel,
  isOrganizationName,
  normalizeOrganizationName,
  normalizeOwnerName
} from '@/app/utils/ownerSearch';
import { getRoutePath } from '@/app/routesConfig';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/components/ui/dialog';
import { PLATE_COUNTRY_OPTIONS } from '@/app/data/plateCountries';

const categoryLabels: Record<StoredVehicle['category'], string> = {
  white: 'Белый список',
  black: 'Чёрный список',
  contractor: 'Подрядчики',
  unlisted: 'Нет в списках'
};

const eventStatusByCategory: Record<StoredVehicle['category'], string> = {
  white: 'Белый',
  black: 'Чёрный',
  contractor: 'Подрядчик',
  unlisted: 'Нет в списках'
};

const editableCategoryOptions = [
  { value: 'white', label: 'Белый список' },
  { value: 'black', label: 'Чёрный список' },
  { value: 'contractor', label: 'Подрядчики' }
];

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
  const { user } = useAuth();
  const canManage = user?.role === 'office_admin';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState({
    owner: '',
    plateNumber: '',
    region: '',
    country: '',
    notes: '',
    category: 'white'
  });
  const [errors, setErrors] = useState<{
    owner?: string;
    plateNumber?: string;
    category?: string;
  }>({});
  const [countrySuggestionsOpen, setCountrySuggestionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedPlateRowId, setSelectedPlateRowId] = useState<string | null>(null);
  const [selectedOwnerRowId, setSelectedOwnerRowId] = useState<string | null>(null);
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
  }, [refreshKey]);

  const plateSuggestions = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return [];
    const normalizedQuery = normalizePlateNumber(query);
    if (!normalizedQuery) return [];
    const unique = new Set<string>();
    const matches: string[] = [];

    vehicles.forEach((vehicle) => {
      const normalizedPlate = normalizePlateNumber(vehicle.plateNumber);
      if (!normalizedPlate.includes(normalizedQuery)) return;
      if (unique.has(vehicle.plateNumber)) return;
      unique.add(vehicle.plateNumber);
      matches.push(vehicle.plateNumber);
    });

    return matches.slice(0, 6);
  }, [vehicles, searchQuery]);

  const ownerSuggestions = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return [];
    const rawQuery = query.toLowerCase();
    const normalizedOwnerQuery = normalizeOwnerName(query);
    const normalizedOrgQuery = normalizeOrganizationName(query);
    const unique = new Map<string, string>();

    vehicles.forEach((vehicle) => {
      const owner = vehicle.owner.trim();
      if (!owner) return;
      const isOrg = isOrganizationName(owner);
      const ownerLabel = getOwnerShortLabel(owner);
      const normalizedOrgName = normalizeOrganizationName(owner);
      const matches = isOrg
        ? normalizedOrgQuery
          ? normalizedOrgName.startsWith(normalizedOrgQuery) || owner.toLowerCase().startsWith(rawQuery)
          : owner.toLowerCase().startsWith(rawQuery)
        : normalizedOwnerQuery
        ? normalizeOwnerName(ownerLabel).startsWith(normalizedOwnerQuery)
        : owner.toLowerCase().startsWith(rawQuery);

      if (!matches || unique.has(ownerLabel)) return;
      unique.set(ownerLabel, owner);
    });

    return Array.from(unique, ([label, value]) => ({ label, value })).slice(0, 6);
  }, [vehicles, searchQuery]);

  const selectedOwnerLabel = selectedOwner ? getOwnerShortLabel(selectedOwner) : '';
  const selectedPlateLabel = selectedPlate ? formatPlateNumber(selectedPlate) : '';
  const selectedVehicle = useMemo(() => {
    if (selectedPlateRowId) {
      return vehicles.find((vehicle) => vehicle.id === selectedPlateRowId);
    }
    return vehicles.find((vehicle) => vehicle.plateNumber === selectedPlate);
  }, [vehicles, selectedPlate, selectedPlateRowId]);
  const selectedStatus = selectedVehicle ? eventStatusByCategory[selectedVehicle.category] : '';
  const canViewEntries = Boolean(selectedPlate && selectedOwner);
  const filteredCountries = useMemo(() => {
    const query = form.country.trim().toLowerCase();
    if (!query) return PLATE_COUNTRY_OPTIONS;
    return PLATE_COUNTRY_OPTIONS.filter(
      (option) =>
        option.label.toLowerCase().startsWith(query) ||
        option.value.toLowerCase().startsWith(query)
    );
  }, [form.country]);

  const handleSelectPlate = (plate: string, rowId?: string) => {
    const isSameRow = rowId ? selectedPlateRowId === rowId : selectedPlate === plate;
    const nextPlate = isSameRow ? '' : plate;
    setSelectedPlate(nextPlate);
    setSelectedPlateRowId(isSameRow ? null : rowId ?? null);
  };

  const handleSelectOwner = (owner: string, rowId?: string) => {
    const isSameRow = rowId ? selectedOwnerRowId === rowId : selectedOwner === owner;
    const nextOwner = isSameRow ? '' : owner;
    setSelectedOwner(nextOwner);
    setSelectedOwnerRowId(isSameRow ? null : rowId ?? null);
  };

  const handleViewEntries = () => {
    if (!canViewEntries) return;
    const params = new URLSearchParams();
    params.set('plate', selectedPlate);
    params.set('owner', selectedOwner);
    if (selectedStatus) {
      params.set('status', selectedStatus);
    }
    const url = `${getRoutePath('events')}?${params.toString()}`;
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const filteredVehicles = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const normalizedQuery = normalizePlateNumber(rawQuery);
    const { start: dateStart, end: dateEnd } = parseDateRange(dateFilter);
    const startTimestamp = dateStart.length === 10 ? parseDateToTimestamp(dateStart) : null;
    const endTimestamp = dateEnd.length === 10 ? parseDateToTimestamp(dateEnd) : null;
    const hasRange = startTimestamp !== null && endTimestamp !== null;
    const matchesDateValue = (value: string) => {
      if (!dateStart && !dateEnd) return true;
      if (hasRange) {
        const valueTimestamp = parseDateToTimestamp(value);
        const min = Math.min(startTimestamp!, endTimestamp!);
        const max = Math.max(startTimestamp!, endTimestamp!);
        return valueTimestamp >= min && valueTimestamp <= max;
      }
      if (startTimestamp !== null) {
        return value === dateStart;
      }
      if (endTimestamp !== null) {
        return value === dateEnd;
      }
      const partial = dateStart || dateEnd;
      return partial ? value.startsWith(partial) : true;
    };

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !rawQuery ||
        vehicle.owner.toLowerCase().includes(rawQuery) ||
        (normalizedQuery
          ? normalizePlateNumber(vehicle.plateNumber).includes(normalizedQuery)
          : false);

      const matchesCategory = !categoryFilter || vehicle.category === categoryFilter;
      const matchesDate = matchesDateValue(vehicle.addedDate);

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
    setSelectedPlate('');
    setSelectedOwner('');
    setSelectedPlateRowId(null);
    setSelectedOwnerRowId(null);
  };

  const resetForm = () => {
    setForm({
      owner: '',
      plateNumber: '',
      region: '',
      country: '',
      notes: '',
      category: 'white'
    });
    setErrors({});
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleSave = () => {
    const trimmedOwner = form.owner.trim();
    const normalizedPlate = normalizePlateNumber(form.plateNumber);
    const trimmedRegion = form.region.trim();
    const trimmedCountry = form.country.trim();
    const regionValue = trimmedRegion || undefined;
    const countryValue = trimmedCountry || undefined;
    const nextErrors: typeof errors = {};

    if (!trimmedOwner) {
      nextErrors.owner = 'Введите данные владельца.';
    }

    if (!normalizedPlate) {
      nextErrors.plateNumber = 'Введите номер автомобиля.';
    }

    if (!form.category) {
      nextErrors.category = 'Выберите список.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const notesValue = form.notes.trim() || undefined;
    const category = form.category as StoredVehicle['category'];
    const timestamp = getCurrentTimestamp();
    const creatorName = getNameWithInitials(user?.fullName, '—');

    addStoredVehicle(category, {
      owner: trimmedOwner,
      plateNumber: normalizedPlate,
      region: regionValue,
      country: countryValue,
      notes: notesValue
    });

    addAuditLogEntry({
      timestamp,
      user: creatorName,
      action: 'Добавлен автомобиль',
      target: formatPlateWithRegion(normalizedPlate),
      details: `Список: ${categoryLabels[category]} · Владелец: ${trimmedOwner} · Регион: ${regionValue ?? '—'} · Страна: ${
        countryValue ?? '—'
      }`
    });

    setRefreshKey((prev) => prev + 1);
    setDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl mb-2">Все автомобили</h1>
          <p className="text-sm text-gray-600">
            Общий список автомобилей из белого, чёрного списка, подрядчиков и "Нет в списках".
          </p>
        </div>

        {canManage && (
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button icon={<Plus className="w-4 h-4" />}>Добавить автомобиль</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Добавление автомобиля</DialogTitle>
                <DialogDescription className="text-foreground font-medium">
                  Укажите данные владельца и автомобиля.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSave();
                }}
                className="space-y-4"
              >
                <div className="grid gap-4">
                  <div>
                    <Input
                      label="Владелец (ФИО или организация)"
                      value={form.owner}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, owner: value }));
                        if (errors.owner) {
                          setErrors((prev) => ({ ...prev, owner: undefined }));
                        }
                      }}
                      placeholder="Иванов Иван Иванович"
                    />
                    {errors.owner && (
                      <p className="mt-1 text-xs text-red-600">{errors.owner}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Номер"
                      value={form.plateNumber}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, plateNumber: value }));
                        if (errors.plateNumber) {
                          setErrors((prev) => ({ ...prev, plateNumber: undefined }));
                        }
                      }}
                      placeholder="А123ВС"
                    />
                    {errors.plateNumber && (
                      <p className="mt-1 text-xs text-red-600">{errors.plateNumber}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Регион"
                      value={form.region}
                      onChange={(value) => setForm((prev) => ({ ...prev, region: value }))}
                      placeholder="77"
                    />
                  </div>

                  <div className="relative">
                    <Input
                      label="Страна"
                      value={form.country}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, country: value }));
                        setCountrySuggestionsOpen(true);
                      }}
                      onFocus={() => setCountrySuggestionsOpen(true)}
                      onBlur={() => {
                        window.setTimeout(() => setCountrySuggestionsOpen(false), 120);
                      }}
                      placeholder="Россия (RUS)"
                    />
                    {countrySuggestionsOpen && filteredCountries.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-300 rounded text-sm shadow-lg z-20 overflow-hidden">
                        {filteredCountries.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className="w-full text-left px-3 py-2 transition-colors hover:bg-blue-50"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              setForm((prev) => ({ ...prev, country: option.label }));
                              setCountrySuggestionsOpen(false);
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Select
                      label="Список"
                      value={form.category}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, category: value }));
                        if (errors.category) {
                          setErrors((prev) => ({ ...prev, category: undefined }));
                        }
                      }}
                      options={editableCategoryOptions}
                      placeholder="Выберите список"
                      hidePlaceholderOption
                    />
                    {errors.category && (
                      <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Примечание"
                      value={form.notes}
                      onChange={(value) => setForm((prev) => ({ ...prev, notes: value }))}
                      placeholder="При необходимости"
                    />
                  </div>
                </div>

                <DialogFooter className="mt-3 justify-start sm:justify-start">
                  <Button type="submit">Создать</Button>
                  <Button variant="secondary" onClick={() => handleDialogChange(false)}>
                    Отмена
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <FilterBar>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[240px] max-w-[520px]">
            <div className="relative">
              <Input
                label="Поиск по номеру или владельцу"
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value);
                  setSearchSuggestionsOpen(value.trim().length > 0);
                  setSelectedPlate('');
                  setSelectedOwner('');
                  setSelectedPlateRowId(null);
                  setSelectedOwnerRowId(null);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setSearchSuggestionsOpen(true);
                  }
                }}
                onBlur={() => {
                  window.setTimeout(() => setSearchSuggestionsOpen(false), 120);
                }}
                placeholder="Введите номер или ФИО"
                icon={<Search className="w-4 h-4" />}
              />
              {searchSuggestionsOpen &&
                searchQuery.trim() !== '' &&
                (plateSuggestions.length > 0 || ownerSuggestions.length > 0) && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded text-sm shadow-lg z-20 overflow-hidden">
                    {plateSuggestions.length > 0 && (
                      <div className="px-3 pt-2 pb-1 text-[11px] uppercase text-muted-foreground">
                        Номера
                      </div>
                    )}
                    {plateSuggestions.map((plate) => {
                      const isSelected = selectedPlate === plate;
                      return (
                        <button
                          key={plate}
                          type="button"
                          className={`w-full text-left px-3 py-2 ${
                            isSelected
                              ? 'bg-slate-200 text-foreground'
                              : 'transition-colors hover:bg-blue-50'
                          }`}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setSearchQuery(formatPlateNumber(plate));
                            setSearchSuggestionsOpen(false);
                            setSelectedPlate('');
                            setSelectedOwner('');
                            setSelectedPlateRowId(null);
                            setSelectedOwnerRowId(null);
                          }}
                        >
                          {formatPlateNumber(plate)} ({getPlateRegionCode(plate)})
                        </button>
                      );
                    })}
                    {ownerSuggestions.length > 0 && (
                      <div className="px-3 pt-2 pb-1 text-[11px] uppercase text-muted-foreground">
                        Владельцы
                      </div>
                    )}
                    {ownerSuggestions.map((owner) => {
                      const isSelected = selectedOwner === owner.value;
                      return (
                        <button
                          key={owner.value}
                          type="button"
                          className={`w-full text-left px-3 py-2 ${
                            isSelected
                              ? 'bg-slate-200 text-foreground'
                              : 'transition-colors hover:bg-blue-50'
                          }`}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setSearchQuery(owner.label);
                            setSearchSuggestionsOpen(false);
                            setSelectedPlate('');
                            setSelectedOwner('');
                            setSelectedPlateRowId(null);
                            setSelectedOwnerRowId(null);
                          }}
                        >
                          {owner.label}
                        </button>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <DatePickerInput
              label="Дата добавления"
              value={dateFilter}
              onChange={(value) => setDateFilter(formatDateInput(value))}
              placeholder="ДД.ММ.ГГГГ"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
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
              size="md"
            />
          </div>

          <div className="flex items-end gap-2">
            <Button variant="destructive" onClick={handleResetFilters}>
              Сбросить фильтры
            </Button>
          </div>

          <div className="ml-auto flex items-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleViewEntries}
                    disabled={!canViewEntries}
                  >
                    Посмотреть въезды
                  </Button>
                </span>
              </TooltipTrigger>
              {!canViewEntries && (
                <TooltipContent side="top" sideOffset={6}>
                  Выберите номер, владельца (организацию)
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
        {(selectedPlate || selectedOwner) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {selectedPlate && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPlate('');
                  setSelectedPlateRowId(null);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700"
              >
                Номер: {selectedPlateLabel}
                <span className="text-[10px] leading-none">×</span>
              </button>
            )}
            {selectedOwner && (
              <button
                type="button"
                onClick={() => {
                  setSelectedOwner('');
                  setSelectedOwnerRowId(null);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-gray-700"
              >
                Владелец: {selectedOwnerLabel}
                <span className="text-[10px] leading-none">×</span>
              </button>
            )}
          </div>
        )}

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
                <th className="text-center py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Список
                </th>
                <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Номер
                </th>
                <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Владелец
                </th>
                <th className="text-center py-4 px-4 text-[12px] font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setDateSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                    className="inline-flex items-center justify-center gap-1 text-foreground/70 hover:text-foreground transition-colors text-[12px] font-bold uppercase tracking-wider"
                  >
                    Дата добавления
                    {dateSort === 'asc' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </th>
                <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Примечание
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedVehicles.length > 0 ? (
                sortedVehicles.map((vehicle) => {
                  const isUnlisted = vehicle.category === 'unlisted';
                  const ownerLabel = isUnlisted ? 'Неизвестно' : vehicle.owner;
                  const regionCode = getPlateRegionCode(vehicle.plateNumber);
                  const isPlateSelected = selectedPlateRowId === vehicle.id;
                  const isOwnerSelected = selectedOwnerRowId === vehicle.id;
                  const isSelectedRow = isPlateSelected || isOwnerSelected;

                  return (
                    <tr
                      key={vehicle.id}
                      className={`border-b border-border/50 ${
                        isSelectedRow ? 'bg-slate-200' : 'transition-smooth hover:bg-muted/30'
                      }`}
                    >
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${
                            categoryColors[vehicle.category]
                          }`}
                        >
                          {categoryLabels[vehicle.category]}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-foreground/90 plate-text">
                        <div className="inline-flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectPlate(vehicle.plateNumber, vehicle.id)}
                            className={`inline-flex items-center justify-center gap-2 rounded-lg px-[3px] py-1 ${
                              isPlateSelected ? 'bg-slate-300 text-foreground' : 'transition-colors hover:bg-muted/40'
                            }`}
                          >
                            {formatPlateNumber(vehicle.plateNumber)}
                            <span className="text-[11px] text-muted-foreground font-semibold">
                              ({regionCode})
                            </span>
                          </button>
                          {isUnlisted && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  aria-label="Плохо распознан номер"
                                  className="inline-flex items-center text-amber-500 opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 rounded-sm"
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
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-[14px] text-foreground/80">
                        <button
                          type="button"
                          onClick={() => handleSelectOwner(vehicle.owner, vehicle.id)}
                          className={`inline-flex items-center justify-center rounded-lg px-[3px] py-1 ${
                            isOwnerSelected ? 'bg-slate-300 text-foreground' : 'transition-colors hover:bg-muted/40'
                          }`}
                        >
                          {ownerLabel}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center text-[14px] text-foreground/80 font-mono transition-colors hover:text-foreground">
                        {vehicle.addedDate}
                      </td>
                      <td className="py-4 px-4 text-center text-[14px] text-foreground/70">
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
