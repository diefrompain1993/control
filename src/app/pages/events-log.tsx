import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Download } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/authContext';
import { FilterBar } from '@/app/components/ui/filter-bar';
import { Input } from '@/app/components/ui/input';
import { DatePickerInput } from '@/app/components/ui/date-picker-input';
import { TimePickerInput } from '@/app/components/ui/time-picker-input';
import { Select } from '@/app/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { Button } from '@/app/components/ui/button';
import { formatPlateNumber, getPlateCountryInfo, getPlateCountryCode, normalizePlateNumber } from '@/app/utils/plate';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import { PLATE_COUNTRY_OPTIONS } from '@/app/data/plateCountries';
import { MOCK_EVENTS, type EventLogEntry } from '@/app/data/events';
import { getStoredVehiclesByCategory, mergeVehicles } from '@/app/utils/vehicleStore';
import { formatDateInput, parseDateRange } from '@/app/utils/dateFilter';

type Event = EventLogEntry;

const parseTimeToSeconds = (value: string) => {
  if (!value) return null;
  const parts = value.split(':').map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return null;
  const [hours = 0, minutes = 0, seconds = 0] = parts;
  if (hours > 23 || minutes > 59 || seconds > 59) return null;
  return hours * 3600 + minutes * 60 + seconds;
};

const parseDateTimeToTimestamp = (date: string, time: string) => {
  const [day, month, year] = date.split('.').map((value) => Number(value));
  if (!day || !month || !year) return 0;
  const [hours = 0, minutes = 0, seconds = 0] = time
    .split(':')
    .map((value) => Number(value));
  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
};

const parseDateToTimestamp = (value: string) => {
  const [day, month, year] = value.split('.').map((part) => Number(part));
  if (!day || !month || !year) return 0;
  return new Date(year, month - 1, day).getTime();
};
const normalizeInitialsQuery = (value: string) =>
  value
    .replace(/[^A-Za-z\u0410-\u042f\u0430-\u044f\u0401\u0451]/g, '')
    .toUpperCase();

