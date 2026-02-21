import { StatsCard } from '@/app/components/stats-card';
import { EventsTable } from '@/app/components/events-table';
import { QuickSearch } from '@/app/components/quick-search';
import { useAuth } from '@/auth/authContext';
import { Users2, ShieldCheck, ShieldAlert, Building2 } from 'lucide-react';
import type { RouteId } from '@/app/routesConfig';
import { getPlateCountryCode } from '@/app/utils/plate';

interface DashboardProps {
  onNavigate?: (page: RouteId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const canViewOwnerNames = user?.role !== 'guard';
  const isOfficeAdmin = user?.role === 'office_admin';
  const whiteList = 24;
  const blackList = 3;
  const noList = 12;
  const contractors = 19;
  const total = whiteList + blackList + noList + contractors;
  const showStats = isOfficeAdmin;
  const showLastEntry = user?.role === 'guard' || user?.role === 'admin';
  const dashboardGridClass = showLastEntry
    ? 'grid grid-cols-1 gap-6 xl:grid-cols-[396px_minmax(0,1fr)] xl:items-stretch'
    : 'grid grid-cols-1 gap-6 lg:grid-cols-[396px_minmax(0,1fr)] lg:items-stretch';
  const leftColumnClass = showLastEntry
    ? 'flex min-h-0 flex-col gap-6 xl:h-full xl:self-stretch'
    : 'flex min-h-0 flex-col gap-6 lg:h-full lg:self-stretch';
  const rightColumnClass = showLastEntry
    ? 'min-w-0 xl:h-full xl:self-stretch'
    : 'min-w-0 lg:h-full lg:self-stretch';
  const quickSearchClass = showLastEntry
    ? 'w-full overflow-hidden xl:mt-0 xl:flex-1'
    : 'w-full max-w-[396px] overflow-hidden lg:max-w-none';
  const lastEntry = {
    time: '12:41:23',
    plateNumber: 'H 740640',
    country: 'RUS',
    owner: 'ООО "ГрандСтрой"',
    notes: 'Последний въезд (демо)'
  };
  const lastEntryCountryCode = getPlateCountryCode(lastEntry.plateNumber, lastEntry.country);
  const showLastEntryCountryCode = lastEntryCountryCode !== '—';
  const lastEntryNotes = lastEntry.notes?.trim();
  const showLastEntryNotes = Boolean(lastEntryNotes) && lastEntryNotes !== '—' && lastEntryNotes !== '-';

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      {showStats && (
        <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      <div className={dashboardGridClass}>
        <div className={leftColumnClass}>
          {showLastEntry && (
            <div className="w-full bg-white rounded-xl border border-border shadow-sm px-8 pt-6 pb-6 flex flex-col gap-3">
              <h2 className="text-[20px] font-bold text-foreground tracking-tight">
                Последний въезд
              </h2>
              <div className="flex-1 min-h-0 rounded-xl overflow-hidden border border-border">
                <img
                  src="/car_number.jpg"
                  alt="Последний въезд"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid gap-1.5 text-sm text-foreground/80">
                <div className="flex items-center justify-between gap-3">
                  <span>Время въезда</span>
                  <span className="text-foreground font-semibold font-mono">
                    {lastEntry.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Номер</span>
                  <span className="text-foreground plate-text">
                    {lastEntry.plateNumber}
                    {showLastEntryCountryCode ? ` (${lastEntryCountryCode})` : ''}
                  </span>
                </div>
                {canViewOwnerNames && (
                  <div className="flex items-center justify-between gap-3">
                    <span>Владелец</span>
                    <span className="text-foreground font-semibold">{lastEntry.owner}</span>
                  </div>
                )}
                {showLastEntryNotes && (
                  <div className="flex items-center justify-between gap-3">
                    <span>Примечание</span>
                    <span className="text-foreground font-semibold text-right">{lastEntryNotes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <QuickSearch className={quickSearchClass} />
        </div>
        <div className={rightColumnClass}>
          <EventsTable onViewAll={() => onNavigate?.('events')} className="h-full" />
        </div>
      </div>
    </div>
  );
}
