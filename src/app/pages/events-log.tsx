import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Download } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useAuth } from '@/auth/authContext';
import { FilterBar } from '@/app/components/ui/filter-bar';
import { Input } from '@/app/components/ui/input';
import { DatePickerInput } from '@/app/components/ui/date-picker-input';
import { TimePickerInput } from '@/app/components/ui/time-picker-input';
import { Select } from '@/app/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { Button } from '@/app/components/ui/button';
import {
  formatPlateNumber,
  getPlateCountryInfo,
  getPlateCountryCode,
  normalizePlateNumber
} from '@/app/utils/plate';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import { PLATE_COUNTRY_OPTIONS } from '@/app/data/plateCountries';
import { MOCK_EVENTS, type EventLogEntry } from '@/app/data/events';
import { getStoredVehiclesByCategory, mergeVehicles } from '@/app/utils/vehicleStore';
import { formatDateInput, parseDateRange } from '@/app/utils/dateFilter';
import { isContractorOwnerExpiredOnDate } from '@/app/utils/contractorAccess';

type Event = EventLogEntry;
const SIDEBAR_SET_COLLAPSED_EVENT = 'app:sidebar:set-collapsed';
type ContractorActivityPoint = {
  label: string;
  entries: number;
  times?: string[];
};

const parseTimeToSeconds = (value: string) => {
  if (!value) return null;
  const parts = value.split(':').map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return null;
  const [hours = 0, minutes = 0, seconds = 0] = parts;
  if (hours > 23 || minutes > 59 || seconds > 59) return null;
  return hours * 3600 + minutes * 60 + seconds;
};

