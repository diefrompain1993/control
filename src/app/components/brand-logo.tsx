import { useEffect, useState } from 'react';

const LOGO_SRC = '/golf_icon.png';

interface BrandLogoProps {
  className?: string;
  fallbackClassName?: string;
  alt?: string;
  showLabel?: boolean;
  label?: string;
  labelClassName?: string;
  showImage?: boolean;
  src?: string;
}

export function BrandLogo({
  className,
  fallbackClassName,
  alt = 'Мониторинг въездов',
  showLabel = false,
  label = 'Мониторинг въездов',
  labelClassName,
  showImage = true,
  src = LOGO_SRC
}: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const imageNode = showImage
    ? failed
      ? (
          <span className={fallbackClassName ?? className} aria-label={alt}>
            {label}
          </span>
        )
      : (
          <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setFailed(true)}
          />
        )
    : null;

  if (!showLabel) {
    return imageNode;
  }

  return (
    <span className="inline-flex items-center gap-2">
      {imageNode}
      <span className={labelClassName ?? 'text-[16px] font-semibold text-foreground'}>
        {label}
      </span>
    </span>
  );
}
