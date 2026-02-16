import { Plus, Search, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, PencilLine, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { FilterBar } from '@/app/components/ui/filter-bar';
import { Input } from '@/app/components/ui/input';
import { DatePickerInput } from '@/app/components/ui/date-picker-input';
import { Select } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { useAuth } from '@/auth/authContext';
import {
    formatPlateNumber,
  formatPlateWithCountryCode,
  getPlateCountryCode,
  normalizePlateNumber
} from '@/app/utils/plate';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import {
  addStoredVehicle,
  deleteVehicleById,
  getStoredVehicles,
  mergeVehicles,
  type StoredVehicle,
  updateVehicleById
} from '@/app/utils/vehicleStore';
import { addAuditLogEntry } from '@/app/utils/auditLog';
import { getCurrentTimestamp } from '@/auth/authService';
import { getNameWithInitials } from '@/app/utils/name';
import { formatDateInput, parseDateRange } from '@/app/utils/dateFilter';
import {
  getOwnerShortLabel,
  isOrganizationName,
  normalizeOrganizationName,
  normalizeOwnerName
} from '@/app/utils/ownerSearch';
import { getRoutePath } from '@/app/routesConfig';
import { PLATE_COUNTRY_OPTIONS } from '@/app/data/plateCountries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/components/ui/dialog';

const parseDateToTimestamp = (value: string) => {
  const [day, month, year] = value.split('.').map((part) => Number(part));
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day).getTime();
};

const DEFAULT_CATEGORY: StoredVehicle['category'] = 'black';

const categoryOptions = [
  { value: 'white', label: 'Белый список' },
  { value: 'black', label: 'Чёрный список' },
  { value: 'contractor', label: 'Подрядчики' }
];