const parseTimeToHour = (value: string) => {
  const parts = value.split(':').map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return null;
  const [hours = 0] = parts;
  if (hours > 23) return null;
  return hours;
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

const parseDateValue = (value: string) => {
  const [day, month, year] = value.split('.').map((part) => Number(part));
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
};

const formatDayMonth = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
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

const pluralizeEntries = (value: number) => {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return 'въезд';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'въезда';
  return 'въездов';
};

export function EventsLog() {
  const { user } = useAuth();
  const canViewOwnerNames = user?.role !== 'guard';
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
  const [selectedContractorOwner, setSelectedContractorOwner] = useState<string | null>(null);
  const [contractorActivityRange, setContractorActivityRange] = useState<'today' | 'week' | 'month'>('today');
  const contractorAnalyticsRef = useRef<HTMLDivElement | null>(null);
  const lastSelectedContractorOwnerRef = useRef<string | null>(null);
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

  const contractorVehicles = useMemo(() => {
    const stored = getStoredVehiclesByCategory('contractor');
    return mergeVehicles(BASE_VEHICLES.contractor, stored);
  }, []);

  const contractorOrganizations = useMemo(() => {
    const names = contractorVehicles.map((vehicle) => vehicle.owner.trim()).filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [contractorVehicles]);

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
      const matchesOrganization = !canViewOwnerNames
        ? true
        : isContractorFilter
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
    canViewOwnerNames,
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
    if (canViewOwnerNames && ownerParam) {
      setContractorQuery(ownerParam);
    }
    if (allowedStatuses.includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, [canViewOwnerNames]);

  const sortedEvents = useMemo(() => {
    const next = [...filteredEvents];
    next.sort((a, b) => {
      const diff =
        parseDateTimeToTimestamp(a.date, a.time) - parseDateTimeToTimestamp(b.date, b.time);
      return dateSort === 'asc' ? diff : -diff;
    });
    return next;
  }, [filteredEvents, dateSort]);

  const selectedContractorNormalized = useMemo(
    () => (selectedContractorOwner ? normalizeOrganizationName(selectedContractorOwner) : ''),
    [selectedContractorOwner]
  );

  const contractorPanelOwner = selectedContractorOwner ?? lastSelectedContractorOwnerRef.current;
  const contractorPanelNormalized = useMemo(
    () => (contractorPanelOwner ? normalizeOrganizationName(contractorPanelOwner) : ''),
    [contractorPanelOwner]
  );

  const selectedContractorEvents = useMemo(() => {
    if (!contractorPanelNormalized) return [];
    return sortedEvents.filter(
      (event) =>
        event.status === 'Подрядчик' &&
        normalizeOrganizationName(event.owner) === contractorPanelNormalized
    );
  }, [contractorPanelNormalized, sortedEvents]);

  const selectedContractorActivity = useMemo<ContractorActivityPoint[]>(() => {
    if (!contractorPanelNormalized) return [];
    const datedEvents = selectedContractorEvents
      .map((event) => ({ event, date: parseDateValue(event.date) }))
      .filter((entry): entry is { event: EventLogEntry; date: Date } => entry.date !== null);

    if (datedEvents.length === 0) return [];

    const anchorDate = datedEvents.reduce((latest, current) =>
      current.date.getTime() > latest.getTime() ? current.date : latest
    , datedEvents[0].date);
    const anchorDay = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate());

    if (contractorActivityRange === 'today') {
      const buckets = new Map<number, { entries: number; times: string[] }>();
      for (let hour = 6; hour <= 21; hour += 1) {
        buckets.set(hour, { entries: 0, times: [] });
      }

      datedEvents.forEach(({ event, date }) => {
        const hour = parseTimeToHour(event.time);
        if (hour === null || !buckets.has(hour)) return;
        const bucket = buckets.get(hour);
        if (!bucket) return;
        bucket.entries += 1;
        bucket.times.push(`${event.date} ${event.time}`);
      });

      return Array.from(buckets.entries()).map(([hour, bucket]) => ({
        label: `${String(hour).padStart(2, '0')}:00`,
        entries: bucket.entries,
        times: bucket.times.sort((a, b) => {
          const [dateA = '', timeA = '00:00:00'] = a.split(' ');
          const [dateB = '', timeB = '00:00:00'] = b.split(' ');
          return parseDateTimeToTimestamp(dateA, timeA) - parseDateTimeToTimestamp(dateB, timeB);
        })
      }));
    }

    const daysBack = contractorActivityRange === 'week' ? 6 : 29;
    const startDay = new Date(anchorDay);
    startDay.setDate(startDay.getDate() - daysBack);

    const buckets = new Map<string, { label: string; entries: number }>();
    for (let index = 0; index <= daysBack; index += 1) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + index);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const key = dayStart.toISOString().slice(0, 10);
      buckets.set(key, { label: formatDayMonth(dayStart), entries: 0 });
    }

    datedEvents.forEach(({ date }) => {
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (dayStart < startDay || dayStart > anchorDay) return;
      const key = dayStart.toISOString().slice(0, 10);
      const bucket = buckets.get(key);
      if (!bucket) return;
      bucket.entries += 1;
    });

    return Array.from(buckets.values());
  }, [selectedContractorEvents, contractorPanelNormalized, contractorActivityRange]);

  const contractorPanelOpen = Boolean(selectedContractorOwner);
  const selectedContractorEntriesTotal = useMemo(
    () => selectedContractorActivity.reduce((sum, point) => sum + point.entries, 0),
    [selectedContractorActivity]
  );
  const contractorActivityMax = useMemo(() => {
    const maxValue = Math.max(0, ...selectedContractorActivity.map((point) => point.entries));
    if (maxValue <= 6) return 6;
    return Math.ceil(maxValue / 3) * 3;
  }, [selectedContractorActivity]);

  useEffect(() => {
    if (selectedContractorOwner) {
      lastSelectedContractorOwnerRef.current = selectedContractorOwner;
    }
  }, [selectedContractorOwner]);

  useEffect(() => {
    if (!selectedContractorOwner) return;
    const stillVisible = sortedEvents.some(
      (event) =>
        event.status === 'Подрядчик' &&
        normalizeOrganizationName(event.owner) === selectedContractorNormalized
    );
    if (!stillVisible) {
      setSelectedContractorOwner(null);
    }
  }, [selectedContractorOwner, selectedContractorNormalized, sortedEvents]);

  useEffect(() => {
    if (!selectedContractorOwner) return;

    const handlePointerDownOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (contractorAnalyticsRef.current?.contains(target)) return;
      setSelectedContractorOwner(null);
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
    };
  }, [selectedContractorOwner]);

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
    setSelectedContractorOwner(null);
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
            <div className="w-56 min-w-[220px]">
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
                className="h-[36px] px-4"
              >
                Сбросить
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
          <div
            className={`grid grid-cols-1 gap-4 md:justify-start ${
              canViewOwnerNames ? 'md:grid-cols-[240px_180px_180px]' : 'md:grid-cols-[180px_180px]'
            }`}
          >
            {canViewOwnerNames && (
              <div className="relative z-50">
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
                  filteredOrganizations.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded text-sm shadow-lg z-[120] max-h-52 overflow-y-auto">
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
            )}

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
      <div
        ref={contractorAnalyticsRef}
        className={`grid items-start transition-[grid-template-columns,gap] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          contractorPanelOpen ? 'gap-4' : 'gap-0'
        }`}
        style={{
          gridTemplateColumns: contractorPanelOpen
            ? 'minmax(320px, 42%) minmax(0, 1fr)'
            : '0px minmax(0, 1fr)'
        }}
      >
        <div
          className={`overflow-hidden will-change-[opacity,transform,max-width] transition-[opacity,transform,max-width,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            contractorPanelOpen
              ? 'opacity-100 translate-x-0 max-w-[1000px] blur-0'
              : 'opacity-0 -translate-x-4 max-w-0 pointer-events-none blur-[1px]'
          }`}
        >
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[20px] font-bold text-foreground tracking-tight">Активность въездов</h2>
                {contractorPanelOwner && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">{contractorPanelOwner}</p>
                )}
              </div>
              <div
                className="inline-flex h-10 items-center rounded-xl border border-border bg-muted/20 p-1"
                data-contractor-interactive="true"
              >
                {[
                  { value: 'today', label: 'Сегодня' },
                  { value: 'week', label: 'Неделя' },
                  { value: 'month', label: 'Месяц' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setContractorActivityRange(option.value as 'today' | 'week' | 'month')}
                    className={`h-8 rounded-lg px-3 text-sm transition-colors ${
                      contractorActivityRange === option.value
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[560px] p-5">
              <ResponsiveContainer width="100%" height="92%">
                <LineChart data={selectedContractorActivity} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e8ecf1" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#97A0AF', fontSize: 12 }}
                    tickMargin={10}
                    minTickGap={16}
                    height={34}
                    tickFormatter={(value) =>
                      contractorActivityRange === 'today'
                        ? String(value).replace(':00', '')
                        : String(value)
                    }
                    interval={
                      contractorActivityRange === 'today'
                        ? 1
                        : contractorActivityRange === 'month'
                        ? 3
                        : 0
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#97A0AF', fontSize: 12 }}
                    domain={[0, contractorActivityMax]}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    cursor={{ stroke: '#d9deea', strokeWidth: 1 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const value = Number(payload[0]?.value ?? 0);
                      return (
                        <div className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                          {value} {pluralizeEntries(value)}
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="entries"
                    stroke="#5b65f5"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, fill: '#5b65f5', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 text-sm text-muted-foreground">
                Всего въездов подрядчика за период: {selectedContractorEntriesTotal}
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-border flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-foreground tracking-tight">
              События распознавания
            </h2>
            <span className="text-sm text-muted-foreground">Всего: {filteredEvents.length}</span>
          </div>

          <div
            className="overflow-x-auto overflow-y-visible"
            onClick={(event) => {
              if (!contractorPanelOpen) return;
              if (event.target === event.currentTarget) {
                setSelectedContractorOwner(null);
              }
            }}
          >
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
                  {canViewOwnerNames && (
                    <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                      Владелец
                    </th>
                  )}
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
                    const contractorExpired =
                      event.status === 'Подрядчик' &&
                      isContractorOwnerExpiredOnDate(event.owner, event.date, contractorVehicles);
                    const normalizedEventOwner = normalizeOrganizationName(event.owner);
                    const isContractorRow = event.status === 'Подрядчик';
                    const isSelectedContractor =
                      isContractorRow &&
                      selectedContractorNormalized.length > 0 &&
                      normalizedEventOwner === selectedContractorNormalized;

                    const handleContractorToggle = () => {
                      if (!isContractorRow) return;
                      setSelectedContractorOwner((prev) =>
                        {
                          const nextOwner =
                            prev && normalizeOrganizationName(prev) === normalizedEventOwner
                              ? null
                              : event.owner;

                          if (nextOwner) {
                            window.dispatchEvent(
                              new CustomEvent(SIDEBAR_SET_COLLAPSED_EVENT, {
                                detail: { collapsed: true }
                              })
                            );
                          }

                          return nextOwner;
                        }
                      );
                    };

                    return (
                      <tr
                        key={index}
                        onClick={isContractorRow ? handleContractorToggle : undefined}
                        className={`border-b border-border/50 transition-smooth ${
                          isContractorRow
                            ? isSelectedContractor
                              ? 'bg-slate-200 hover:bg-slate-300 cursor-pointer'
                              : 'hover:bg-slate-100 cursor-pointer'
                            : 'hover:bg-muted/30'
                        }`}
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
                              <span className="text-[11px] text-foreground/70 font-semibold">
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
                        {canViewOwnerNames && (
                          <td className="py-4 px-4 text-center text-[14px] text-foreground/80">
                            <div className="flex flex-col items-center gap-1">
                              {isContractorRow ? (
                                <span className="max-w-full text-foreground/80">
                                  <span className="block truncate">{ownerLabel}</span>
                                </span>
                              ) : (
                                <span>{ownerLabel}</span>
                              )}
                              {contractorExpired && (
                                <span className="text-[13px] leading-tight text-red-500">
                                  Срок действия подрядчика истек
                                </span>
                              )}
                            </div>
                          </td>
                        )}
                        {!isLimitedView && (
                          <td className="py-4 px-4 text-center">
                            {isContractorRow ? (
                              <span className="inline-flex">
                                <span
                                  className={`inline-flex min-w-[140px] items-center justify-center px-3 py-1 rounded-full text-[13px] font-medium ${getStatusStyles(
                                    event.status
                                  )} ${isSelectedContractor ? 'ring-2 ring-slate-300' : ''}`}
                                >
                                  {event.status}
                                </span>
                              </span>
                            ) : (
                              <span
                                className={`inline-flex min-w-[140px] items-center justify-center px-3 py-1 rounded-full text-[13px] font-medium ${getStatusStyles(
                                  event.status
                                )}`}
                              >
                                {event.status}
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={(isLimitedView ? 2 : 4) + (canViewOwnerNames ? 1 : 0)}
                      className="py-8 text-center text-muted-foreground"
                    >
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
      </div>
    </>
  );
}

