import { ArrowRight, MessageSquare, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatPlateNumber, getPlateCountryCode } from '@/app/utils/plate';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import { MOCK_EVENTS, type EventLogEntry } from '@/app/data/events';
import { getStoredVehicles, mergeVehicles, type StoredVehicle } from '@/app/utils/vehicleStore';
import { getRoutePath } from '@/app/routesConfig';
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
  | { status: 'found'; vehicle: StoredVehicle }
  | { status: 'found_event'; event: EventLogEntry }
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
    const found = vehicles.find((vehicle) => {
      const normalizedVehicle = normalizePlateForSearch(vehicle.plateNumber);
      return (
        normalizedVehicle === normalizedPlate ||
        normalizedVehicle.includes(normalizedPlate) ||
        normalizedPlate.includes(normalizedVehicle)
      );
    });

    if (found) {
      setSearchResult({ status: 'found', vehicle: found });
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
      setSearchResult({ status: 'found_event', event: matchedEvents[0] });
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

  const foundVehicle = searchResult?.status === 'found' ? searchResult.vehicle : null;
  const foundEvent = searchResult?.status === 'found_event' ? searchResult.event : null;
  const noteText = foundVehicle?.notes?.trim() ?? '';
  const hasNote = Boolean(noteText) && noteText !== '-' && noteText !== '—';
  const listLabel = foundVehicle
    ? categoryShortLabels[foundVehicle.category]
    : foundEvent
    ? statusShortLabels[foundEvent.status]
    : '';
  const listColor = foundVehicle
    ? categoryTextColors[foundVehicle.category]
    : foundEvent
    ? statusTextColors[foundEvent.status]
    : 'text-muted-foreground';
  const hasFoundResult =
    searchResult?.status === 'found' || searchResult?.status === 'found_event';
  const hasNotFound = searchResult?.status === 'not_found';

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
    if (!foundVehicle && !foundEvent) return;
    const params = new URLSearchParams();
    if (foundVehicle) {
      params.set('plate', foundVehicle.plateNumber);
      if (foundVehicle.owner) {
        params.set('owner', foundVehicle.owner);
      }
      params.set('status', statusByCategory[foundVehicle.category]);
    }
    if (foundEvent) {
      params.set('plate', foundEvent.plateNumber);
      if (foundEvent.owner) {
        params.set('owner', foundEvent.owner);
      }
      params.set('status', foundEvent.status);
    }
    const url = `${getRoutePath('events')}?${params.toString()}`;
    setDetailsOpen(false);
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div
      className={`bg-white rounded-xl border border-border shadow-sm p-8 flex flex-col ${className ?? ''}`}
    >
      <h2 className="text-[20px] font-bold text-foreground tracking-tight mb-5">
        Быстрый поиск автомобиля
      </h2>

      <div className="flex flex-1 flex-col min-h-0">
        <div className="mt-[20px] mb-5 flex flex-col items-start">
          <label className="block text-sm font-medium text-muted-foreground mb-2 pl-[2px]">
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

        {hasFoundResult && (foundVehicle || foundEvent) && (
          <div className="border-t border-border pt-5 flex flex-col flex-1">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-sm text-foreground/70 whitespace-nowrap">
                <span className="inline-flex items-center gap-2">
                  Найдено:
                  <span className="inline-flex items-center gap-2 text-foreground plate-text whitespace-nowrap">
                    {formatPlateNumber(foundVehicle?.plateNumber ?? foundEvent!.plateNumber)}
                    <span className="text-[11px] text-foreground/70 font-semibold">
                      ({getPlateCountryCode(
                        foundVehicle?.plateNumber ?? foundEvent!.plateNumber,
                        foundVehicle?.country
                      )})
                    </span>
                  </span>
                </span>
                <span className="inline-flex items-center gap-2">
                  Список:
                  <span className={`font-semibold ${listColor}`}>
                    {listLabel}
                  </span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => hasNote && setDetailsOpen(true)}
              disabled={!hasNote}
              className={`mt-4 flex items-center gap-1.5 text-sm transition-smooth ${
                hasNote
                  ? 'text-primary hover:text-primary/80'
                  : 'text-muted-foreground/60 cursor-not-allowed'
              }`}
            >
              <MessageSquare className="w-4 h-4" strokeWidth={2} />
              Есть примечание
            </button>
            <button
              type="button"
              onClick={handleOpenCard}
              disabled={!foundVehicle && !foundEvent}
              className={`mt-auto pb-7 translate-y-[28px] text-sm font-semibold flex items-center gap-1.5 transition-smooth group ${
                foundVehicle || foundEvent
                  ? 'text-primary hover:text-primary/80'
                  : 'text-muted-foreground/60'
              }`}
            >
              Открыть карточку
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-smooth" />
            </button>
          </div>
        )}

        {hasNotFound && (
          <div className="border-t border-border pt-5 text-sm text-muted-foreground">
            Ничего не найдено
          </div>
        )}
      </div>

      {foundVehicle && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Информация о примечании</DialogTitle>
              <DialogDescription className="text-foreground font-medium">
                Детали автомобиля и владельца.
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
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Владелец:</span>
                <span className="text-slate-900 font-semibold">{foundVehicle.owner}</span>
              </div>
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
