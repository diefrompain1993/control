import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { useMemo, useState } from 'react';
import { formatPlateNumber, getPlateCountryInfo } from '@/app/utils/plate';

interface Event {
  id: string;
  time: string;
  camera: string;
  plateNumber: string;
  owner: string;
  status: 'Чёрный' | 'Белый' | 'Нет в списках' | 'Подрядчик';
}

const events: Event[] = [
  {
    id: '00001',
    time: '12:41:23',
    camera: 'Въезд-1',
    plateNumber: 'А123ВС',
    owner: 'Иванов И.И.',
    status: 'Чёрный'
  },
  {
    id: '00002',
    time: '12:39:45',
    camera: 'Въезд-2',
    plateNumber: 'Х777ХХ',
    owner: 'Петров П.П.',
    status: 'Белый'
  },
  {
    id: '00003',
    time: '12:35:12',
    camera: 'Въезд-1',
    plateNumber: 'М999МР',
    owner: 'ООО "СМК"',
    status: 'Подрядчик'
  },
  {
    id: '00004',
    time: '12:20:08',
    camera: 'Въезд-1',
    plateNumber: 'К456КМ',
    owner: 'Неизвестно',
    status: 'Нет в списках'
  },
  {
    id: '00005',
    time: '12:15:32',
    camera: 'Въезд-2',
    plateNumber: 'В888АА',
    owner: 'Смирнова Е.П.',
    status: 'Белый'
  },
  {
    id: '00006',
    time: '12:10:15',
    camera: 'Въезд-1',
    plateNumber: 'О555ОО',
    owner: 'ООО "Строймонтаж"',
    status: 'Подрядчик'
  },
  {
    id: '00007',
    time: '12:05:47',
    camera: 'Въезд-2',
    plateNumber: 'Р321КР',
    owner: 'Неизвестно',
    status: 'Нет в списках'
  },
  {
    id: '00008',
    time: '12:01:19',
    camera: 'Въезд-1',
    plateNumber: 'С777МС',
    owner: 'Васильев О.И.',
    status: 'Белый'
  }
];

const parseTimeToSeconds = (value: string) => {
  const parts = value.split(':').map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return 0;
  const [hours = 0, minutes = 0, seconds = 0] = parts;
  return hours * 3600 + minutes * 60 + seconds;
};

interface EventsTableProps {
  onViewAll?: () => void;
}

export function EventsTable({ onViewAll }: EventsTableProps) {
  const [timeSort, setTimeSort] = useState<'asc' | 'desc'>('desc');

  const sortedEvents = useMemo(() => {
    const next = [...events];
    next.sort((a, b) => {
      const diff = parseTimeToSeconds(a.time) - parseTimeToSeconds(b.time);
      return timeSort === 'asc' ? diff : -diff;
    });
    return next;
  }, [timeSort]);

  const getStatusStyles = (status: Event['status']) => {
    const styles = {
      'Чёрный': 'bg-red-50 text-red-500',
      'Белый': 'bg-emerald-50 text-emerald-500',
      'Подрядчик': 'bg-purple-50 text-purple-500',
      'Нет в списках': 'bg-orange-50 text-orange-500'
    };
    return styles[status];
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border">
        <h2 className="text-[20px] font-bold text-foreground tracking-tight">Последние события</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-muted/20 border-b border-border">
              <th className="text-left py-4 px-4 text-[12px] font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setTimeSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors"
                >
                  Время
                  {timeSort === 'asc' ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </th>
              <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                Камера
              </th>
              <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                Номер
              </th>
              <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                Владелец
              </th>
              <th className="text-left py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                Список
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedEvents.map((event) => {
              const isUnrecognized = event.status === 'Нет в списках';
              const ownerLabel = isUnrecognized ? 'Неизвестно' : event.owner;
              const plateInfo = getPlateCountryInfo(event.plateNumber);
              const countryCode = plateInfo.code === 'UNKNOWN' ? 'CIS' : plateInfo.code;
              const formattedPlate = formatPlateNumber(event.plateNumber);

              return (
                <tr
                  key={event.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-smooth group"
                >
                  <td className="py-4 px-4 text-[14px] font-medium text-foreground/80 font-mono transition-colors hover:text-foreground">
                    {event.time}
                  </td>
                  <td className="py-4 px-4 text-[14px] font-medium text-foreground/80">
                    {event.camera}
                  </td>
                  <td className="py-4 px-4 text-[14px] font-bold text-foreground font-mono">
                    <span className="inline-flex items-center gap-2">
                      {formattedPlate}
                      <span className="text-[11px] text-muted-foreground font-semibold">
                        ({countryCode})
                      </span>
                      {isUnrecognized && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              aria-label="Плохо распознан номер"
                              className="inline-flex items-center text-amber-500 opacity-80 animate-pulse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 rounded-sm"
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
                  </td>
                  <td className="py-4 px-4 text-[14px] font-medium text-foreground/80">
                    {ownerLabel}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium ${getStatusStyles(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-5 border-t border-border flex items-center justify-between bg-muted/20">
        <p className="text-sm font-medium text-muted-foreground">Показано 1-8 из {events.length}</p>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4 text-foreground" strokeWidth={2} />
          </button>
          <button className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
            <ChevronRight className="w-4 h-4 text-foreground" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}


