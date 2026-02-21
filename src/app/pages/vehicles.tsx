import { useEffect, useMemo, useRef, useState } from 'react';

import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Plus, Search } from 'lucide-react';

import { useAuth } from '@/auth/authContext';

import { BASE_VEHICLES } from '@/app/data/vehicles';

import { FilterBar } from '@/app/components/ui/filter-bar';

import { Input } from '@/app/components/ui/input';

import { DatePickerInput } from '@/app/components/ui/date-picker-input';

import { Select } from '@/app/components/ui/select';

import { Button } from '@/app/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { PageHeader } from '@/app/components/ui/page-header';
import {
  buildPlateNumber,
  formatPlateNumber,
  formatPlateNumberWithRegion,
  formatPlateWithCountryCode,
  getPlateCountryCode,
  normalizePlateNumber
} from '@/app/utils/plate';
import {
  getContractorAccessState,
  parseDateToTimestamp as parseAccessDateToTimestamp
} from '@/app/utils/contractorAccess';

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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/app/components/ui/drawer';

import { PLATE_COUNTRY_OPTIONS } from '@/app/data/plateCountries';
import { usePaginatedPageScroll } from '@/app/hooks/use-paginated-page-scroll';

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
  const canViewOwnerNames = user?.role !== 'guard';

  const [dialogOpen, setDialogOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const [form, setForm] = useState({

    owner: '',

    plateNumber: '',

    region: '',

    country: '',

    accessFrom: '',

    accessTo: '',

    notes: '',

    category: 'white'

  });

  const [errors, setErrors] = useState<{

    owner?: string;

    plateNumber?: string;

    region?: string;

    country?: string;

    accessFrom?: string;

    accessTo?: string;

    category?: string;
    form?: string;

  }>({});

  const [countrySuggestionsOpen, setCountrySuggestionsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);

  const [selectedPlate, setSelectedPlate] = useState('');

  const [selectedOwner, setSelectedOwner] = useState('');

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [plateChipClosing, setPlateChipClosing] = useState<string | null>(null);
  const [ownerChipClosing, setOwnerChipClosing] = useState<string | null>(null);
  const [rowChipClosingIds, setRowChipClosingIds] = useState<string[]>([]);
  const selectedPlateRef = useRef(selectedPlate);

  const selectedOwnerRef = useRef(selectedOwner);

  const [categoryFilter, setCategoryFilter] = useState('');

  const [dateFilter, setDateFilter] = useState('');

  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const tableHostRef = useRef<HTMLDivElement | null>(null);
  const { handlePageChange, resetPageScrollMemory } = usePaginatedPageScroll({
    currentPage,
    setCurrentPage,
    hostRef: tableHostRef
  });

  const vehicles = useMemo(() => {

    const stored = getStoredVehicles().filter((vehicle) => vehicle.category !== 'unlisted');

    const baseVehicles = [

      ...BASE_VEHICLES.white,

      ...BASE_VEHICLES.black,

      ...BASE_VEHICLES.contractor

    ];

    return mergeVehicles(baseVehicles, stored).filter((vehicle) => vehicle.category !== 'unlisted');

  }, [refreshKey]);

  const suggestionVehicles = useMemo(
    () => (categoryFilter ? vehicles.filter((vehicle) => vehicle.category === categoryFilter) : vehicles),
    [vehicles, categoryFilter]
  );

  const plateCountryMap = useMemo(() => {
    const map = new Map<string, string>();
    suggestionVehicles.forEach((vehicle) => {
      if (!map.has(vehicle.plateNumber) && vehicle.country) {
        map.set(vehicle.plateNumber, vehicle.country);
      }
    });
    return map;
  }, [suggestionVehicles]);

  const plateSuggestions = useMemo(() => {

    const query = searchQuery.trim();

    if (!query) return [];

    const normalizedQuery = normalizePlateNumber(query);

    if (!normalizedQuery) return [];

    const unique = new Set<string>();

    const matches: string[] = [];

    suggestionVehicles.forEach((vehicle) => {

      const normalizedPlate = normalizePlateNumber(vehicle.plateNumber);

      if (!normalizedPlate.includes(normalizedQuery)) return;

      if (unique.has(vehicle.plateNumber)) return;

      unique.add(vehicle.plateNumber);

      matches.push(vehicle.plateNumber);

    });

    return matches.slice(0, 6);

  }, [canViewOwnerNames, suggestionVehicles, searchQuery]);

  const ownerSuggestions = useMemo(() => {
    if (!canViewOwnerNames) return [];
    const query = searchQuery.trim();

    if (!query) return [];

    const rawQuery = query.toLowerCase();

    const normalizedOwnerQuery = normalizeOwnerName(query);

    const normalizedOrgQuery = normalizeOrganizationName(query);

    const unique = new Map<string, string>();

    suggestionVehicles.forEach((vehicle) => {

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

  }, [canViewOwnerNames, suggestionVehicles, searchQuery]);

  const selectedOwnerLabel = selectedOwner ? getOwnerShortLabel(selectedOwner) : '';

  const selectedPlateLabel = selectedPlate ? formatPlateNumber(selectedPlate) : '';

  const selectedVehicles = useMemo(
    () =>
      selectedRowIds
        .map((id) => vehicles.find((vehicle) => vehicle.id === id))
        .filter((vehicle): vehicle is StoredVehicle => Boolean(vehicle)),
    [vehicles, selectedRowIds]
  );

  const selectedVehicle = useMemo(() => {
    if (selectedPlate && selectedOwner) {
      return (
        vehicles.find(
          (vehicle) =>
            vehicle.plateNumber === selectedPlate && vehicle.owner === selectedOwner
        ) ??
        vehicles.find((vehicle) => vehicle.plateNumber === selectedPlate) ??
        vehicles.find((vehicle) => vehicle.owner === selectedOwner)
      );
    }
    if (selectedVehicles.length === 1) {
      return selectedVehicles[0];
    }
    return null;
  }, [vehicles, selectedPlate, selectedOwner, selectedVehicles]);
  const selectedStatus = useMemo(() => {
    if (selectedVehicle) {
      return eventStatusByCategory[selectedVehicle.category];
    }
    if (selectedVehicles.length > 1) {
      const categories = new Set(selectedVehicles.map((vehicle) => vehicle.category));
      if (categories.size === 1) {
        const [category] = Array.from(categories);
        return eventStatusByCategory[category];
      }
    }
    return '';
  }, [selectedVehicle, selectedVehicles]);
  const filteredCountries = useMemo(() => {

    const query = form.country.trim().toLowerCase();
    const filtered = PLATE_COUNTRY_OPTIONS.filter(
      (option) =>
        !query ||
        option.label.toLowerCase().startsWith(query) ||
        option.value.toLowerCase().startsWith(query)
    );
    return filtered.slice(0, 8);

  }, [form.country]);

  const handleSelectRow = (vehicle: StoredVehicle) => {
    if (selectedRowIds.includes(vehicle.id)) {
      handleRemoveRowChip(vehicle.id);
      return;
    }
    setSelectedRowIds((prev) => [...prev, vehicle.id]);
    if (selectedPlate || selectedOwner) {
      setSelectedPlate('');
      setSelectedOwner('');
    }
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

        (canViewOwnerNames && vehicle.owner.toLowerCase().includes(rawQuery)) ||

        (normalizedQuery

          ? normalizePlateNumber(vehicle.plateNumber).includes(normalizedQuery)

          : false);

      const matchesCategory = !categoryFilter || vehicle.category === categoryFilter;

      const matchesDate = matchesDateValue(vehicle.addedDate);

      return matchesSearch && matchesCategory && matchesDate;

    });

  }, [canViewOwnerNames, vehicles, searchQuery, categoryFilter, dateFilter]);

  const sortedVehicles = useMemo(() => {

    const next = [...filteredVehicles];

    next.sort((a, b) => {

      const diff = parseDateToTimestamp(a.addedDate) - parseDateToTimestamp(b.addedDate);

      return dateSort === 'asc' ? diff : -diff;

    });

    return next;

  }, [filteredVehicles, dateSort]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage);
  const displayedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedVehicles.slice(start, start + itemsPerPage);
  }, [sortedVehicles, currentPage]);
  const tableFillerRowCount =
    displayedVehicles.length > 0 ? Math.max(0, itemsPerPage - displayedVehicles.length) : 0;

  useEffect(() => {
    resetPageScrollMemory();
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, dateFilter, dateSort, refreshKey, resetPageScrollMemory]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const hasSearchMatches = searchQuery.trim() !== '' && filteredVehicles.length > 0;

  const hasOwnerSelection = canViewOwnerNames && Boolean(selectedPlate && selectedOwner);
  const canViewEntries = hasOwnerSelection || selectedRowIds.length > 0 || hasSearchMatches;
  const hasSelectedChips = Boolean(
    selectedPlate || (canViewOwnerNames && selectedOwner) || selectedVehicles.length > 0
  );
      useEffect(() => {

    selectedPlateRef.current = selectedPlate;

  }, [selectedPlate]);

  useEffect(() => {

    selectedOwnerRef.current = selectedOwner;

  }, [selectedOwner]);

  useEffect(() => {
    if (!canViewOwnerNames && selectedOwner) {
      setSelectedOwner('');
    }
  }, [canViewOwnerNames, selectedOwner]);

  const handleRemovePlateChip = () => {
    if (!selectedPlate) return;
    setPlateChipClosing(selectedPlate);
    const closingValue = selectedPlate;
    window.setTimeout(() => {
      if (selectedPlateRef.current === closingValue) {
        setSelectedPlate('');
      }
      setPlateChipClosing(null);
    }, 240);
  };
  const handleRemoveOwnerChip = () => {
    if (!selectedOwner) return;
    setOwnerChipClosing(selectedOwner);
    const closingValue = selectedOwner;
    window.setTimeout(() => {
      if (selectedOwnerRef.current === closingValue) {
        setSelectedOwner('');
      }
      setOwnerChipClosing(null);
    }, 240);
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
  const resolveSearchParams = () => {

    const query = searchQuery.trim();

    if (!query) return null;

    const normalized = normalizePlateNumber(query);

    const looksLikePlate = normalized.length >= 4 && /\d/.test(normalized);

    if (looksLikePlate) return { plate: query };
    if (!canViewOwnerNames) return null;
    return { owner: query };

  };

  const handleViewEntries = () => {
    if (!canViewEntries) return;
    const params = new URLSearchParams();
    const hasExplicitSelection = hasOwnerSelection || selectedRowIds.length > 0;
    if (hasOwnerSelection) {
      params.set('plate', selectedPlate);
      if (canViewOwnerNames) {
        params.set('owner', selectedOwner);
      }
    } else if (selectedRowIds.length > 0 && selectedVehicles.length > 0) {
      if (selectedVehicles.length === 1) {
        params.set('plate', selectedVehicles[0].plateNumber);
        if (canViewOwnerNames) {
          params.set('owner', selectedVehicles[0].owner);
        }
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
      if (canViewOwnerNames && resolved.owner) params.set('owner', resolved.owner);
    }
    if (selectedStatus) {
      params.set('status', selectedStatus);
    } else if (!hasExplicitSelection && filteredVehicles[0]) {
      const fallbackStatus = eventStatusByCategory[filteredVehicles[0].category];
      if (fallbackStatus) {
        params.set('status', fallbackStatus);
      }
    }
    const url = `${getRoutePath('events')}?${params.toString()}`;

    window.history.pushState({}, '', url);

    window.dispatchEvent(new PopStateEvent('popstate'));

  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setDateFilter('');
    setDateSort('desc');
    resetPageScrollMemory();
    setCurrentPage(1);
    setSelectedPlate('');
    setSelectedOwner('');
    setSelectedRowIds([]);
  };
  const resetForm = () => {

    setForm({

      owner: '',

      plateNumber: '',

      region: '',

      country: '',

      accessFrom: '',

      accessTo: '',

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
    const ownerValue = trimmedOwner.replace(/\s+/g, ' ');
    const normalizedPlate = normalizePlateNumber(form.plateNumber);
    const trimmedRegion = form.region.trim();

    const trimmedCountry = form.country.trim();
    const accessFromValue = form.accessFrom.trim();
    const accessToValue = form.accessTo.trim();
    const category = form.category as StoredVehicle['category'];
    const isContractorCategory = category === 'contractor';

    const regionValue = trimmedRegion;
    const countryValue = trimmedCountry;
    const plateNumberValue = buildPlateNumber(form.plateNumber.trim(), regionValue, countryValue);

    const nextErrors: typeof errors = {};
    if (!ownerValue) {
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
    } else if (/\d/.test(trimmedCountry)) {
      nextErrors.country = 'Страна должна содержать только буквы.';
    }
    if (!category) {
      nextErrors.category = 'Выберите список.';
    }
    if (isContractorCategory && !accessFromValue) {
      nextErrors.accessFrom = 'Укажите дату начала доступа.';
    }
    if (isContractorCategory && !accessToValue) {
      nextErrors.accessTo = 'Укажите дату окончания доступа.';
    }

    const accessFromTimestamp = parseAccessDateToTimestamp(accessFromValue);
    const accessToTimestamp = parseAccessDateToTimestamp(accessToValue);
    if (isContractorCategory && accessFromValue && !accessFromTimestamp) {
      nextErrors.accessFrom = 'Введите корректную дату.';
    }
    if (isContractorCategory && accessToValue && !accessToTimestamp) {
      nextErrors.accessTo = 'Введите корректную дату.';
    }
    if (
      isContractorCategory &&
      accessFromTimestamp !== null &&
      accessToTimestamp !== null &&
      accessFromTimestamp > accessToTimestamp
    ) {
      nextErrors.accessTo = 'Дата завершения должна быть не раньше даты начала.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    const notesValue = form.notes.trim() || undefined;

    const timestamp = getCurrentTimestamp();

    const creatorName = getNameWithInitials(user?.fullName, '—');

    try {
      addStoredVehicle(category, {
        owner: ownerValue,
        plateNumber: plateNumberValue,
        region: regionValue,
        country: countryValue,
        accessFrom: isContractorCategory ? accessFromValue || undefined : undefined,
        accessTo: isContractorCategory ? accessToValue || undefined : undefined,
        notes: notesValue
      });
      const plateWithRegionAndCountry = `${formatPlateNumberWithRegion(
        plateNumberValue,
        regionValue,
        countryValue
      )} (${getPlateCountryCode(plateNumberValue, countryValue)})`;

      addAuditLogEntry({
        timestamp,
        user: creatorName,
        action: 'Добавлен автомобиль',
        target: plateWithRegionAndCountry,
        details: `Номер: ${plateWithRegionAndCountry} · Список: ${categoryLabels[category]} · Владелец: ${ownerValue} · Регион: ${regionValue ?? '—'} · Страна: ${countryValue ?? '—'}${
          isContractorCategory
            ? ` · Срок доступа: ${accessFromValue || '—'} - ${accessToValue || '—'}`
            : ''
        } · Примечание: ${notesValue || '—'}`
      });

      setRefreshKey((prev) => prev + 1);
      setDialogOpen(false);
      resetForm();
    } catch {
      setErrors({ form: 'Не удалось сохранить автомобиль. Попробуйте ещё раз.' });
    }

  };

  return (

    <>
      <PageHeader
        title="Все автомобили"
        description='Общий список автомобилей из белого, чёрного списка, подрядчиков и "Нет в списках".'
        actions={
          canManage && (
            <Drawer open={dialogOpen} onOpenChange={handleDialogChange} direction="right">
              <DrawerTrigger asChild>
                <Button icon={<Plus className="w-4 h-4" />}>Добавить автомобиль</Button>
              </DrawerTrigger>
              <DrawerContent className="data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-xl overflow-y-auto">
                <DrawerHeader>
                  <DrawerTitle>Добавление автомобиля</DrawerTitle>
                  <DrawerDescription className="text-foreground font-medium">
                    Укажите данные владельца и автомобиля.
                  </DrawerDescription>
                </DrawerHeader>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSave();
                  }}
                  className="space-y-4 px-4 pb-4"
                >
                  <div className="grid gap-4">
                    <div>
                      <Input
                        label="Владелец (ФИО)"
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

                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
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
                          setCountrySuggestionsOpen(true);
                        }}
                        onFocus={() => setCountrySuggestionsOpen(true)}
                        onBlur={() => {
                          window.setTimeout(() => setCountrySuggestionsOpen(false), 120);
                        }}
                        placeholder="Россия (RUS)"
                        clearable
                        clearButtonAriaLabel="Очистить страну"
                        onClear={() => {
                          setForm((prev) => ({ ...prev, country: '' }));
                          if (errors.country) {
                            setErrors((prev) => ({ ...prev, country: undefined }));
                          }
                          setCountrySuggestionsOpen(false);
                        }}
                      />
                      {countrySuggestionsOpen &&
                        filteredCountries.length > 0 && (
                          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded text-[13px] shadow-lg z-20 max-h-36 overflow-y-auto">
                            {filteredCountries.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                className="w-full text-left px-3 py-1.5 transition-colors hover:bg-blue-50"
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

                    <div>
                      <Select
                        label="Список"
                        value={form.category}
                        onChange={(value) => {
                          setForm((prev) => ({ ...prev, category: value }));
                          if (errors.category || errors.accessFrom || errors.accessTo) {
                            setErrors((prev) => ({
                              ...prev,
                              category: undefined,
                              accessFrom: undefined,
                              accessTo: undefined
                            }));
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

                    <div
                      className={`transition-[max-height,opacity,transform,margin] duration-300 ease-out overflow-hidden ${
                        form.category === 'contractor'
                          ? 'max-h-40 opacity-100 translate-y-0 mt-0'
                          : 'max-h-0 opacity-0 -translate-y-1 pointer-events-none mt-0'
                      }`}
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <DatePickerInput
                            mode="single"
                            label="Срок доступа: Начало"
                            value={form.accessFrom}
                            onChange={(value) => {
                              setForm((prev) => ({ ...prev, accessFrom: value }));
                              if (errors.accessFrom) {
                                setErrors((prev) => ({ ...prev, accessFrom: undefined }));
                              }
                            }}
                            placeholder="ДД.ММ.ГГГГ"
                          />
                          {errors.accessFrom && (
                            <p className="mt-1 text-xs text-red-600">{errors.accessFrom}</p>
                          )}
                        </div>
                        <div>
                          <DatePickerInput
                            mode="single"
                            label="Срок доступа: Завершение"
                            value={form.accessTo}
                            onChange={(value) => {
                              setForm((prev) => ({ ...prev, accessTo: value }));
                              if (errors.accessTo) {
                                setErrors((prev) => ({ ...prev, accessTo: undefined }));
                              }
                            }}
                            placeholder="ДД.ММ.ГГГГ"
                          />
                          {errors.accessTo && (
                            <p className="mt-1 text-xs text-red-600">{errors.accessTo}</p>
                          )}
                        </div>
                      </div>
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
                  {errors.form && <p className="text-xs text-red-600">{errors.form}</p>}
                  <DrawerFooter className="mt-8 p-0 sm:flex-row sm:justify-start">
                    <Button type="submit">Создать</Button>
                    <Button variant="secondary" onClick={() => handleDialogChange(false)}>
                      Отмена
                    </Button>
                  </DrawerFooter>
                </form>
              </DrawerContent>
            </Drawer>
          )
        }
      />

      <FilterBar>

        <div className="flex flex-wrap gap-4 items-end">

          <div className="w-full max-w-[390px]">

            <div className="relative">

              <Input

                label={canViewOwnerNames ? 'Поиск по номеру или владельцу' : 'Поиск по номеру'}

                value={searchQuery}

                onChange={(value) => {

                  setSearchQuery(value);

                  setSearchSuggestionsOpen(value.trim().length > 0);

                  setSelectedPlate('');

                  setSelectedOwner('');

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

                placeholder={canViewOwnerNames ? 'Введите номер или ФИО' : 'Введите номер'}

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

          <div className="w-56 min-w-[220px]">

            <Select

              label="Список"

              value={categoryFilter}

              onChange={setCategoryFilter}

              placeholder="Все списки"

              options={[

                { value: 'white', label: 'Белый список' },

                { value: 'black', label: 'Чёрный список' },

                { value: 'contractor', label: 'Подрядчики' }

              ]}

              size="md"
              className="h-[36px]"

            />

          </div>

          <div className="flex items-end gap-2">
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

                  {canViewOwnerNames ? 'Выберите номер, владельца (организацию)' : 'Выберите номер'}

                </TooltipContent>

              )}

            </Tooltip>
            <Button
              variant="destructive"
              onClick={handleResetFilters}
              className="h-[36px] px-4"
            >
              Сбросить
            </Button>
          </div>

        </div>

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
                {canViewOwnerNames
                  ? `${formatPlateNumber(vehicle.plateNumber)} · ${getOwnerShortLabel(vehicle.owner)}`
                  : formatPlateNumber(vehicle.plateNumber)}
                <span className="text-[14px] leading-none font-semibold">&times;</span>
              </button>
            );
          })}
          {selectedPlate && (
            <button
              type="button"
              onClick={handleRemovePlateChip}
              className={`inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700 transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-[opacity,transform] ${
                plateChipClosing === selectedPlate
                  ? 'opacity-0 -translate-y-1 scale-95'
                  : 'opacity-100 translate-y-0 scale-100'
              }`}
            >
              Номер: {selectedPlateLabel}
              <span className="text-[14px] leading-none font-semibold">&times;</span>
            </button>
          )}
          {canViewOwnerNames && selectedOwner && (

            <button

              type="button"
              onClick={handleRemoveOwnerChip}
              className={`inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-gray-700 transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-[opacity,transform] ${
                ownerChipClosing === selectedOwner
                  ? 'opacity-0 -translate-y-1 scale-95'
                  : 'opacity-100 translate-y-0 scale-100'
              }`}
            >
              Владелец: {selectedOwnerLabel}
              <span className="text-[14px] leading-none font-semibold">&times;</span>
            </button>
          )}
        </div>

      </FilterBar>

      <div ref={tableHostRef} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">

        <div className="px-8 py-6 border-b border-border flex items-center justify-between">

          <h2 className="text-[20px] font-bold text-foreground tracking-tight">Общий список</h2>

          <span className="text-sm text-muted-foreground">Всего: {sortedVehicles.length}</span>

        </div>

        <div className="overflow-x-hidden">

            <table className="w-full table-fixed">
              {canViewOwnerNames ? (
                <colgroup>
                  {canManage ? (
                    <>
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '19%' }} />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '17%' }} />
                      <col style={{ width: '15%' }} />
                      <col style={{ width: '17%' }} />
                    </>
                  ) : (
                    <>
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '24%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '16%' }} />
                      <col style={{ width: '12%' }} />
                    </>
                  )}
                </colgroup>
              ) : (
              <colgroup>
                <col style={{ width: '16%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
            )}

            <thead>

              <tr className="bg-muted/20 border-b border-border">

                <th className="text-center py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">

                  Список

                </th>

                <th className="text-center py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">

                  Номер

                </th>

                                {canViewOwnerNames && (
                  <th className="text-center py-4 px-6 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                    Владелец
                  </th>
                )}

                <th
                  className={`text-center py-4 text-[12px] font-bold uppercase tracking-wider ${
                    canManage ? 'pl-4 pr-6' : 'px-6'
                  }`}
                >

                  <button

                    type="button"

                    onClick={() => setDateSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}

                      className={`inline-flex items-center justify-center gap-1 text-foreground/70 hover:text-foreground transition-colors text-[12px] font-bold uppercase tracking-wider ${
                        canManage ? 'w-full' : ''
                      }`}

                  >

                    Дата добавления

                    {dateSort === 'asc' ? (

                      <ChevronUp className="w-3.5 h-3.5" />

                    ) : (

                      <ChevronDown className="w-3.5 h-3.5" />

                    )}

                  </button>

                </th>

                <th
                  className={`text-center py-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider ${
                    canManage ? 'px-4' : 'px-6'
                  }`}
                >

                  Срок действия

                </th>

                <th
                  className={`text-center py-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider ${
                    canManage ? 'pl-6 pr-6' : 'px-6'
                  }`}
                >

                  Примечание

                </th>

              </tr>

            </thead>

            <tbody className="bg-white">

              {sortedVehicles.length > 0 ? (

                displayedVehicles.map((vehicle) => {

                  const isUnlisted = vehicle.category === 'unlisted';

                  const ownerLabel = isUnlisted
                    ? 'Неизвестно'
                    : isOrganizationName(vehicle.owner)
                    ? vehicle.owner
                    : getNameWithInitials(vehicle.owner, vehicle.owner);

                  const countryCode = getPlateCountryCode(vehicle.plateNumber, vehicle.country);
                  const accessState = getContractorAccessState(vehicle, new Date(), vehicles);

                  const isSelectedRow = selectedRowIds.includes(vehicle.id);
                  return (

                    <tr

                      key={vehicle.id}

                      onClick={() => handleSelectRow(vehicle)}

                      className={`border-b border-border/50 cursor-pointer ${

                        isSelectedRow ? 'bg-slate-200' : 'transition-smooth hover:bg-muted/30'

                      }`}

                    >

                      <td className="py-4 px-6 text-center">

                        <span

                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-semibold ${

                            categoryColors[vehicle.category]

                          }`}

                        >

                          {categoryLabels[vehicle.category]}

                        </span>

                      </td>

                      <td className="py-4 px-6 text-center text-foreground/90 plate-text">
                        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
                          <span aria-hidden="true" />
                          <span className="inline-flex items-center justify-center gap-2">
                            {formatPlateNumberWithRegion(
                              vehicle.plateNumber,
                              vehicle.region,
                              vehicle.country
                            )}
                            <span className="text-[11px] text-foreground/70 font-semibold">
                              ({countryCode})
                            </span>
                          </span>
                          <span className="inline-flex items-center justify-start">
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
                          </span>
                        </div>
                      </td>

                                            {canViewOwnerNames && (
                      <td className="py-4 px-6 text-center text-[14px] text-foreground/80">
                        <span className="inline-flex max-w-full items-center justify-center break-words text-center">
                          {ownerLabel}
                        </span>
                      </td>
                    )}
                      <td
                        className={`py-4 text-center text-[14px] text-foreground/80 font-mono transition-colors hover:text-foreground ${
                          canManage ? 'pl-4 pr-6' : 'px-6'
                        }`}
                      >

                        {vehicle.addedDate}

                      </td>

                      <td
                        className={`py-4 text-center text-[14px] text-foreground/70 ${
                          canManage ? 'px-4' : 'px-6'
                        }`}
                      >
                        {accessState ? (
                          <span
                            className={`mx-auto inline-flex w-[150px] items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium ${
                              accessState.isExpired
                                ? 'bg-red-50 text-red-500'
                                : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            {accessState.accessDate} {accessState.statusLabel}
                          </span>
                        ) : (
                          <span className="mx-auto inline-flex w-[150px] items-center justify-center">—</span>
                        )}
                      </td>

                      <td
                        className={`py-4 text-center text-[14px] text-foreground/70 break-words ${
                          canManage ? 'pl-6 pr-6' : 'px-6'
                        }`}
                      >

                        {vehicle.notes || '—'}

                      </td>

                    </tr>

                  );

                })

              ) : (

                <tr>

                  <td colSpan={canViewOwnerNames ? 6 : 5} className="py-8 text-center text-muted-foreground">

                    Нет данных по заданным критериям

                  </td>

                </tr>

              )}
              {tableFillerRowCount > 0 &&
                Array.from({ length: tableFillerRowCount }).map((_, index) => (
                  <tr key={`vehicle-filler-${currentPage}-${index}`} aria-hidden="true">
                    <td
                      colSpan={canViewOwnerNames ? 6 : 5}
                      className="h-[68px] border-b border-border/40 bg-muted/10"
                    />
                  </tr>
                ))}

            </tbody>

          </table>

        </div>

        <div className="px-8 py-5 border-t border-border flex items-center justify-between bg-muted/20">
          <div className="text-sm font-medium text-muted-foreground">
            Показано {displayedVehicles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, sortedVehicles.length)} из {sortedVehicles.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>

            {totalPages > 0 && [...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
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
              onClick={() => handlePageChange(Math.min(totalPages || 1, currentPage + 1))}
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




