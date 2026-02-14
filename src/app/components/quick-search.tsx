import { ArrowRight, MessageSquare, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatPlateNumber } from '@/app/utils/plate';
import { BASE_VEHICLES } from '@/app/data/vehicles';
import { getStoredVehicles, mergeVehicles, type StoredVehicle } from '@/app/utils/vehicleStore';
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
  | { status: 'not_found'; plateNumber: string };

const categoryLabels: Record<StoredVehicle['category'], string> = {
  white: 'Белый список',
  black: 'Чёрный список',
  contractor: 'Подрядчики',
  unlisted: 'Нет в списках'
};

const categoryTextColors: Record<StoredVehicle['category'], string> = {
  white: 'text-emerald-500',
  black: 'text-red-500',
  contractor: 'text-purple-500',
  unlisted: 'text-orange-500'
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
  const [plateNumber, setPlateNumber] = useState('');
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

  const handleSearch = () => {
    const normalizedPlate = normalizePlateForSearch(plateNumber);
    if (!normalizedPlate) return;

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
    } else {
      setSearchResult({ status: 'not_found', plateNumber: normalizedPlate });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const foundVehicle = searchResult?.status === 'found' ? searchResult.vehicle : null;
  const noteText = foundVehicle?.notes?.trim() ?? '';
  const hasNote = Boolean(noteText);

  return (
    <div
      className={`bg-white rounded-xl border border-border shadow-sm p-8 flex flex-col ${className ?? ''}`}
    >
      <h2 className="text-[20px] font-bold text-foreground tracking-tight mb-5">
        Быстрый поиск автомобиля
      </h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Введите номер:
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[16px] h-[16px] text-muted-foreground"
              strokeWidth={2}
            />
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              onKeyDown={handleKeyDown}
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

      {searchResult?.status === 'found' && foundVehicle && (
        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <span className="text-sm text-foreground/70">
              Найдено:{' '}
              <strong className="text-foreground">
                {formatPlateNumber(foundVehicle.plateNumber)}
              </strong>
            </span>
            <span
              className={`text-sm font-semibold ${categoryTextColors[foundVehicle.category]}`}
            >
              {categoryLabels[foundVehicle.category]}
            </span>
            <button
              type="button"
              onClick={() => hasNote && setDetailsOpen(true)}
              disabled={!hasNote}
              className={`flex items-center gap-1.5 text-sm transition-smooth ${
                hasNote
                  ? 'text-primary hover:text-primary/80'
                  : 'text-muted-foreground/60 cursor-not-allowed'
              }`}
            >
              <MessageSquare className="w-4 h-4" strokeWidth={2} />
              Есть примечание
            </button>
          </div>

          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            disabled={!foundVehicle}
            className={`text-sm font-semibold flex items-center gap-1.5 transition-smooth group ${
              foundVehicle ? 'text-primary hover:text-primary/80' : 'text-muted-foreground/60'
            }`}
          >
            Открыть карточку
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-smooth" />
          </button>
        </div>
      )}

      {searchResult?.status === 'not_found' && (
        <div className="border-t border-border pt-5 text-sm text-muted-foreground">
          Ничего не найдено
        </div>
      )}

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
                <span className="text-slate-900 font-semibold">
                  {formatPlateNumber(foundVehicle.plateNumber)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Список:</span>
                <span
                  className={`font-semibold ${categoryTextColors[foundVehicle.category]}`}
                >
                  {categoryLabels[foundVehicle.category]}
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