const normalizeOwnerName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z\u0430-\u044f\u0451\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getOwnerInitials = (value: string) => {
  const cleaned = value
    .replace(/[^A-Za-z\u0410-\u042f\u0430-\u044f\u0401\u0451\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();

  if (!cleaned) return '';
  const parts = cleaned.split(' ').filter(Boolean);
  if (parts.length >= 3) {
    return `${parts[1][0] ?? ''}${parts[2][0] ?? ''}`;
  }
  if (parts.length === 2) {
    const second = parts[1];
    if (second.length >= 2) {
      return `${second[0]}${second[1]}`;
    }
    return second[0] ?? '';
  }
  return parts[0][0] ?? '';
};

const normalizeOrganizationName = (value: string) => {
  const cleaned = value
    .toLowerCase()
    .replace(/[\"'«»]/g, '')
    .replace(/[^a-z\u0430-\u044f\u04510-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned
    .replace(/^(ооо|оао|зао|пао|ао|тоо|ип|чп|ooo|oao|zao|pao|ao)\s*/g, '')
    .trim();
};

export function EventsLog() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const [plateQuery, setPlateQuery] = useState('');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [plateCountryFilter, setPlateCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [contractorQuery, setContractorQuery] = useState('');
  const [contractorTimeFrom, setContractorTimeFrom] = useState('');
  const [contractorTimeTo, setContractorTimeTo] = useState('');
  const [orgSuggestionsOpen, setOrgSuggestionsOpen] = useState(false);
  const isLimitedView = !user || user.role === 'admin' || user.role === 'guard';
  const showExtraFilters = ['Подрядчик', 'Белый', 'Чёрный'].includes(statusFilter);
  const isContractorFilter = statusFilter === 'Подрядчик';

  const getStatusStyles = (status: Event['status']) => {
    const styles = {
      'Чёрный': 'bg-red-50 text-red-500',
      'Белый': 'bg-emerald-50 text-emerald-500',
      'Подрядчик': 'bg-purple-50 text-purple-500',
      'Нет в списках': 'bg-orange-50 text-orange-500'
    };
    return styles[status];
  };

  const itemsPerPage = 10;

  const countryOptions = useMemo(() => {
    const present = new Set(
      MOCK_EVENTS.map((event) => getPlateCountryInfo(event.plateNumber).code).filter(
        (code) => code !== 'UNKNOWN'
      )
    );

    const filtered = PLATE_COUNTRY_OPTIONS.filter((option) => present.has(option.value));
    return filtered.map((option) => ({ value: option.value, label: option.value }));
  }, []);

  const listOptions = [
    { value: 'Белый', label: 'Белый список' },
    { value: 'Чёрный', label: 'Чёрный список' },
    { value: 'Подрядчик', label: 'Подрядчики' },
    { value: 'Нет в списках', label: 'Нет в списках' }
  ];

  const contractorOrganizations = useMemo(() => {
    const stored = getStoredVehiclesByCategory('contractor');
    const merged = mergeVehicles(BASE_VEHICLES.contractor, stored);
    const names = merged.map((vehicle) => vehicle.owner.trim()).filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, 'ru'));
  }, []);

  const filteredOrganizations = useMemo(() => {
    const query = contractorQuery.trim().toLowerCase();
    if (!query) return contractorOrganizations;
    const normalizedQuery = normalizeOrganizationName(query);

    return contractorOrganizations.filter((name) => {
      const lowerName = name.toLowerCase();
      const normalizedName = normalizeOrganizationName(lowerName);

      if (normalizedQuery) {
        return (
          lowerName.startsWith(query) ||
          normalizedName.startsWith(normalizedQuery)
        );
      }

      return lowerName.startsWith(query);
    });
  }, [contractorOrganizations, contractorQuery]);


  const filteredEvents = useMemo(() => {
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
    const contractorFromSeconds = parseTimeToSeconds(contractorTimeFrom);
    const contractorToSeconds = parseTimeToSeconds(contractorTimeTo);
    const plateTokens = plateQuery
      .split(',')
      .map((value) => normalizePlateNumber(value))
      .filter(Boolean);
    const rawContractorQuery = contractorQuery.trim().toLowerCase();
    const normalizedContractorQuery = normalizeOrganizationName(contractorQuery);
    const initialsQuery = normalizeInitialsQuery(contractorQuery);
    const normalizedOwnerQuery = normalizeOwnerName(contractorQuery);

    return MOCK_EVENTS.filter((event) => {
      const matchesDate = matchesDateValue(event.date);

      const plateInfo = getPlateCountryInfo(event.plateNumber);
      const matchesCountry = !plateCountryFilter || plateInfo.code === plateCountryFilter;
      const matchesStatus = !statusFilter || event.status === statusFilter;
      const matchesPlate =
        plateTokens.length === 0 ||
        plateTokens.some((token) =>
          normalizePlateNumber(event.plateNumber).includes(token)
        );

      if (!matchesDate || !matchesCountry || !matchesStatus || !matchesPlate) return false;

      if (!showExtraFilters) {
        return true;
      }

      const normalizedOwner = normalizeOrganizationName(event.owner);
      const normalizedOwnerName = normalizeOwnerName(event.owner);
      const ownerInitials = getOwnerInitials(event.owner);
      const matchesOrganization = isContractorFilter
        ? !rawContractorQuery
          ? true
          : normalizedContractorQuery
          ? normalizedOwner.startsWith(normalizedContractorQuery) ||
            event.owner.toLowerCase().startsWith(rawContractorQuery)
          : event.owner.toLowerCase().startsWith(rawContractorQuery)
        : !rawContractorQuery
        ? true
        : (normalizedOwnerQuery && normalizedOwnerName.includes(normalizedOwnerQuery)) ||
          (initialsQuery && ownerInitials.startsWith(initialsQuery));

      const eventSeconds = parseTimeToSeconds(event.time);
      const matchesFrom =
        contractorFromSeconds === null ||
        (eventSeconds !== null && eventSeconds >= contractorFromSeconds);
      const matchesTo =
        contractorToSeconds === null ||
        (eventSeconds !== null && eventSeconds <= contractorToSeconds);

      return matchesOrganization && matchesFrom && matchesTo;
    });
  }, [
    dateFilter,
    plateQuery,
    plateCountryFilter,
    statusFilter,
    contractorQuery,
    contractorTimeFrom,
    contractorTimeTo
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    dateFilter,
    plateQuery,
    plateCountryFilter,
    statusFilter,
    contractorQuery,
    contractorTimeFrom,
    contractorTimeTo,
    dateSort
  ]);

  useEffect(() => {
    if (!showExtraFilters) {
      setContractorQuery('');
      setContractorTimeFrom('');
      setContractorTimeTo('');
      setOrgSuggestionsOpen(false);
      return;
    }
    if (!isContractorFilter) {
      setOrgSuggestionsOpen(false);
    }
  }, [showExtraFilters, isContractorFilter]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plateParam = params.get('plate') ?? '';
    const platesParam = params.get('plates') ?? '';
    const ownerParam = params.get('owner') ?? '';
    const statusParam = params.get('status') ?? '';
    const allowedStatuses = ['Белый', 'Чёрный', 'Подрядчик', 'Нет в списках'];

    if (platesParam) {
      setPlateQuery(platesParam);
    } else if (plateParam) {
      setPlateQuery(plateParam);
    }
    if (ownerParam) {
      setContractorQuery(ownerParam);
    }
    if (allowedStatuses.includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, []);

  const sortedEvents = useMemo(() => {
    const next = [...filteredEvents];
    next.sort((a, b) => {
      const diff =
        parseDateTimeToTimestamp(a.date, a.time) - parseDateTimeToTimestamp(b.date, b.time);
      return dateSort === 'asc' ? diff : -diff;
    });
    return next;
  }, [filteredEvents, dateSort]);

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const displayedEvents = sortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setDateFilter('');
    setPlateQuery('');
    setPlateCountryFilter('');
    setStatusFilter('');
    setContractorQuery('');
    setContractorTimeFrom('');
    setContractorTimeTo('');
    setOrgSuggestionsOpen(false);
    setDateSort('desc');
    setCurrentPage(1);
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl mb-2">Журнал въездов</h1>
          <p className="text-sm text-gray-600">Полная история событий распознавания</p>
        </div>
        {user?.role === 'office_admin' && (
          <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
            Экспорт
          </Button>
        )}
      </div>

        <FilterBar>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <DatePickerInput
                label={'Дата'}
                value={dateFilter}
                onChange={(value) => setDateFilter(formatDateInput(value))}
                placeholder={'ДД.ММ.ГГГГ'}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Input
                label={'Номер'}
                value={plateQuery}
                onChange={setPlateQuery}
                placeholder={'А123ВС'}
                type="text"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Select
                label={'Регион номера'}
                value={plateCountryFilter}
                onChange={setPlateCountryFilter}
                placeholder={'Все номера'}
                options={countryOptions}
                size="md"
                className="h-[36px]"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Select
                label={'Список'}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder={'Все списки'}
                options={listOptions}
                size="md"
                className="h-[36px]"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="destructive"
                onClick={handleResetFilters}
                className="h-[37px] px-4"
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>

        <div
          className="transition-all duration-300 ease-out"
          style={{
            maxHeight: showExtraFilters ? '220px' : '0px',
            opacity: showExtraFilters ? 1 : 0,
            marginTop: showExtraFilters ? '16px' : '0px',
            transform: showExtraFilters ? 'translateY(0)' : 'translateY(-6px)',
            pointerEvents: showExtraFilters ? 'auto' : 'none',
            overflow: showExtraFilters ? 'visible' : 'hidden'
          }}
          aria-hidden={!showExtraFilters}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_180px_180px] md:justify-start">
            <div className="relative">
              <Input
                label={isContractorFilter ? 'Организация' : 'Владелец'}
                value={contractorQuery}
                onChange={(value) => {
                  setContractorQuery(value);
                  if (isContractorFilter) {
                    setOrgSuggestionsOpen(true);
                  }
                }}
                onFocus={() => {
                  if (isContractorFilter) {
                    setOrgSuggestionsOpen(true);
                  }
                }}
                onBlur={() => {
                  if (isContractorFilter) {
                    window.setTimeout(() => setOrgSuggestionsOpen(false), 120);
                  }
                }}
                placeholder={isContractorFilter ? 'Начните ввод' : 'Иванов И.И.'}
              />
              {isContractorFilter &&
                orgSuggestionsOpen &&
                contractorQuery.trim() !== '' &&
                filteredOrganizations.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded text-sm shadow-lg z-20 overflow-hidden">
                    {filteredOrganizations.map((name) => (
                      <button
                        key={name}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setContractorQuery(name);
                          setOrgSuggestionsOpen(false);
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <TimePickerInput
              label={'Время с'}
              value={contractorTimeFrom}
              onChange={setContractorTimeFrom}
              placeholder="00:00:00"
              className="h-[36px]"
            />

            <TimePickerInput
              label={'Время по'}
              value={contractorTimeTo}
              onChange={setContractorTimeTo}
              placeholder="23:59:59"
              className="h-[36px]"
            />
          </div>
        </div>
      </FilterBar>


      {/* Table Section */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground tracking-tight">
            События распознавания
          </h2>
          <span className="text-sm text-muted-foreground">Всего: {filteredEvents.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
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
                {!isLimitedView && (
                  <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider w-36">
                    Камера
                  </th>
                )}
                <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Номер
                </th>
                <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                  Владелец
                </th>
                {!isLimitedView && (
                  <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider w-44">
                    Список
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {displayedEvents.length > 0 ? (
                displayedEvents.map((event, index) => {
                  const isUnrecognized = event.status === 'Нет в списках';
                  const ownerLabel = isUnrecognized ? 'Неизвестно' : event.owner;
                  const countryCode = getPlateCountryCode(event.plateNumber);
                  const formattedPlate = formatPlateNumber(event.plateNumber);

                  return (
                    <tr
                      key={index}
                      className="border-b border-border/50 hover:bg-muted/30 transition-smooth"
                    >
                      <td className="py-4 px-4 text-center text-[14px] text-foreground/80 font-mono transition-colors hover:text-foreground">
                        {`${event.date} ${event.time}`}
                      </td>
                      {!isLimitedView && (
                        <td className="py-4 px-4 text-center text-[14px] text-foreground/80">
                          {event.camera}
                        </td>
                      )}
                      <td className="py-4 px-4 text-center text-foreground/90 plate-text">
                        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
                          <span aria-hidden="true" />
                          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                            {formattedPlate}
                            <span className="text-[11px] text-muted-foreground font-semibold">
                              ({countryCode})
                            </span>
                          </span>
                          <span className="inline-flex items-center justify-start">
                            {isUnrecognized && (
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
                        {ownerLabel}
                      </td>
                      {!isLimitedView && (
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium ${getStatusStyles(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isLimitedView ? 3 : 5} className="py-8 text-center text-muted-foreground">
                    Нет данных
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-5 border-t border-border flex items-center justify-between bg-muted/20">
          <div className="text-sm font-medium text-muted-foreground">
            Показано {displayedEvents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredEvents.length)} из {filteredEvents.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>

            {totalPages > 0 && [...Array(totalPages)].map((_, i) => (
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
