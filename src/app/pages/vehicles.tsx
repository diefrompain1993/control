import { useEffect, useMemo, useRef, useState } from 'react';




import { AlertTriangle, ChevronDown, ChevronUp, Plus, Search } from 'lucide-react';




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




    formatPlateNumber,








  formatPlateWithCountryCode,
  getPlateCountryCode,




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




    region?: string;




    country?: string;




    category?: string;




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




  }, [suggestionVehicles, searchQuery]);




  const ownerSuggestions = useMemo(() => {




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




  }, [suggestionVehicles, searchQuery]);




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




  const hasSearchMatches = searchQuery.trim() !== '' && filteredVehicles.length > 0;




  const canViewEntries =
    Boolean(selectedPlate && selectedOwner) || selectedRowIds.length > 0 || hasSearchMatches;
  const hasSelectedChips = Boolean(selectedPlate || selectedOwner || selectedVehicles.length > 0);
      useEffect(() => {




    selectedPlateRef.current = selectedPlate;




  }, [selectedPlate]);




  useEffect(() => {




    selectedOwnerRef.current = selectedOwner;




  }, [selectedOwner]);




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




    return looksLikePlate ? { plate: query } : { owner: query };




  };




  const handleViewEntries = () => {
    if (!canViewEntries) return;
    const params = new URLSearchParams();
    const hasExplicitSelection =
      Boolean(selectedPlate && selectedOwner) || selectedRowIds.length > 0;
    if (selectedPlate && selectedOwner) {
      params.set('plate', selectedPlate);
      params.set('owner', selectedOwner);
    } else if (selectedRowIds.length > 0 && selectedVehicles.length > 0) {
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




    const category = form.category as StoredVehicle['category'];




    const timestamp = getCurrentTimestamp();




    const creatorName = getNameWithInitials(user?.fullName, '—');




    addStoredVehicle(category, {




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




      details: `Номер: ${formatPlateWithCountryCode(plateNumberValue, countryValue)} · Список: ${categoryLabels[category]} · Владелец: ${ownerValue} · Регион: ${regionValue ?? '—'} · Страна: ${countryValue ?? '—'}`




    });




    setRefreshKey((prev) => prev + 1);




    setDialogOpen(false);




    resetForm();




  };




  return (




    <>
      <PageHeader
        title="Все автомобили"
        description='Общий список автомобилей из белого, чёрного списка, подрядчиков и "Нет в списках".'
        actions={
          canManage && (
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
          )
        }
      />

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




                placeholder="Введите номер или ФИО"




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




            <Button
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
                {formatPlateNumber(vehicle.plateNumber)} · {getOwnerShortLabel(vehicle.owner)}
                <span className="text-[14px] leading-none font-semibold">×</span>
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
              <span className="text-[14px] leading-none font-semibold">×</span>
            </button>
          )}
          {selectedOwner && (



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
              <span className="text-[14px] leading-none font-semibold">×</span>
            </button>
          )}
        </div>



      </FilterBar>




      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">




        <div className="px-8 py-6 border-b border-border flex items-center justify-between">




          <h2 className="text-[20px] font-bold text-foreground tracking-tight">Общий список</h2>




          <span className="text-sm text-muted-foreground">Всего: {sortedVehicles.length}</span>




        </div>




        <div className="overflow-x-auto">




          <table className="w-full table-fixed">




            <colgroup>




              <col className="w-[170px]" />




              <col className="w-[220px]" />




              <col className="w-[220px]" />




              <col className="w-[160px]" />




              <col className="w-[240px]" />




            </colgroup>




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




                  const countryCode = getPlateCountryCode(vehicle.plateNumber, vehicle.country);




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




                          className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${




                            categoryColors[vehicle.category]




                          }`}




                        >




                          {categoryLabels[vehicle.category]}




                        </span>




                      </td>




                      <td className="py-4 px-4 text-center text-foreground/90 plate-text">
                        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
                          <span aria-hidden="true" />
                          <span className="inline-flex items-center justify-center gap-2">
                            {formatPlateNumber(vehicle.plateNumber)}
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




                      <td className="py-4 px-4 text-center text-[14px] text-foreground/80">
                        <span className="inline-flex items-center justify-center">
                          {ownerLabel}
                        </span>
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




    </>




  );




}





