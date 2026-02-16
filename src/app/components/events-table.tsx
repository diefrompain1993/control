import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { useMemo, useState } from 'react';
import { formatPlateNumber, getPlateCountryCode } from '@/app/utils/plate';

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
    plateNumber: 'А123ВС77',
    owner: 'Иванов И.И.',
    status: 'Чёрный'
  },
  {
    id: '00002',
    time: '12:39:45',
    camera: 'Въезд-2',
    plateNumber: 'Х777ХХ78',
    owner: 'Петров П.П.',
    status: 'Белый'
  },
  {
    id: '00003',
    time: '12:35:12',
    camera: 'Въезд-1',
    plateNumber: 'М999МР77',
    owner: 'ООО "СМК"',
    status: 'Подрядчик'
  },
  {
    id: '00004',
    time: '12:20:08',
    camera: 'Въезд-1',
    plateNumber: 'К456КМ77',
    owner: 'Неизвестно',
    status: 'Нет в списках'
  },
  {
    id: '00005',
    time: '12:15:32',
    camera: 'Въезд-2',
    plateNumber: 'В888АА50',
    owner: 'Смирнова Е.П.',
    status: 'Белый'
  },
  {
    id: '00006',
    time: '12:10:15',
    camera: 'Въезд-1',
    plateNumber: 'О555ОО50',
    owner: 'ООО "Строймонтаж"',
    status: 'Подрядчик'
  },
  {
    id: '00007',
    time: '12:05:47',
    camera: 'Въезд-2',
    plateNumber: 'Р321КР78',
    owner: 'Неизвестно',
    status: 'Нет в списках'
  },
  {
    id: '00008',
    time: '12:01:19',
    camera: 'Въезд-2',
    plateNumber: 'В888АА50',
    owner: 'Смирнова Е.П.',
    status: 'Белый'
  },
  {
    id: '00009',
    time: '11:58:42',
    camera: 'Въезд-2',
    plateNumber: 'Р321КР78',
    owner: 'Неизвестно',
    status: 'Нет в списках'
  },
  {
    id: '00010',
    time: '11:54:22',
    camera: 'Въезд-1',
    plateNumber: 'О555ОО50',
    owner: 'ООО "Строймонтаж"',
    status: 'Подрядчик'
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
              <th className="text-center py-4 px-4 text-[12px] font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setTimeSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  className="grid w-full grid-cols-[1fr_auto_1fr] items-center text-foreground/70 hover:text-foreground transition-colors text-[12px] font-bold uppercase tracking-wider"
                >
                  <span aria-hidden="true" />
                  <span>Время</span>
                  <span className="inline-flex items-center justify-start">
                    {timeSort === 'asc' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>
              </th>
              <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                Камера
              </th>
              <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                Номер
              </th>
              <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                Владелец
              </th>
              <th className="text-center py-4 px-4 text-[12px] font-bold text-foreground/70 uppercase tracking-wider">
                Список
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedEvents.map((event) => {
              const isUnrecognized = event.status === 'Нет в списках';
              const ownerLabel = isUnrecognized ? 'Неизвестно' : event.owner;
              const countryCode = getPlateCountryCode(event.plateNumber);
              const formattedPlate = formatPlateNumber(event.plateNumber);

              return (
                <tr
                  key={event.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-smooth group"
                >
                  <td className="py-4 px-4 text-center text-[14px] font-medium text-foreground/80 font-mono tabular-nums transition-colors hover:text-foreground">
                    {event.time}
                  </td>
                  <td className="py-4 px-4 text-center text-[14px] font-medium text-foreground/80">
                    {event.camera}
                  </td>
                  <td className="py-4 px-4 text-center text-foreground plate-text">
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
                  <td className="py-4 px-4 text-center text-[14px] font-medium text-foreground/80">
                    {ownerLabel}
                  </td>
                  <td className="py-4 px-4 text-center">
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
      <div className="px-8 pt-4 pb-2 border-t border-border flex items-center justify-center bg-muted/20">
        <p className="text-sm font-medium text-muted-foreground text-center w-full -translate-y-[2px]">Показано 1-10 из {events.length}</p>
      </div>
    </div>
  );
}


