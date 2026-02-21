import { ArrowRight, MessageSquare, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatPlateNumber, getPlateCountryCode } from '@/app/utils/plate';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import { MOCK_EVENTS, type EventLogEntry } from '@/app/data/events';
import { getStoredVehicles, mergeVehicles, type StoredVehicle } from '@/app/utils/vehicleStore';
import { getRoutePath } from '@/app/routesConfig';
import { useAuth } from '@/auth/authContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

interface QuickSearchProps {
  className?: string;
}

type SearchResult =
  | { status: 'found'; vehicles: StoredVehicle[] }
  | { status: 'found_event'; events: EventLogEntry[] }
  | { status: 'not_found'; plateNumber: string };

let lastQuickSearchPlate = '';
const QUICK_SEARCH_STORAGE_KEY = 'quick_search_state';

const readStoredQuickSearch = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(QUICK_SEARCH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { plate?: string; performed?: boolean };
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      plate: typeof parsed.plate === 'string' ? parsed.plate : '',
      performed: Boolean(parsed.performed)
    };
  } catch {
    return null;
  }
};

const writeStoredQuickSearch = (plate: string, performed: boolean) => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(
    QUICK_SEARCH_STORAGE_KEY,
    JSON.stringify({ plate, performed })
  );
};

const categoryShortLabels: Record<StoredVehicle['category'], string> = {
  white: 'Белый',
  black: 'Чёрный',
  contractor: 'Подрядчики',
  unlisted: 'Нет в списках'
};

const categoryTextColors: Record<StoredVehicle['category'], string> = {
  white: 'text-emerald-500',
  black: 'text-red-500',
  contractor: 'text-purple-500',
  unlisted: 'text-orange-500'
};

const statusTextColors: Record<EventLogEntry['status'], string> = {
  'Белый': 'text-emerald-500',
  'Чёрный': 'text-red-500',
  'Подрядчик': 'text-purple-500',
  'Нет в списках': 'text-orange-500'
};

const statusShortLabels: Record<EventLogEntry['status'], string> = {
  'Белый': 'Белый',
  'Чёрный': 'Чёрный',
  'Подрядчик': 'Подрядчики',
  'Нет в списках': 'Нет в списках'
};

const statusByCategory: Record<StoredVehicle['category'], EventLogEntry['status']> = {
  white: 'Белый',
  black: 'Чёрный',
  contractor: 'Подрядчик',
  unlisted: 'Нет в списках'
};

const listBadgeByTextColor: Record<string, string> = {
  'text-emerald-500': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'text-red-500': 'border-red-200 bg-red-50 text-red-700',
  'text-purple-500': 'border-purple-200 bg-purple-50 text-purple-700',
  'text-orange-500': 'border-orange-200 bg-orange-50 text-orange-700'
};

const PLATE_LETTER_MAP: Record<string, string> = {
  A: 'A',
  B: 'B',
  C: 'C',
  E: 'E',
  H: 'H',
  K: 'K',
  M: 'M',
  O: 'O',
  P: 'P',
  T: 'T',
  X: 'X',
  Y: 'Y',
  R: 'P',
  А: 'A',
  В: 'B',
  С: 'C',
  Е: 'E',
  Н: 'H',
  К: 'K',
  М: 'M',
  О: 'O',
  Р: 'P',
  Т: 'T',
  Х: 'X',
  У: 'Y'
};

const normalizePlateForSearch = (value: string) =>
  value
    .toUpperCase()
    .replace(/[\s-]+/g, '')
    .replace(/[A-Z\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425]/g, (char) =>
      PLATE_LETTER_MAP[char] ?? char
    );

