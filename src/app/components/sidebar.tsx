import {
  Home,
  Users,
  FileText,
  Download,
  Shield,
  AlertCircle,
  Package,
  Car
} from 'lucide-react';
import { useAuth } from '@/auth/authContext';
import { type RouteId } from '@/app/routesConfig';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[14px] transition-smooth rounded-lg mx-auto ${
        isActive
          ? 'bg-primary text-primary-foreground font-semibold shadow-md'
          : 'text-foreground/70 hover:text-foreground hover:bg-muted/50 font-normal'
      }`}
      style={{ width: 'calc(100% - 24px)', marginLeft: '12px', marginRight: '12px' }}
    >
      <span className={`${isActive ? 'opacity-100' : 'opacity-70'} flex-shrink-0 transition-smooth`}>
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

interface SidebarProps {
  activePage: RouteId;
  onNavigate: (page: RouteId) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { user } = useAuth();
  const showExport = user?.role === 'office_admin';
  const showAdminPages = user?.role !== 'guard';
  const showMiscSection = showAdminPages || showExport;

  return (
    <div className="w-[240px] min-w-[240px] bg-white h-screen flex flex-col border-r border-border shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-[18px] font-bold text-foreground tracking-tight">Мониторинг въездов</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 sidebar-scroll overflow-y-auto space-y-1">
        <NavItem
          icon={<Home className="w-[18px] h-[18px]" strokeWidth={2} />}
          label="Главная"
          isActive={activePage === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
        />

        <NavItem
          icon={<FileText className="w-[18px] h-[18px]" strokeWidth={2} />}
          label="Журнал въездов"
          isActive={activePage === 'events'}
          onClick={() => onNavigate('events')}
        />

        {/* Section: Списки */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Списки
          </p>
        </div>

        <NavItem
          icon={<Car className="w-[18px] h-[18px]" strokeWidth={2} />}
          label="Все автомобили"
          isActive={activePage === 'vehicles'}
          onClick={() => onNavigate('vehicles')}
        />

        <NavItem
          icon={<Shield className="w-[18px] h-[18px]" strokeWidth={2} />}
          label="Белый список"
          isActive={activePage === 'white-list'}
          onClick={() => onNavigate('white-list')}
        />

        <NavItem
          icon={<Package className="w-[18px] h-[18px]" strokeWidth={2} />}
          label="Подрядчики"
          isActive={activePage === 'contractors'}
          onClick={() => onNavigate('contractors')}
        />

        <NavItem
          icon={<AlertCircle className="w-[18px] h-[18px]" strokeWidth={2} />}
          label="Чёрный список"
          isActive={activePage === 'black-list'}
          onClick={() => onNavigate('black-list')}
        />

        {showMiscSection && (
          <>
            {/* Section: Разное */}
            <div className="px-6 pt-6 pb-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Разное
              </p>
            </div>

            {showAdminPages && (
              <>
            <NavItem
              icon={<Users className="w-[18px] h-[18px]" strokeWidth={2} />}
              label="Пользователи"
              isActive={activePage === 'users'}
              onClick={() => onNavigate('users')}
            />

            <NavItem
              icon={<FileText className="w-[18px] h-[18px]" strokeWidth={2} />}
              label="Журнал действий"
              isActive={activePage === 'audit'}
              onClick={() => onNavigate('audit')}
            />
              </>
            )}

            {showExport && (
              <>
                {showAdminPages && <div className="h-px bg-border my-3 mx-5" />}
                <NavItem
                  icon={<Download className="w-[18px] h-[18px]" strokeWidth={2} />}
                  label="Экспорт"
                  isActive={activePage === 'export'}
                  onClick={() => onNavigate('export')}
                />
              </>
            )}
          </>
        )}
      </nav>
    </div>
  );
}
