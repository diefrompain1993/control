interface StatsCardProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  onClick?: () => void;
}

export function StatsCard({ title, count, icon, color, onClick }: StatsCardProps) {
  const colorConfig = {
    blue: {
      bg: 'bg-white',
      iconBg: 'bg-blue-50',
      iconColor: 'text-[#5b93ff]',
    },
    green: {
      bg: 'bg-white',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    red: {
      bg: 'bg-white',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-400',
    },
    orange: {
      bg: 'bg-white',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-400',
    },
    purple: {
      bg: 'bg-white',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    }
  };

  const config = colorConfig[color];
  const isClickable = Boolean(onClick);

  return (
    <div
      className={`${config.bg} rounded-xl p-6 relative overflow-hidden border border-border shadow-sm transition-smooth group ${
        isClickable
          ? 'cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
          : ''
      }`}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground/80 mb-1 tracking-tight">{title}</p>
          <h3 className="text-3xl font-bold text-foreground tracking-tight">{count}</h3>
        </div>
        <div
          className={`${config.iconBg} w-11 h-11 shrink-0 rounded-xl ${config.iconColor} flex items-center justify-center group-hover:scale-110 transition-smooth`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
