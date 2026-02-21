import { useEffect, useState, type ReactNode } from 'react';
import {
  AlertCircle,
  Car,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Home,
  LogOut,
  Users
} from 'lucide-react';
import { useAuth } from '@/auth/authContext';
import { roleLabels } from '@/auth/roles';
import { getNameWithInitials } from '@/app/utils/name';
import { type RouteId } from '@/app/routesConfig';
import { BrandLogo } from '@/app/components/brand-logo';

const SIDEBAR_SET_COLLAPSED_EVENT = 'app:sidebar:set-collapsed';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

interface SidebarImageIconProps {
  src: string;
  alt: string;
}

function SidebarImageIcon({ src, alt }: SidebarImageIconProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="sidebar-image-icon h-[18px] w-[18px] object-contain transition-[filter,opacity] duration-200"
      draggable={false}
    />
  );
}

function NavItem({ icon, label, isActive, isCollapsed, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`group w-full flex items-center rounded-lg transition-[background-color,color,box-shadow,padding,gap] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isCollapsed ? 'justify-center gap-0 px-2 py-2.5' : 'gap-3 px-4 py-2.5'
      } ${
        isActive
          ? 'bg-primary text-primary-foreground font-semibold shadow-md'
          : 'text-foreground/70 hover:text-foreground hover:bg-muted/50 font-normal'
      }`}
    >
      <span
        className={`flex-shrink-0 transition-[opacity,transform] duration-200 ${
          isActive
            ? 'opacity-100 [&_.sidebar-image-icon]:brightness-0 [&_.sidebar-image-icon]:invert [&_.sidebar-image-icon]:opacity-100'
            : 'opacity-70 [&_.sidebar-image-icon]:brightness-0 [&_.sidebar-image-icon]:saturate-0 [&_.sidebar-image-icon]:opacity-60 group-hover:[&_.sidebar-image-icon]:opacity-80'
        }`}
      >
        {icon}
      </span>
      <span
        className={`flex-1 overflow-hidden text-left whitespace-nowrap transition-[max-width,opacity,transform] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCollapsed
            ? 'max-w-0 opacity-0 -translate-x-1 pointer-events-none'
            : 'max-w-[180px] opacity-100 translate-x-0'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

interface SidebarProps {
  activePage: RouteId;
  onNavigate: (page: RouteId) => void;
  onLogout: () => void;
}

export function Sidebar({ activePage, onNavigate, onLogout }: SidebarProps) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleSetCollapsed = (event: Event) => {
      const customEvent = event as CustomEvent<{ collapsed?: boolean }>;
      if (typeof customEvent.detail?.collapsed !== 'boolean') return;
      setIsCollapsed(customEvent.detail.collapsed);
    };

    window.addEventListener(SIDEBAR_SET_COLLAPSED_EVENT, handleSetCollapsed as EventListener);
    return () => {
      window.removeEventListener(
        SIDEBAR_SET_COLLAPSED_EVENT,
        handleSetCollapsed as EventListener
      );
    };
  }, []);

  const showExport = user?.role === 'office_admin';
  const showAdminPages = user?.role === 'office_admin';
  const showMiscSection = showAdminPages || showExport;

  const displayName = getNameWithInitials(user?.fullName, user?.email ?? '—');
  const roleLabel = user ? roleLabels[user.role] : 'Гость';

  const sidebarWidthClasses = isCollapsed ? 'w-[88px] min-w-[88px]' : 'w-[240px] min-w-[240px]';
  const handleLogoClick = () => onNavigate('dashboard');

  return (
    <aside
      className={`relative ${sidebarWidthClasses} bg-white h-screen flex flex-col border-r border-border shadow-sm transition-[width,min-width] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
    >
      <button
        type="button"
        onClick={() => {
          setIsCollapsed((prev) => {
            const next = !prev;
            window.dispatchEvent(
              new CustomEvent(SIDEBAR_SET_COLLAPSED_EVENT, {
                detail: { collapsed: next }
              })
            );
            return next;
          });
        }}
        data-sidebar-toggle="true"
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground/80 shadow-sm hover:bg-muted/50 hover:text-foreground transition-[background-color,color,transform] duration-200"
        aria-label={isCollapsed ? 'Развернуть боковую панель' : 'Свернуть боковую панель'}
        title={isCollapsed ? 'Развернуть' : 'Свернуть'}
      >
        {isCollapsed ? <ChevronRight className="h-6 w-6 stroke-[2.6]" /> : <ChevronLeft className="h-6 w-6 stroke-[2.6]" />}
      </button>

      <nav
        className={`pb-3 sidebar-scroll space-y-1 px-2 transition-[padding-top] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCollapsed ? 'pt-3 overflow-y-auto' : 'pt-2 overflow-y-hidden'
        }`}
      >
        <div
          className={`flex items-center justify-center overflow-hidden transition-[height,padding,margin] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isCollapsed ? 'h-14 pt-2 mb-4' : 'h-[118px] pt-2 mb-0'
          }`}
        >
          <button
            type="button"
            onClick={handleLogoClick}
            className="relative h-full w-full cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Перейти на главную"
            title="Главная"
          >
            <div
              className={`absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] ${
                isCollapsed ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
              }`}
            >
              <BrandLogo
                src="/golf_icon.png"
                className="pointer-events-none h-28 w-28 object-contain origin-center scale-[2.9] [transform:translateZ(0)]"
                fallbackClassName="text-[16px] font-semibold text-foreground tracking-tight"
                showLabel={false}
                showImage
              />
            </div>

            <div
              className={`absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] ${
                isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
              }`}
            >
              <BrandLogo
                src="/logo_mini.png"
                className="pointer-events-none h-10 w-10 object-contain [transform:translateZ(0)]"
                fallbackClassName="text-[12px] font-semibold text-foreground"
                showLabel={false}
                showImage
              />
            </div>
          </button>
        </div>

        <NavItem
          icon={<Home className="w-[18px] h-[18px]" strokeWidth={2} />}
          label="Главная"
          isCollapsed={isCollapsed}
          isActive={activePage === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
        />

        <NavItem
          icon={<FileText className="w-[18px] h-[18px]" strokeWidth={2} />}
          label="Журнал въездов"
          isCollapsed={isCollapsed}
          isActive={activePage === 'events'}
          onClick={() => onNavigate('events')}
        />

        {!isCollapsed && (
          <div className="px-2 pt-4 pb-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Списки
            </p>
          </div>
        )}

        <NavItem
          icon={<Car className="w-[18px] h-[18px]" strokeWidth={2} />}
          label="Все автомобили"
          isCollapsed={isCollapsed}
          isActive={activePage === 'vehicles'}
          onClick={() => onNavigate('vehicles')}
        />

        <NavItem
          icon={<SidebarImageIcon src="/galka_icon.jpg" alt="Белый список" />}
          label="Белый список"
          isCollapsed={isCollapsed}
          isActive={activePage === 'white-list'}
          onClick={() => onNavigate('white-list')}
        />

        <NavItem
          icon={<SidebarImageIcon src="/prod_icon.png" alt="Подрядчики" />}
          label="Подрядчики"
          isCollapsed={isCollapsed}
          isActive={activePage === 'contractors'}
          onClick={() => onNavigate('contractors')}
        />

        <NavItem
          icon={<AlertCircle className="w-[18px] h-[18px]" strokeWidth={2} />}
          label="Чёрный список"
          isCollapsed={isCollapsed}
          isActive={activePage === 'black-list'}
          onClick={() => onNavigate('black-list')}
        />

        {showMiscSection && (
          <>
            {!isCollapsed && (
              <div className="px-2 pt-4 pb-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Разное
                </p>
              </div>
            )}

            {showAdminPages && (
              <>
                <NavItem
                  icon={<Users className="w-[18px] h-[18px]" strokeWidth={2} />}
                  label="Пользователи"
                  isCollapsed={isCollapsed}
                  isActive={activePage === 'users'}
                  onClick={() => onNavigate('users')}
                />

                <NavItem
                  icon={<FileText className="w-[18px] h-[18px]" strokeWidth={2} />}
                  label="Журнал действий"
                  isCollapsed={isCollapsed}
                  isActive={activePage === 'audit'}
                  onClick={() => onNavigate('audit')}
                />
              </>
            )}

            {showExport && (
              <>
                <NavItem
                  icon={<Download className="w-[18px] h-[18px]" strokeWidth={2} />}
                  label="Экспорт"
                  isCollapsed={isCollapsed}
                  isActive={activePage === 'export'}
                  onClick={() => onNavigate('export')}
                />
              </>
            )}
          </>
        )}
      </nav>

      <div className="mt-auto border-t border-border p-2 space-y-2 bg-white">
        <button
          type="button"
          title={isCollapsed ? `${displayName} (${roleLabel})` : undefined}
          className={`w-full flex items-center rounded-lg transition-[background-color,color,padding,gap] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] text-foreground/80 bg-muted/30 ${
            isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-2 px-3 py-2.5'
          }`}
        >
          <Users className="w-4 h-4 flex-shrink-0" />
          <span
            className={`overflow-hidden transition-[max-width,opacity,transform] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isCollapsed
                ? 'max-w-0 opacity-0 -translate-x-1 pointer-events-none'
                : 'max-w-[150px] opacity-100 translate-x-0'
            }`}
          >
            <span className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">{displayName}</span>
              <span className="text-xs text-foreground/70 whitespace-nowrap">{roleLabel}</span>
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          title={isCollapsed ? 'Выйти' : undefined}
          className={`w-full flex items-center rounded-lg transition-[background-color,color,padding,gap] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] text-foreground/70 hover:text-foreground hover:bg-muted/50 ${
            isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-2 px-3 py-2.5'
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isCollapsed
                ? 'max-w-0 opacity-0 -translate-x-1 pointer-events-none'
                : 'max-w-[72px] opacity-100 translate-x-0'
            }`}
          >
            <span className="text-sm font-medium">Выйти</span>
          </span>
        </button>
      </div>
    </aside>
  );
}
