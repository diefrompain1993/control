import { StatsCard } from '@/app/components/stats-card';
import { EventsTable } from '@/app/components/events-table';
import { QuickSearch } from '@/app/components/quick-search';
import { useAuth } from '@/auth/authContext';
import { Users2, ShieldCheck, ShieldAlert, Building2 } from 'lucide-react';
import type { RouteId } from '@/app/routesConfig';
import { formatPlateNumber, getPlateCountryCode } from '@/app/utils/plate';

interface DashboardProps {
  onNavigate?: (page: RouteId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const whiteList = 24;
  const blackList = 3;
  const noList = 12;
  const contractors = 19;
  const total = whiteList + blackList + noList + contractors;
  const showStats = user?.role === 'office_admin';
  const showLastEntry = user?.role === 'guard';
  const lastEntry = {
    time: '12:41:23',
    plateNumber: 'A123BC77',
    owner: 'Иванов И.И.'
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Всего за сегодня"
            count={total}
            icon={<Users2 className="w-6 h-6" strokeWidth={2} />}
            color="blue"
            onClick={() => onNavigate?.('vehicles')}
          />
          <StatsCard
            title="Белый список"
            count={whiteList}
            icon={<ShieldCheck className="w-6 h-6" strokeWidth={2} />}
            color="green"
            onClick={() => onNavigate?.('white-list')}
          />
          <StatsCard
            title="Чёрный список"
            count={blackList}
            icon={<ShieldAlert className="w-6 h-6" strokeWidth={2} />}
            color="red"
            onClick={() => onNavigate?.('black-list')}
          />
          <StatsCard
            title="Подрядчики"
            count={contractors}
            icon={<Building2 className="w-6 h-6" strokeWidth={2} />}
            color="purple"
            onClick={() => onNavigate?.('contractors')}
          />
        </div>
      )}
      
      {/* Events Table + Quick Search */}
      <div className="grid grid-cols-1 xl:grid-cols-[396px_minmax(0,1fr)] gap-6 items-start">
        <div className="flex flex-col gap-6">
          {showLastEntry && (
            <div className="w-full xl:aspect-square bg-white rounded-xl border border-border shadow-sm p-8 flex flex-col gap-4">
              <h2 className="text-[20px] font-bold text-foreground tracking-tight">
                Последний въезд
              </h2>
              <div className="flex-1 min-h-0 rounded-xl overflow-hidden border border-border">
                <img
                  src="/last-entry-car.jpg"
                  alt="Последний въезд"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid gap-2 text-sm text-foreground/80">
                <div className="flex items-center justify-between gap-3">
                  <span>Время въезда</span>
                  <span className="text-foreground font-semibold font-mono">
                    {lastEntry.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Номер</span>
                  <span className="text-foreground plate-text">
                    {formatPlateNumber(lastEntry.plateNumber)} ({getPlateCountryCode(lastEntry.plateNumber)})
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Владелец</span>
                  <span className="text-foreground font-semibold">{lastEntry.owner}</span>
                </div>
              </div>
            </div>
          )}
          <QuickSearch className="w-full xl:h-[340px] xl:overflow-auto mt-[2px]" />
        </div>
        <div className="min-w-0">
          <EventsTable onViewAll={() => onNavigate?.('events')} />
        </div>
      </div>
    </div>
  );
}
