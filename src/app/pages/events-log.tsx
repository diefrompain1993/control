import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Download } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { getRoutePath } from '@/app/routesConfig';
import { usePaginatedPageScroll } from '@/app/hooks/use-paginated-page-scroll';

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
  const isGuard = user?.role === 'guard';
  const isOfficeAdmin = user?.role === 'office_admin';
  const canViewOwnerNames = user?.role !== 'guard';
  const canToggleContractorRows = user?.role !== 'guard';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedContractorOwner, setSelectedContractorOwner] = useState<string | null>(null);
  const [contractorActivityRange, setContractorActivityRange] = useState<'today' | 'week' | 'month'>('today');
  const [contractorChartScrollLeft, setContractorChartScrollLeft] = useState(0);
  const contractorAnalyticsRef = useRef<HTMLDivElement | null>(null);
  const contractorChartScrollRef = useRef<HTMLDivElement | null>(null);
  const contractorChartScrollRafRef = useRef<number | null>(null);
  const lastSelectedContractorOwnerRef = useRef<string | null>(null);
  const lastAutoScrollSignatureRef = useRef<string>('');
  const lastAutoRangeOwnerRef = useRef<string>('');
  const isLimitedView = !user || user.role === 'admin' || user.role === 'guard';
  const showCameraColumn = !isLimitedView;
  const showStatusColumn = !isLimitedView || user?.role === 'guard';
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
  const { handlePageChange: handleTablePageChange, resetPageScrollMemory: resetTablePageScrollMemory } =
    usePaginatedPageScroll({
      currentPage,
      setCurrentPage,
      hostRef: contractorAnalyticsRef
    });

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
    resetTablePageScrollMemory();
    setCurrentPage(1);
  }, [
    dateFilter,
    plateQuery,
    plateCountryFilter,
    statusFilter,
    contractorQuery,
    contractorTimeFrom,
    contractorTimeTo,
    dateSort,
    resetTablePageScrollMemory
  ]);

  useEffect(() => {
    const detectSidebarState = () => {
      const aside = document.querySelector('aside');
      if (!aside) return;
      setIsSidebarCollapsed(aside.getBoundingClientRect().width <= 100);
    };
    const handleSetCollapsed = (event: Event) => {
      const customEvent = event as CustomEvent<{ collapsed?: boolean }>;
      if (typeof customEvent.detail?.collapsed === 'boolean') {
        setIsSidebarCollapsed(customEvent.detail.collapsed);
        return;
      }
      detectSidebarState();
    };

    detectSidebarState();
    window.addEventListener(SIDEBAR_SET_COLLAPSED_EVENT, handleSetCollapsed as EventListener);
    window.addEventListener('resize', detectSidebarState);
    return () => {
      window.removeEventListener(
        SIDEBAR_SET_COLLAPSED_EVENT,
        handleSetCollapsed as EventListener
      );
      window.removeEventListener('resize', detectSidebarState);
    };
  }, []);

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
    const ownerParam = (params.get('owner') ?? '').trim();
    const statusParam = params.get('status') ?? '';
    const allowedStatuses = ['Белый', 'Чёрный', 'Подрядчик', 'Нет в списках'];
    const shouldOpenContractorPanel =
      canViewOwnerNames && Boolean(ownerParam) && statusParam === 'Подрядчик';

    if (shouldOpenContractorPanel) {
      // For contractor links we always show organization-level activity.
      setPlateQuery('');
      setStatusFilter('Подрядчик');
      setContractorQuery(ownerParam);
      setSelectedContractorOwner(ownerParam);
      return;
    }

    if (platesParam) {
      setPlateQuery(platesParam);
    } else if (plateParam) {
      setPlateQuery(plateParam);
    }
    if (canViewOwnerNames && ownerParam) {
      setSelectedContractorOwner(null);
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

    const now = new Date();
    const referenceDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (contractorActivityRange === 'today') {
      const buckets = new Map<number, { entries: number; times: string[] }>();
      for (let hour = 0; hour <= 23; hour += 1) {
        buckets.set(hour, { entries: 0, times: [] });
      }

      datedEvents.forEach(({ event, date }) => {
        if (
          date.getDate() !== referenceDay.getDate() ||
          date.getMonth() !== referenceDay.getMonth() ||
          date.getFullYear() !== referenceDay.getFullYear()
        ) {
          return;
        }
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
    const startDay = new Date(referenceDay);
    startDay.setDate(referenceDay.getDate() - daysBack);

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
      if (dayStart < startDay || dayStart > referenceDay) return;
      const key = dayStart.toISOString().slice(0, 10);
      const bucket = buckets.get(key);
      if (!bucket) return;
      bucket.entries += 1;
    });

    return Array.from(buckets.values());
  }, [selectedContractorEvents, contractorPanelNormalized, contractorActivityRange]);

  const contractorPanelOpen = Boolean(selectedContractorOwner);
  const isCompactTableLayout = contractorPanelOpen;
  const selectedContractorEntriesTotal = useMemo(
    () => selectedContractorActivity.reduce((sum, point) => sum + point.entries, 0),
    [selectedContractorActivity]
  );
  const handleOpenContractorExport = useCallback(() => {
    const params = new URLSearchParams();
    params.set('export', 'contractors');
    params.set('period', contractorActivityRange === 'month' ? '1m' : contractorActivityRange);
    const contractorName = contractorPanelOwner?.trim();
    if (contractorName) {
      params.set('contractor', contractorName);
    }
    const targetPath = `${getRoutePath('export')}?${params.toString()}`;
    window.history.pushState({}, '', targetPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [contractorActivityRange, contractorPanelOwner]);
  const contractorActivityMax = useMemo(() => {
    const maxValue = Math.max(0, ...selectedContractorActivity.map((point) => point.entries));
    if (maxValue <= 6) return 6;
    return Math.ceil(maxValue / 3) * 3;
  }, [selectedContractorActivity]);
  const lastActiveContractorPointIndex = useMemo(() => {
    for (let index = selectedContractorActivity.length - 1; index >= 0; index -= 1) {
      if ((selectedContractorActivity[index]?.entries ?? 0) > 0) {
        return index;
      }
    }
    return -1;
  }, [selectedContractorActivity]);
  const targetContractorPointIndex = useMemo(
    () => (lastActiveContractorPointIndex >= 0 ? lastActiveContractorPointIndex : 0),
    [lastActiveContractorPointIndex]
  );
  const contractorChartMinWidth = useMemo(() => {
    const pointWidth =
      contractorActivityRange === 'today'
        ? isSidebarCollapsed
          ? 56
          : 50
        : contractorActivityRange === 'week'
        ? isSidebarCollapsed
          ? 94
          : 84
        : isSidebarCollapsed
        ? 68
        : 60;
    return Math.max(760, selectedContractorActivity.length * pointWidth);
  }, [selectedContractorActivity.length, contractorActivityRange, isSidebarCollapsed]);

  useEffect(() => {
    if (!selectedContractorOwner) {
      lastAutoRangeOwnerRef.current = '';
      return;
    }

    const ownerNormalized = normalizeOrganizationName(selectedContractorOwner);
    if (!ownerNormalized || lastAutoRangeOwnerRef.current === ownerNormalized) return;

    const now = new Date();
    const referenceDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(referenceDay);
    weekStart.setDate(referenceDay.getDate() - 6);
    const monthStart = new Date(referenceDay);
    monthStart.setDate(referenceDay.getDate() - 29);

    const contractorDates = selectedContractorEvents
      .map((event) => parseDateValue(event.date))
      .filter((value): value is Date => value !== null)
      .map((date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()));

    if (contractorDates.length === 0) {
      lastAutoRangeOwnerRef.current = ownerNormalized;
      return;
    }

    const hasTodayEntries = contractorDates.some(
      (date) => date.getTime() === referenceDay.getTime()
    );
    const hasWeekEntries = contractorDates.some(
      (date) => date.getTime() >= weekStart.getTime() && date.getTime() <= referenceDay.getTime()
    );

    const nextRange: 'today' | 'week' | 'month' = hasTodayEntries
      ? 'today'
      : hasWeekEntries
      ? 'week'
      : 'month';

    setContractorActivityRange(nextRange);
    lastAutoRangeOwnerRef.current = ownerNormalized;
  }, [selectedContractorOwner, selectedContractorEvents]);

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
      const targetElement = target instanceof Element ? target : null;
      if (targetElement?.closest('[data-sidebar-toggle="true"]')) return;
      if (contractorAnalyticsRef.current?.contains(target)) return;
      setSelectedContractorOwner(null);
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
    };
  }, [selectedContractorOwner]);

  useEffect(() => {
    if (!contractorPanelOpen) {
      lastAutoScrollSignatureRef.current = '';
      return;
    }
    const container = contractorChartScrollRef.current;
    if (!container || selectedContractorActivity.length === 0) return;
    const signature = [
      contractorPanelOwner ?? '',
      contractorActivityRange,
      selectedContractorActivity.length,
      targetContractorPointIndex,
      isSidebarCollapsed ? 'collapsed' : 'expanded'
    ].join('|');
    if (lastAutoScrollSignatureRef.current === signature) return;

    const scrollToTargetPoint = (behavior: ScrollBehavior) => {
      const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
      if (maxScrollLeft <= 0) return false;

      const pointWidth = contractorChartMinWidth / selectedContractorActivity.length;
      const pointCenter = (targetContractorPointIndex + 0.5) * pointWidth;
      const targetScrollLeft = Math.max(
        0,
        Math.min(maxScrollLeft, pointCenter - container.clientWidth / 2)
      );
      container.scrollTo({ left: targetScrollLeft, behavior });
      return true;
    };

    const animationFrameId = window.requestAnimationFrame(() => {
      scrollToTargetPoint('auto');
    });
    const settleTimeoutId = window.setTimeout(() => {
      const didScroll = scrollToTargetPoint('smooth');
      if (didScroll) {
        lastAutoScrollSignatureRef.current = signature;
      }
    }, 520);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(settleTimeoutId);
    };
  }, [
    contractorPanelOpen,
    selectedContractorActivity,
    contractorChartMinWidth,
    targetContractorPointIndex,
    contractorActivityRange,
    contractorPanelOwner,
    isSidebarCollapsed
  ]);

  useEffect(() => {
    return () => {
      if (contractorChartScrollRafRef.current !== null) {
        window.cancelAnimationFrame(contractorChartScrollRafRef.current);
      }
    };
  }, []);

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const displayedEvents = sortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const eventsTableColSpan =
    2 + (showCameraColumn ? 1 : 0) + (canViewOwnerNames ? 1 : 0) + (showStatusColumn ? 1 : 0);
  const tableFillerRowCount =
    displayedEvents.length > 0 ? Math.max(0, itemsPerPage - displayedEvents.length) : 0;

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
    resetTablePageScrollMemory();
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
                className={isOfficeAdmin ? 'h-[36px]' : undefined}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Input
                label={'Номер'}
                value={plateQuery}
                onChange={setPlateQuery}
                placeholder={'А123ВС'}
                type="text"
                clearable
                clearButtonAriaLabel="Очистить номер"
                className={isOfficeAdmin ? 'h-[36px]' : undefined}
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
                className={isOfficeAdmin ? 'h-[36px]' : 'h-[36px]'}
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
                className={isOfficeAdmin ? 'h-[36px]' : 'h-[36px]'}
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
        onMouseDown={(event) => {
          if (!contractorPanelOpen) return;
          if (event.target !== event.currentTarget) return;
          setSelectedContractorOwner(null);
        }}
        style={{
          gridTemplateColumns: contractorPanelOpen
            ? isSidebarCollapsed
              ? 'minmax(300px, 35%) minmax(0, 1fr)'
              : 'minmax(280px, 31%) minmax(0, 1fr)'
            : '0px minmax(0, 1fr)'
        }}
      >
        <div
          className={`self-start mt-0 overflow-hidden transition-[opacity,max-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            contractorPanelOpen
              ? 'opacity-100 max-w-[1000px]'
              : 'opacity-0 max-w-0 pointer-events-none'
          }`}
        >
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-border flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[20px] font-bold text-foreground tracking-tight">Активность въездов</h2>
                {contractorPanelOwner && (
                  <p className="mt-1 truncate text-sm font-medium text-foreground/75">{contractorPanelOwner}</p>
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

            <div className="h-[clamp(432px,69vh,572px)] px-5 pt-5 pb-6 flex flex-col">
              <div
                ref={contractorChartScrollRef}
                className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden pb-2"
                onScroll={() => {
                  const container = contractorChartScrollRef.current;
                  if (!container) return;
                  if (contractorChartScrollRafRef.current !== null) {
                    window.cancelAnimationFrame(contractorChartScrollRafRef.current);
                  }
                  contractorChartScrollRafRef.current = window.requestAnimationFrame(() => {
                    setContractorChartScrollLeft(container.scrollLeft);
                  });
                }}
              >
                <div style={{ minWidth: `${contractorChartMinWidth}px`, height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedContractorActivity} margin={{ top: 8, right: 10, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e8ecf1" />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 6, right: 26 }}
                        tick={{ fill: '#97A0AF', fontSize: 12 }}
                        tickMargin={10}
                        minTickGap={contractorActivityRange === 'month' ? 24 : 14}
                        height={34}
                        tickFormatter={(value) =>
                          contractorActivityRange === 'today'
                            ? String(value).replace(':00', '')
                            : String(value)
                        }
                        interval={0}
                      />
                      <YAxis
                        width={30}
                        tickMargin={6}
                        tickLine={false}
                        axisLine={{ stroke: '#111827', strokeOpacity: 0.24, strokeWidth: 1 }}
                        tick={{ fill: '#97A0AF', fontSize: 12 }}
                        domain={[0, contractorActivityMax]}
                        allowDecimals={false}
                        tickFormatter={(value) => (Number(value) === 0 ? '' : String(value))}
                        style={{
                          transform: `translateX(${contractorChartScrollLeft}px)`
                        }}
                      />
                      <RechartsTooltip
                        cursor={{ stroke: '#d9deea', strokeWidth: 1 }}
                        offset={10}
                        wrapperStyle={{ pointerEvents: 'none' }}
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
                </div>
              </div>

              <div className="mt-[21px] flex min-h-9 items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground leading-none">
                  Всего въездов подрядчика за период: {selectedContractorEntriesTotal}
                </div>
                <Button
                  variant="secondary"
                  onClick={handleOpenContractorExport}
                  icon={<Download className="w-4 h-4" />}
                  className="h-9 px-4"
                >
                  Экспорт
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 self-start mt-0 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-border flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-foreground tracking-tight">
              События распознавания
            </h2>
            <span className="text-sm text-muted-foreground">Всего: {filteredEvents.length}</span>
          </div>

          <div
            className="overflow-x-auto overflow-y-hidden"
            onClick={(event) => {
              if (!contractorPanelOpen) return;
              if (event.target === event.currentTarget) {
                setSelectedContractorOwner(null);
              }
            }}
          >
            <table className="w-full table-fixed">
              <colgroup>
                {isGuard ? (
                  <>
                    <col style={{ width: showStatusColumn ? '34%' : '50%' }} />
                    <col style={{ width: showStatusColumn ? '33%' : '50%' }} />
                    {showStatusColumn && <col style={{ width: '33%' }} />}
                  </>
                ) : (
                  <>
                    <col style={{ width: isCompactTableLayout ? 196 : 220 }} />
                    {showCameraColumn && <col style={{ width: isCompactTableLayout ? 108 : 124 }} />}
                    <col style={{ width: isCompactTableLayout ? 196 : 220 }} />
                    {canViewOwnerNames && <col style={{ width: isCompactTableLayout ? 176 : 210 }} />}
                    {showStatusColumn && <col style={{ width: isCompactTableLayout ? 148 : 170 }} />}
                  </>
                )}
              </colgroup>
              <thead>
                <tr className="bg-muted/20 border-b border-border">
                  <th
                    className={`py-4 text-[12px] font-bold uppercase tracking-wider ${
                      isGuard
                        ? 'pl-8 pr-3 text-left'
                        : isOfficeAdmin
                          ? 'pl-8 pr-3 text-left'
                        : isCompactTableLayout
                          ? 'pl-4 pr-2 text-left'
                          : 'pl-5 pr-3 text-left'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setDateSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                      style={
                        isOfficeAdmin
                          ? { paddingLeft: '18px' }
                          : isGuard
                            ? { paddingLeft: '18px' }
                            : undefined
                      }
                      className={`inline-flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors text-[12px] font-bold uppercase tracking-wider ${
                        isGuard || isOfficeAdmin
                          ? 'w-full appearance-none border-0 bg-transparent p-0 m-0 text-left justify-start'
                          : ''
                      }`}
                    >
                      Дата и время
                      {dateSort === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </th>
                  {showCameraColumn && (
                    <th
                      className={`py-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider ${
                        isCompactTableLayout ? 'px-0 text-center' : 'pl-3 pr-3 text-left'
                      }`}
                    >
                      Камера
                    </th>
                  )}
                  <th
                    className={`text-center py-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider ${
                      isCompactTableLayout ? 'px-3' : 'px-4'
                    }`}
                  >
                    Номер
                  </th>
                  {canViewOwnerNames && (
                    <th
                      className={`text-center py-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider ${
                        isCompactTableLayout ? 'px-3' : 'px-4'
                      }`}
                    >
                      Владелец
                    </th>
                  )}
                  {showStatusColumn && (
                    <th
                      className={`py-4 text-center text-[12px] font-bold text-foreground/70 uppercase tracking-wider ${
                        isGuard ? 'px-4' : isCompactTableLayout ? 'pl-2 pr-4' : 'pl-3 pr-5'
                      }`}
                    >
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
                    const countryCode = getPlateCountryCode(event.plateNumber, event.country);
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
                          return prev && normalizeOrganizationName(prev) === normalizedEventOwner
                            ? null
                            : event.owner;
                        }
                      );
                    };

                    return (
                      <tr
                        key={index}
                        onClick={
                          isContractorRow && canToggleContractorRows
                            ? handleContractorToggle
                            : undefined
                        }
                        className={`border-b border-border/50 transition-smooth ${
                          isContractorRow
                            ? isSelectedContractor
                              ? canToggleContractorRows
                                ? 'bg-slate-200 hover:bg-slate-300 cursor-pointer'
                                : 'bg-slate-200 hover:bg-slate-200'
                              : canToggleContractorRows
                                ? 'hover:bg-slate-100 cursor-pointer'
                                : 'hover:bg-muted/30'
                            : 'hover:bg-muted/30'
                        }`}
                      >
                        <td
                          className={`py-4 text-[14px] text-foreground/80 transition-colors hover:text-foreground ${
                            isGuard
                              ? 'pl-8 pr-3 text-left font-mono'
                              : isOfficeAdmin
                                ? 'pl-8 pr-3 text-left font-mono'
                              : isCompactTableLayout
                                ? 'pl-4 pr-2 text-left font-mono'
                                : 'pl-5 pr-3 text-left font-mono'
                          }`}
                        >
                          {`${event.date} ${event.time}`}
                        </td>
                        {showCameraColumn && (
                          <td
                            className={`py-4 text-[14px] text-foreground/80 ${
                              isCompactTableLayout ? 'px-0 text-center' : 'pl-3 pr-3 text-left'
                            }`}
                          >
                            {event.camera}
                          </td>
                        )}
                        <td
                          className={`py-4 text-center text-foreground/90 plate-text ${
                            isCompactTableLayout ? 'px-3' : 'px-4'
                          }`}
                        >
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
                          <td
                            className={`py-4 text-center text-[14px] text-foreground/80 ${
                              isCompactTableLayout ? 'px-3' : 'px-4'
                            }`}
                          >
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
                        {showStatusColumn && (
                          <td
                            className={`py-4 text-center ${
                              isGuard ? 'px-4' : isCompactTableLayout ? 'pl-2 pr-4' : 'pl-3 pr-5'
                            }`}
                          >
                            {isContractorRow ? (
                              <span className="inline-flex">
                                <span
                                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-full py-1 font-medium ${
                                    isCompactTableLayout
                                      ? 'min-w-[124px] px-2.5 text-[12px]'
                                      : 'min-w-[140px] px-3 text-[13px]'
                                  } ${getStatusStyles(
                                    event.status
                                  )} ${isSelectedContractor ? 'ring-2 ring-slate-300' : ''}`}
                                >
                                  {event.status}
                                </span>
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-full py-1 font-medium ${
                                  isCompactTableLayout
                                    ? 'min-w-[124px] px-2.5 text-[12px]'
                                    : 'min-w-[140px] px-3 text-[13px]'
                                } ${getStatusStyles(
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
                      colSpan={eventsTableColSpan}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Нет данных
                    </td>
                  </tr>
                )}
                {tableFillerRowCount > 0 &&
                  Array.from({ length: tableFillerRowCount }).map((_, index) => (
                    <tr key={`filler-${currentPage}-${index}`} aria-hidden="true">
                      <td colSpan={eventsTableColSpan} className="h-[54px] border-b border-border/40 bg-muted/10" />
                    </tr>
                  ))}
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
                onClick={() => handleTablePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
              </button>

              {totalPages > 0 && [...Array(totalPages)].map((_, i) => (
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
      </div>
    </>
  );
}

