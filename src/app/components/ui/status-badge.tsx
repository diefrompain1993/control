interface StatusBadgeProps {
  status: 'Белый' | 'Чёрный' | 'Нет в списках' | 'Подрядчик';
  showDot?: boolean;
}

export function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const colors = {
    'Чёрный': { text: 'text-red-600', bg: 'bg-red-600', pulse: true },
    'Белый': { text: 'text-green-600', bg: 'bg-green-600', pulse: false },
    'Подрядчик': { text: 'text-purple-600', bg: 'bg-purple-600', pulse: false },
    'Нет в списках': { text: 'text-orange-600', bg: 'bg-orange-600', pulse: false }
  };
  
  const color = colors[status];
  
  return (
    <span className={`inline-flex items-center gap-1 text-sm transition-all duration-200 ${color.text}`}>
      {showDot && (
        <span className={`w-2 h-2 rounded-full ${color.bg} ${color.pulse ? 'animate-pulse' : ''}`}></span>
      )}
      {status}
    </span>
  );
}

interface EventStatusBadgeProps {
  event: 'Пропущен' | 'Не пропущен';
}

export function EventStatusBadge({ event }: EventStatusBadgeProps) {
  return (
    <span className={`text-sm ${
      event === 'Пропущен' ? 'text-green-600' : 'text-red-600'
    }`}>
      {event}
    </span>
  );
}
