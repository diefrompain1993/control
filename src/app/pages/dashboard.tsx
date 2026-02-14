import { StatsCard } from '@/app/components/stats-card';
import { EventsTable } from '@/app/components/events-table';
import { QuickSearch } from '@/app/components/quick-search';
import { useAuth } from '@/auth/authContext';
import { Users2, ShieldCheck, ShieldAlert, Building2 } from 'lucide-react';
import type { RouteId } from '@/app/routesConfig';

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
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        <div className="min-w-0">
          <EventsTable onViewAll={() => onNavigate?.('events')} />
        </div>
        <QuickSearch className="w-full xl:aspect-square xl:overflow-auto" />
      </div>
    </div>
  );
}
