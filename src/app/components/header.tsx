import { useEffect, useState } from 'react';
import { BrandLogo } from '@/app/components/brand-logo';

const getUtcPlusThreeTime = () => {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const utcPlusThreeDate = new Date(utcMs + 3 * 60 * 60 * 1_000);
  return utcPlusThreeDate.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export function Header() {
  const [time, setTime] = useState(getUtcPlusThreeTime);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTime(getUtcPlusThreeTime());
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <header className="h-[72px] bg-white border-b border-border flex items-center justify-between px-8 shadow-sm flex-shrink-0">
      <div className="flex items-center">
        <BrandLogo
          showImage={false}
          showLabel
          labelClassName="text-[18px] font-semibold text-foreground tracking-tight"
        />
      </div>

      <div className="flex items-center gap-2 text-foreground">
        <span className="text-sm text-foreground/70">UTC +3</span>
        <span className="text-lg font-semibold font-mono tracking-wide">{time}</span>
      </div>
    </header>
  );
}
