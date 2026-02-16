import { LogOut } from 'lucide-react';
import type { User } from '@/auth/types';
import { roleLabels } from '@/auth/roles';
import { getNameWithInitials } from '@/app/utils/name';
import { BrandLogo } from '@/app/components/brand-logo';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const roleLabel = user ? roleLabels[user.role] : 'Гость';
  const displayName = getNameWithInitials(user?.fullName, user?.email ?? '—');

  return (
    <header className="h-[72px] bg-white border-b border-border flex items-center justify-between px-8 shadow-sm flex-shrink-0">
      {/* Page Title */}
      <div className="flex items-center">
        <BrandLogo
          showImage={false}
          showLabel
          labelClassName="text-[18px] font-semibold text-foreground tracking-tight"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-xl transition-smooth"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>

        {/* User Name Only */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="flex flex-col">
            <span className="text-base font-semibold text-foreground leading-tight">{displayName}</span>
            <span className="text-sm text-foreground/80 leading-tight">{roleLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
