import { useState } from 'react';

const LOGO_SRC = '/golf_icon.png';

interface BrandLogoProps {
  className?: string;
  fallbackClassName?: string;
  alt?: string;
  showLabel?: boolean;
  label?: string;
  labelClassName?: string;
  showImage?: boolean;
}

export function BrandLogo({
  className,
  fallbackClassName,
  alt = 'Гольф-клуб "Сколково"',
  showLabel = false,
  label = 'Гольф-клуб "Сколково"',
  labelClassName,
  showImage = true
}: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  const imageNode = showImage
    ? failed
      ? (
          <span className={fallbackClassName ?? className} aria-label={alt}>
            {label}
          </span>
        )
      : (
          <img
            src={LOGO_SRC}
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