const categoryAuditLabels: Record<StoredVehicle['category'], string> = {
  white: 'Белый',
  black: 'Чёрный',
  contractor: 'Подрядчики',
  unlisted: 'Нет в списках'
};
export function BlackList() {
  const { user } = useAuth();
  const canManage = user?.role === 'office_admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [rowChipClosingIds, setRowChipClosingIds] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [isLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingVehicle, setEditingVehicle] = useState<StoredVehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<StoredVehicle | null>(null);
  const deleteClearTimeoutRef = useRef<number | null>(null);
  const [form, setForm] = useState({
    owner: '',
    plateNumber: '',
    region: '',
    country: '',
    notes: '',
    category: DEFAULT_CATEGORY
  });
  const [errors, setErrors] = useState<{
    owner?: string;
    plateNumber?: string;
    region?: string;
    country?: string;
    category?: string;
  }>({});
  const [countrySuggestionsOpen, setCountrySuggestionsOpen] = useState(false);

  const vehicles = useMemo(() => {
    const baseVehicles = [
      ...BASE_VEHICLES.white,
      ...BASE_VEHICLES.black,
      ...BASE_VEHICLES.contractor
    ];
    return mergeVehicles(baseVehicles, getStoredVehicles());
  }, [refreshKey]);

  const categoryVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.category === DEFAULT_CATEGORY),
    [vehicles]
  );

  const plateCountryMap = useMemo(() => {
    const map = new Map<string, string>();
    categoryVehicles.forEach((vehicle) => {
      if (!map.has(vehicle.plateNumber) && vehicle.country) {
        map.set(vehicle.plateNumber, vehicle.country);
      }
    });
    return map;
  }, [categoryVehicles]);

  const plateSuggestions = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return [];
    const normalizedQuery = normalizePlateNumber(query);
    if (!normalizedQuery) return [];
    const unique = new Set<string>();
    const matches: string[] = [];

    categoryVehicles.forEach((vehicle) => {
      const normalizedPlate = normalizePlateNumber(vehicle.plateNumber);
      if (!normalizedPlate.includes(normalizedQuery)) return;
      if (unique.has(vehicle.plateNumber)) return;
      unique.add(vehicle.plateNumber);
      matches.push(vehicle.plateNumber);
    });

    return matches.slice(0, 6);
  }, [categoryVehicles, searchQuery]);

  const ownerSuggestions = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return [];
    const rawQuery = query.toLowerCase();
    const normalizedOwnerQuery = normalizeOwnerName(query);
    const normalizedOrgQuery = normalizeOrganizationName(query);
    const unique = new Map<string, string>();

    categoryVehicles.forEach((vehicle) => {
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
  }, [categoryVehicles, searchQuery]);

  const selectedVehicles = useMemo(
    () =>
      selectedRowIds
        .map((id) => vehicles.find((vehicle) => vehicle.id === id))
        .filter((vehicle): vehicle is StoredVehicle => Boolean(vehicle)),
    [vehicles, selectedRowIds]
  );
  const selectedPlateSet = useMemo(
    () => new Set(selectedVehicles.map((vehicle) => vehicle.plateNumber)),
    [selectedVehicles]
  );
  const selectedOwnerSet = useMemo(
    () => new Set(selectedVehicles.map((vehicle) => vehicle.owner)),
    [selectedVehicles]
  );
  const filteredCountries = useMemo(() => {
    const query = form.country.trim().toLowerCase();
    if (!query) return PLATE_COUNTRY_OPTIONS;
    return PLATE_COUNTRY_OPTIONS.filter(
      (option) =>
        option.label.toLowerCase().startsWith(query) ||
        option.value.toLowerCase().startsWith(query)
    );
  }, [form.country]);

  const handleSelectRow = (vehicle: StoredVehicle) => {
    if (selectedRowIds.includes(vehicle.id)) {
      handleRemoveRowChip(vehicle.id);
      return;
    }
    setSelectedRowIds((prev) => [...prev, vehicle.id]);
  };
  const handleRemoveRowChip = (vehicleId: string) => {
    if (rowChipClosingIds.includes(vehicleId)) return;
    setRowChipClosingIds((prev) => {
      if (prev.includes(vehicleId)) return prev;
      return [...prev, vehicleId];
    });
    window.setTimeout(() => {
      setSelectedRowIds((prev) => prev.filter((id) => id !== vehicleId));
      setRowChipClosingIds((prev) => prev.filter((id) => id !== vehicleId));
    }, 220);
  };

  const filteredData = useMemo(() => {
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
      const matchesPlateNumber = normalizedQuery
        ? normalizePlateNumber(vehicle.plateNumber).includes(normalizedQuery)
        : false;
      const matchesOwner = vehicle.owner.toLowerCase().includes(rawQuery);
      const matchesSearch = !rawQuery || matchesPlateNumber || matchesOwner;
      const matchesDate = matchesDateValue(vehicle.addedDate);
      const matchesCategory = vehicle.category === DEFAULT_CATEGORY;
      return matchesSearch && matchesDate && matchesCategory;
    });
  }, [searchQuery, dateFilter, vehicles]);

  const sortedData = useMemo(() => {
    const next = [...filteredData];
    next.sort((a, b) => {
      const diff = parseDateToTimestamp(a.addedDate) - parseDateToTimestamp(b.addedDate);
      return dateSort === 'asc' ? diff : -diff;
    });
    return next;
  }, [filteredData, dateSort]);

  const hasSearchMatches = searchQuery.trim() !== '' && filteredData.length > 0;
  const canViewEntries = selectedRowIds.length > 0 || hasSearchMatches;
  const hasSelectedChips = selectedVehicles.length > 0;

  const resolveSearchParams = () => {
    const query = searchQuery.trim();
    if (!query) return null;
    const normalized = normalizePlateNumber(query);
    const looksLikePlate = normalized.length >= 4 && /\d/.test(normalized);
    return looksLikePlate ? { plate: query } : { owner: query };
  };

  const handleViewEntries = () => {
    if (!canViewEntries) return;
    const params = new URLSearchParams();
    if (selectedRowIds.length > 0 && selectedVehicles.length > 0) {
      if (selectedVehicles.length === 1) {
        params.set('plate', selectedVehicles[0].plateNumber);
        params.set('owner', selectedVehicles[0].owner);
      } else {
        params.set(
          'plates',
          selectedVehicles.map((vehicle) => vehicle.plateNumber).join(',')
        );
      }
    } else {
      const resolved = resolveSearchParams();
      if (!resolved) return;
      if (resolved.plate) params.set('plate', resolved.plate);
      if (resolved.owner) params.set('owner', resolved.owner);
    }
    params.set('status', 'Чёрный');
    const url = `${getRoutePath('events')}?${params.toString()}`;
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDateFilter('');
    setDateSort('desc');
    setSelectedRowIds([]);
    setRowChipClosingIds([]);
  };

  const resetForm = () => {
    setForm({
      owner: '',
      plateNumber: '',
      region: '',
      country: '',
      notes: '',
      category: DEFAULT_CATEGORY
    });
    setErrors({});
  };

  const clearDeleteTimeout = () => {
    if (deleteClearTimeoutRef.current) {
      window.clearTimeout(deleteClearTimeoutRef.current);
      deleteClearTimeoutRef.current = null;
    }
  };

  const scheduleDeleteClear = () => {
    clearDeleteTimeout();
    deleteClearTimeoutRef.current = window.setTimeout(() => {
      setVehicleToDelete(null);
      deleteClearTimeoutRef.current = null;
    }, 200);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingVehicle(null);
      resetForm();
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (open) {
      clearDeleteTimeout();
    } else {
      scheduleDeleteClear();
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchQuery((value) => value.trim());
  };

  const openCreateDialog = () => {
    setEditingVehicle(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (vehicle: StoredVehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      owner: vehicle.owner,
      plateNumber: vehicle.plateNumber,
      region: vehicle.region ?? '',
      country: vehicle.country ?? '',
      notes: vehicle.notes ?? '',
      category: vehicle.category
    });
    setErrors({});
    setDialogOpen(true);
  };

  const handleSave = () => {
    const trimmedOwner = form.owner.trim();
    const ownerValue =
      trimmedOwner.split(/\s+/).length >= 2 && !isOrganizationName(trimmedOwner)
        ? getNameWithInitials(trimmedOwner, trimmedOwner)
        : trimmedOwner;
    const normalizedPlate = normalizePlateNumber(form.plateNumber);
    const trimmedRegion = form.region.trim();
    const trimmedCountry = form.country.trim();
    const regionValue = trimmedRegion;
    const countryValue = trimmedCountry;
    const plateNumberValue = form.plateNumber.trim();
    const formatValue = (value?: string) => (value ? value : '—');
    const nextErrors: typeof errors = {};

    if (!trimmedOwner) {
      nextErrors.owner = 'Введите данные владельца.';
    }

    if (!normalizedPlate) {
      nextErrors.plateNumber = 'Введите номер автомобиля.';
    }

    if (!trimmedRegion) {
      nextErrors.region = 'Введите регион.';
    }

    if (!trimmedCountry) {
      nextErrors.country = 'Укажите страну.';
    }

    if (trimmedCountry && /\d/.test(trimmedCountry)) {
      nextErrors.country = 'Страна должна содержать только буквы.';
    }

    if (!form.category) {
      nextErrors.category = 'Выберите список.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const notesValue = form.notes.trim() || undefined;
    const selectedCategory = form.category as StoredVehicle['category'];

    if (editingVehicle) {
      const existingNotes = editingVehicle.notes ?? '';
      const nextNotes = notesValue ?? '';
      const changes: string[] = [];
      const detailsParts: string[] = [];
      const listChanged = selectedCategory !== editingVehicle.category;
      const hasChanges =
        ownerValue !== editingVehicle.owner ||
        plateNumberValue !== editingVehicle.plateNumber ||
        (regionValue ?? '') !== (editingVehicle.region ?? '') ||
        (countryValue ?? '') !== (editingVehicle.country ?? '') ||
        nextNotes !== existingNotes ||
        listChanged;

      if (!hasChanges) {
        setDialogOpen(false);
        setEditingVehicle(null);
        resetForm();
        return;
      }

      const timestamp = getCurrentTimestamp();
      const creatorName = getNameWithInitials(user?.fullName, '—');

      if (ownerValue !== editingVehicle.owner) {
        changes.push('наименование');
        detailsParts.push(`Наименование: ${editingVehicle.owner} → ${ownerValue}`);
      }

      if (plateNumberValue !== editingVehicle.plateNumber) {
        changes.push('номер');
        detailsParts.push(
          `Номер: ${formatPlateWithCountryCode(
            editingVehicle.plateNumber,
            editingVehicle.country
          )} → ${formatPlateWithCountryCode(plateNumberValue, countryValue)}`
        );
      }

      if ((regionValue ?? '') !== (editingVehicle.region ?? '')) {
        changes.push('регион');
        detailsParts.push(
          `Регион: ${formatValue(editingVehicle.region)} → ${formatValue(regionValue)}`
        );
      }

      if ((countryValue ?? '') !== (editingVehicle.country ?? '')) {
        changes.push('страна');
        detailsParts.push(
          `Страна: ${formatValue(editingVehicle.country)} → ${formatValue(countryValue)}`
        );
      }

      if (listChanged) {
        changes.push('список');
        detailsParts.push(
          `Список: ${categoryAuditLabels[editingVehicle.category]} → ${categoryAuditLabels[selectedCategory]}`
        );
      } else {
        detailsParts.push(`Список: ${categoryAuditLabels[selectedCategory]}`);
      }

      if (nextNotes !== existingNotes) {
        changes.push('описание');
        detailsParts.push(
          `Описание: ${formatValue(editingVehicle.notes)} → ${formatValue(notesValue)}`
        );
      }

      const action =
        changes.length === 1
          ? changes[0] === 'номер'
            ? 'Изменен номер'
            : `Изменено ${changes[0]}`
          : `Изменено: ${changes.join(', ')}`;

      updateVehicleById({
        ...editingVehicle,
        owner: ownerValue,
        plateNumber: plateNumberValue,
        region: regionValue,
        country: countryValue,
        notes: notesValue,
        category: selectedCategory
      });

      addAuditLogEntry({
        timestamp,
        user: creatorName,
        action,
        target: formatPlateWithCountryCode(plateNumberValue, countryValue),
        details: detailsParts.join(' · ')
      });
    } else {
      const timestamp = getCurrentTimestamp();
      const creatorName = getNameWithInitials(user?.fullName, '—');

      addStoredVehicle(selectedCategory, {
        owner: ownerValue,
        plateNumber: plateNumberValue,
        region: regionValue,
        country: countryValue,
        notes: notesValue
      });

      addAuditLogEntry({
        timestamp,
        user: creatorName,
        action: 'Добавлен автомобиль',
        target: formatPlateWithCountryCode(plateNumberValue, countryValue),
        details: `Номер: ${formatPlateWithCountryCode(plateNumberValue, countryValue)} · Список: ${categoryAuditLabels[selectedCategory]} · Владелец: ${ownerValue} · Регион: ${formatValue(
          regionValue
        )} · Страна: ${formatValue(countryValue)}`
      });
    }

    setRefreshKey((prev) => prev + 1);
    setDialogOpen(false);
    setEditingVehicle(null);
    resetForm();
  };

  const handleDelete = (vehicle: StoredVehicle) => {
    if (!canManage) return;
    deleteVehicleById(vehicle.id);
    const timestamp = getCurrentTimestamp();
    const creatorName = getNameWithInitials(user?.fullName, '—');
    addAuditLogEntry({
      timestamp,
      user: creatorName,
      action: 'Удален автомобиль',
      target: formatPlateWithCountryCode(vehicle.plateNumber, vehicle.country),
      details: `Список: ${categoryAuditLabels[vehicle.category]} · Владелец: ${vehicle.owner}`
    });

    setRefreshKey((prev) => prev + 1);
  };

  const handleDeleteRequest = (vehicle: StoredVehicle) => {
    if (!canManage) return;
    clearDeleteTimeout();
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!vehicleToDelete) return;
    handleDelete(vehicleToDelete);
    setDeleteDialogOpen(false);
    scheduleDeleteClear();
  };

  return (
    <>
      <PageHeader
        title="Чёрный список"
        description="Автомобили с запрещённым доступом"
        actions={
          canManage ? (
            <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <Button icon={<Plus className="w-4 h-4" />} onClick={openCreateDialog}>
                  Добавить автомобиль
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingVehicle ? 'Редактирование автомобиля' : 'Добавление автомобиля'}
                  </DialogTitle>
                  <DialogDescription className="text-foreground font-medium">
                    {editingVehicle
                      ? 'Обновите данные владельца и автомобиля.'
                      : 'Укажите данные владельца и автомобиля.'}
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
                        label="Владелец (компания или ФИО)"
                        value={form.owner}
                        onChange={(value) => {
                          setForm((prev) => ({ ...prev, owner: value }));
                          if (errors.owner) {
                            setErrors((prev) => ({ ...prev, owner: undefined }));
                          }
                        }}
                        placeholder="ООО «СМК» или Иванов Иван Иванович"
                      />
                      {errors.owner && (
                        <p className="mt-1 text-xs text-red-600">{errors.owner}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        label="Номер автомобиля"
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Input
                          label="Регион"
                          value={form.region}
                          onChange={(value) => {
                            setForm((prev) => ({ ...prev, region: value }));
                            if (errors.region) {
                              setErrors((prev) => ({ ...prev, region: undefined }));
                            }
                          }}
                          placeholder="777"
                        />
                        {errors.region && (
                          <p className="mt-1 text-xs text-red-600">{errors.region}</p>
                        )}
                      </div>
                      <div className="relative">
                        <Input
                          label="Страна"
                          value={form.country}
                          onChange={(value) => {
                            setForm((prev) => ({ ...prev, country: value }));
                            if (errors.country) {
                              setErrors((prev) => ({ ...prev, country: undefined }));
                            }
                            setCountrySuggestionsOpen(value.trim().length > 0);
                          }}
                          placeholder="Россия (RUS)"
                        />
                        {countrySuggestionsOpen &&
                          form.country.trim() !== '' &&
                          filteredCountries.length > 0 && (
                            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded text-sm shadow-lg z-20 max-h-44 overflow-y-auto">
                              {filteredCountries.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  className="w-full text-left px-3 py-2 transition-colors hover:bg-blue-50"
                                  onMouseDown={(event) => event.preventDefault()}
                                  onClick={() => {
                                    setForm((prev) => ({ ...prev, country: option.label }));
                                    if (errors.country) {
                                      setErrors((prev) => ({ ...prev, country: undefined }));
                                    }
                                    setCountrySuggestionsOpen(false);
                                  }}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        {errors.country && (
                          <p className="mt-1 text-xs text-red-600">{errors.country}</p>
                        )}
                      </div>
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
                        options={categoryOptions}
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
                        placeholder="Например, причина блокировки"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-3 justify-start sm:justify-start">
                    <Button type="submit">
                      {editingVehicle ? 'Сохранить' : 'Создать'}
                    </Button>
                    <Button variant="secondary" onClick={() => handleDialogChange(false)}>
                      Отмена
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <FilterBar>
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-4">
          <div className="w-full max-w-[390px]">
            <div className="relative">
              <Input
                label="Поиск по номеру или владельцу"
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value);
                  setSearchSuggestionsOpen(value.trim().length > 0);
                  setSelectedRowIds([]);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setSearchSuggestionsOpen(true);
                  }
                }}
                onBlur={() => {
                  window.setTimeout(() => setSearchSuggestionsOpen(false), 120);
                }}
                placeholder="Введите номер или имя владельца"
                icon={<Search className="w-4 h-4" />}
                className="h-[36px]"
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
                      const isSelected = selectedPlateSet.has(plate);
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
                            setSelectedRowIds([]);
                          }}
                        >
                          {formatPlateNumber(plate)} ({getPlateCountryCode(plate, plateCountryMap.get(plate))})
                        </button>
                      );
                    })}
                    {ownerSuggestions.length > 0 && (
                      <div className="px-3 pt-2 pb-1 text-[11px] uppercase text-muted-foreground">
                        Владельцы
                      </div>
                    )}
                    {ownerSuggestions.map((owner) => {
                      const isSelected = selectedOwnerSet.has(owner.value);
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
                            setSelectedRowIds([]);
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
          <div className="w-56 min-w-[220px]">
            <DatePickerInput
              label="Дата добавления"
              value={dateFilter}
              onChange={(value) => setDateFilter(formatDateInput(value))}
              placeholder="ДД.ММ.ГГГГ"
              className="h-[36px]"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="h-[36px] px-4">
              Найти
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
          <div className="ml-auto flex items-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleViewEntries}
                    disabled={!canViewEntries}
                    className="h-[36px] px-4"
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
        </form>
        <div
          className={`flex flex-wrap items-center gap-2 text-xs text-muted-foreground transition-[max-height,opacity,transform,margin] duration-[240ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-[max-height,opacity,transform] ${
            hasSelectedChips
              ? 'mt-3 max-h-24 opacity-100 translate-y-0'
              : 'mt-0 max-h-0 opacity-0 -translate-y-1 pointer-events-none'
          }`}
          style={{ overflow: 'hidden' }}
        >
          {selectedVehicles.map((vehicle) => {
            const isClosing = rowChipClosingIds.includes(vehicle.id);
            return (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => handleRemoveRowChip(vehicle.id)}
                className={`inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700 transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-[opacity,transform] ${
                  isClosing
                    ? 'opacity-0 -translate-y-1 scale-95'
                    : 'opacity-100 translate-y-0 scale-100'
                }`}
              >
                {formatPlateNumber(vehicle.plateNumber)} · {getOwnerShortLabel(vehicle.owner)}
                <span className="text-[14px] leading-none font-semibold">×</span>
              </button>
            );
          })}
        </div>
      </FilterBar>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground tracking-tight">Список автомобилей</h2>
          <span className="text-sm text-muted-foreground">Всего: {sortedData.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[220px]" />
              <col className="w-[240px]" />
              <col className="w-[170px]" />
              <col className="w-[260px]" />
              {canManage && <col className="w-[120px]" />}
            </colgroup>
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="text-center py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Номер автомобиля
                </th>
                <th className="text-center py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Владелец
                </th>
                <th className="text-center py-4 px-6 text-[12px] font-bold uppercase tracking-wider">
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
                <th className="text-center py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Примечания
                </th>
                {canManage && (
                  <th className="py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider text-center">
                    Действия
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </td>
                    {canManage && (
                      <td className="py-4 px-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      </td>
                    )}
                  </tr>
                ))
              ) : sortedData.length > 0 ? (
                sortedData.map((vehicle) => {
                  const isSelectedRow = selectedRowIds.includes(vehicle.id);

                  return (
                    <tr
                      key={vehicle.id}
                      onClick={() => handleSelectRow(vehicle)}
                      className={`border-b border-border/50 cursor-pointer ${
                        isSelectedRow ? 'bg-slate-200' : 'transition-smooth hover:bg-muted/30'
                      }`}
                    >
                    <td className="py-4 px-6 text-center text-red-600 plate-text">
                      <span className="inline-flex items-center justify-center gap-2">
                        {formatPlateNumber(vehicle.plateNumber)}
                        <span className="text-[11px] text-foreground/70 font-semibold">
                          ({getPlateCountryCode(vehicle.plateNumber, vehicle.country)})
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-[14px] text-foreground/80">
                      <span className="inline-flex items-center justify-center">
                        {vehicle.owner}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-[14px] text-foreground/80 font-mono transition-colors hover:text-foreground">
                      {vehicle.addedDate}
                    </td>
                    <td className="py-4 px-6 text-center text-[14px] text-foreground/70">
                      {vehicle.notes || '—'}
                    </td>
                    {canManage && (
                      <td className="py-4 px-6">
                        <div className="relative flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEditDialog(vehicle);
                            }}
                            className="text-blue-400 transition-colors hover:text-blue-500"
                            aria-label="Редактировать"
                          >
                            <PencilLine className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteRequest(vehicle);
                            }}
                            className="text-red-400 transition-colors hover:text-red-500"
                            aria-label="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                        </div>
                      </td>
                    )}
                  </tr>
                );
                })
              ) : (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="py-8 text-center text-muted-foreground">
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
              disabled
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>

            <button className="px-3 py-1 rounded text-sm bg-primary text-primary-foreground">
              1
            </button>

            <button
              disabled
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>


      

      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить автомобиль?</DialogTitle>
            <DialogDescription className="text-foreground font-medium">
              {vehicleToDelete
                ? `Номер: ${formatPlateNumber(vehicleToDelete.plateNumber)} (${getPlateCountryCode(
                    vehicleToDelete.plateNumber,
                    vehicleToDelete.country
                  )}). Это действие нельзя отменить.`
                : 'Это действие нельзя отменить.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-start sm:justify-start">
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={!vehicleToDelete}
            >
              Да
            </Button>
            <Button variant="secondary" onClick={() => handleDeleteDialogChange(false)}>
              Нет
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