export function QuickSearch({ className }: QuickSearchProps) {
  const { user } = useAuth();
  const canViewOwnerNames = user?.role !== 'guard';
  const [plateNumber, setPlateNumber] = useState(() => lastQuickSearchPlate);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const baseVehicles = useMemo(
    () => [
      ...BASE_VEHICLES.white,
      ...BASE_VEHICLES.black,
      ...BASE_VEHICLES.contractor,
      ...BASE_VEHICLES.unlisted
    ],
    []
  );

  const runSearch = useCallback((value: string) => {
    const normalizedPlate = normalizePlateForSearch(value);
    if (!normalizedPlate) {
      setSearchResult(null);
      return;
    }

    const vehicles = mergeVehicles(baseVehicles, getStoredVehicles());
    const vehicleMatches = vehicles.filter((vehicle) => {
      const normalizedVehicle = normalizePlateForSearch(vehicle.plateNumber);
      return (
        normalizedVehicle === normalizedPlate ||
        normalizedVehicle.includes(normalizedPlate) ||
        normalizedPlate.includes(normalizedVehicle)
      );
    });

    if (vehicleMatches.length > 0) {
      setSearchResult({ status: 'found', vehicles: vehicleMatches });
      return;
    }

    const parseEventTimestamp = (event: EventLogEntry) => {
      const [day, month, year] = event.date.split('.').map((value) => Number(value));
      if (!day || !month || !year) return 0;
      const [hours = 0, minutes = 0, seconds = 0] = event.time
        .split(':')
        .map((value) => Number(value));
      return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
    };

    const matchedEvents = MOCK_EVENTS.filter((event) => {
      const normalizedEventPlate = normalizePlateForSearch(event.plateNumber);
      return (
        normalizedEventPlate === normalizedPlate ||
        normalizedEventPlate.includes(normalizedPlate) ||
        normalizedPlate.includes(normalizedEventPlate)
      );
    }).sort((a, b) => parseEventTimestamp(b) - parseEventTimestamp(a));

    if (matchedEvents.length > 0) {
      setSearchResult({ status: 'found_event', events: matchedEvents });
      return;
    }

    setSearchResult({ status: 'not_found', plateNumber: normalizedPlate });
  }, [baseVehicles]);

  const handleSearch = () => {
    const trimmedPlate = plateNumber.trim();
    if (!trimmedPlate) {
      setSearchResult(null);
      lastQuickSearchPlate = '';
      writeStoredQuickSearch('', false);
      return;
    }
    lastQuickSearchPlate = trimmedPlate;
    writeStoredQuickSearch(trimmedPlate, true);
    runSearch(trimmedPlate);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const foundVehicles = searchResult?.status === 'found' ? searchResult.vehicles : [];
  const foundEvents = searchResult?.status === 'found_event' ? searchResult.events : [];
  const foundVehicle = foundVehicles[0] ?? null;
  const noteText = foundVehicle?.notes?.trim() ?? '';
  const hasNote = Boolean(noteText) && noteText !== '-' && noteText !== '—';
  const hasFoundResult = foundVehicles.length > 0 || foundEvents.length > 0;
  const hasNotFound = searchResult?.status === 'not_found';
  const canOpenNote = foundVehicles.length === 1 && hasNote;

  useEffect(() => {
    const stored = readStoredQuickSearch();
    if (stored?.plate && stored.plate !== plateNumber) {
      setPlateNumber(stored.plate);
      lastQuickSearchPlate = stored.plate;
    }
    if (stored?.performed && stored.plate) {
      runSearch(stored.plate);
    }
  }, [runSearch]);

  const handleOpenCard = () => {
    if (!hasFoundResult) return;

    const params = new URLSearchParams();

    const matchedPlates =
      foundVehicles.length > 0
        ? Array.from(new Set(foundVehicles.map((vehicle) => vehicle.plateNumber)))
        : Array.from(new Set(foundEvents.map((event) => event.plateNumber)));

    if (matchedPlates.length === 1) {
      params.set('plate', matchedPlates[0]);
    } else if (matchedPlates.length > 1) {
      params.set('plates', matchedPlates.join(','));
    }

    const matchedStatuses =
      foundVehicles.length > 0
        ? Array.from(
            new Set(foundVehicles.map((vehicle) => statusByCategory[vehicle.category]))
          )
        : Array.from(new Set(foundEvents.map((event) => event.status)));

    if (matchedStatuses.length === 1) {
      params.set('status', matchedStatuses[0]);
    }

    if (canViewOwnerNames) {
      const owners =
        foundVehicles.length > 0
          ? Array.from(
              new Set(
                foundVehicles
                  .map((vehicle) => vehicle.owner)
                  .filter((owner) => owner.trim() !== '')
              )
            )
          : Array.from(
              new Set(
                foundEvents
                  .map((event) => event.owner)
                  .filter((owner) => owner.trim() !== '')
              )
            );

      if (owners.length === 1) {
        params.set('owner', owners[0]);
      }
    }

    const url = `${getRoutePath('events')}?${params.toString()}`;
    setDetailsOpen(false);
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const resultItems =
    foundVehicles.length > 0
      ? foundVehicles.map((vehicle, index) => ({
          key: `vehicle-${vehicle.id}-${index}`,
          plateNumber: vehicle.plateNumber,
          country: vehicle.country,
          listLabel: categoryShortLabels[vehicle.category],
          listColor: categoryTextColors[vehicle.category]
        }))
      : foundEvents.map((event, index) => ({
          key: `event-${event.date}-${event.time}-${event.plateNumber}-${index}`,
          plateNumber: event.plateNumber,
          country: event.country,
          listLabel: statusShortLabels[event.status],
          listColor: statusTextColors[event.status]
        }));

  return (
    <div
      className={`bg-white rounded-xl border border-border shadow-sm px-8 pt-6 pb-5 flex min-h-0 flex-col ${className ?? ''}`}
    >
      <h2 className="text-[20px] font-bold text-foreground tracking-tight mb-3">
        Быстрый поиск автомобиля
      </h2>

      <div className="flex flex-1 flex-col min-h-0">
        <div className="mb-3 flex flex-col items-start">
          <label className="block text-sm font-medium text-muted-foreground mb-1.5 pl-[2px]">
            Введите номер:
          </label>
          <div className="flex w-full max-w-[520px] gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[16px] h-[16px] text-muted-foreground"
                strokeWidth={2}
              />
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  const trimmedValue = value.trim();
                  setPlateNumber(value);
                  lastQuickSearchPlate = value;
                  writeStoredQuickSearch(trimmedValue ? value : '', false);
                  if (searchResult) {
                    setSearchResult(null);
                  }
                  if (detailsOpen) {
                    setDetailsOpen(false);
                  }
                }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                className="w-full pl-11 pr-4 py-3 bg-muted/40 rounded-xl border border-border focus:outline-none focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-smooth text-sm text-foreground placeholder:text-muted-foreground"
                placeholder="А123ВС"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-smooth shadow-md hover:shadow-lg font-semibold"
            >
              Найти
            </button>
          </div>
        </div>

        {hasFoundResult && resultItems.length > 0 && (
          <div className="border-t border-border pt-3 flex flex-col flex-1 min-h-0">
            <div className="flex flex-col gap-2 text-sm text-foreground/70 min-h-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span>Найдено событий:</span>
                  <span className="font-semibold text-foreground">{resultItems.length}</span>
                </div>
                {resultItems.length > 5 && (
                  <span className="text-[11px] text-muted-foreground">Прокрутите список</span>
                )}
              </div>
              <div className="h-[96px] rounded-lg border border-border/80 bg-muted/20 overflow-hidden">
                <div className="grid grid-cols-[minmax(0,1fr)_124px] items-center gap-2.5 border-b border-border/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>Номер</span>
                  <span className="text-center">Список</span>
                </div>
                <div
                  className="h-[64px] overflow-y-auto overscroll-contain px-1 py-1"
                  onWheel={(event) => {
                    const container = event.currentTarget;
                    if (container.scrollHeight <= container.clientHeight) return;
                    const maxScrollTop = container.scrollHeight - container.clientHeight;
                    const scrollingDown = event.deltaY > 0;
                    const scrollingUp = event.deltaY < 0;
                    const canScrollDown = container.scrollTop < maxScrollTop;
                    const canScrollUp = container.scrollTop > 0;

                    if ((scrollingDown && canScrollDown) || (scrollingUp && canScrollUp)) {
                      event.stopPropagation();
                    }
                  }}
                >
                  {resultItems.map((item) => (
                    <div
                      key={item.key}
                      className="grid grid-cols-[minmax(0,1fr)_124px] items-center gap-2.5 rounded-md px-2 py-1 hover:bg-white/70"
                    >
                      <span className="inline-flex min-w-0 items-center gap-2 text-foreground plate-text">
                        <span className="truncate">{formatPlateNumber(item.plateNumber)}</span>
                        <span className="shrink-0 text-[11px] text-foreground/70 font-semibold">
                          ({getPlateCountryCode(item.plateNumber, item.country)})
                        </span>
                      </span>
                      <span
                        className={
                          "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-4 " +
                          (listBadgeByTextColor[item.listColor] ?? "border-border bg-white text-foreground/80")
                        }
                      >
                        {item.listLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => canOpenNote && setDetailsOpen(true)}
                disabled={!canOpenNote}
                className={
                  canOpenNote
                    ? "flex items-center gap-1.5 text-sm transition-smooth text-primary hover:text-primary/80"
                    : "flex items-center gap-1.5 text-sm transition-smooth text-muted-foreground/60 cursor-not-allowed"
                }
              >
                <MessageSquare className="w-4 h-4" strokeWidth={2} />
                Есть примечание
              </button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleOpenCard}
                disabled={!hasFoundResult}
                className="h-8 px-3 text-sm font-semibold inline-flex items-center gap-1.5"
              >
                Посмотреть въезды
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        {hasNotFound && (
          <div className="border-t border-border pt-5 text-sm text-muted-foreground">
            Ничего не найдено
          </div>
        )}
      </div>

      {foundVehicles.length === 1 && foundVehicle && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Информация о примечании</DialogTitle>
              <DialogDescription className="text-foreground font-medium">
                {canViewOwnerNames ? 'Детали автомобиля и владельца.' : 'Детали автомобиля.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Номер:</span>
                <span className="text-slate-900 plate-text">
                  {formatPlateNumber(foundVehicle.plateNumber)} ({getPlateCountryCode(foundVehicle.plateNumber, foundVehicle.country)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Список:</span>
                <span
                  className={`font-semibold ${categoryTextColors[foundVehicle.category]}`}
                >
                  {categoryShortLabels[foundVehicle.category]}
                </span>
              </div>
              {canViewOwnerNames && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Владелец:</span>
                  <span className="text-slate-900 font-semibold">{foundVehicle.owner}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Дата добавления:</span>
                <span className="text-slate-900 font-semibold">
                  {foundVehicle.addedDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Примечание:</span>
                <span
                  className={`font-semibold ${
                    hasNote ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {noteText || '—'}
                </span>
              </div>
            </div>
            <DialogFooter className="justify-start sm:justify-start">
              <Button variant="secondary" onClick={() => setDetailsOpen(false)}>
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
