import { useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  hidePlaceholderOption?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Выберите...',
  hidePlaceholderOption = false,
  disabled = false,
  size = 'md',
  className
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const sizeStyles = {
    sm: 'h-9 px-3 py-1.5 text-[13px]',
    md: 'h-10 px-3 py-2 text-sm'
  };

  return (
    <div>
      {label && <label className="block text-sm text-gray-600 mb-2">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(false);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onMouseDown={() => {
            if (!disabled) {
              setOpen(true);
            }
          }}
          disabled={disabled}
          className={`peer w-full appearance-none border border-gray-300 rounded transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 pr-9 ${sizeStyles[size]} ${className ?? ''}`}
        >
        <option
          value=""
          disabled={hidePlaceholderOption}
          hidden={hidePlaceholderOption}
          style={hidePlaceholderOption ? { display: 'none' } : undefined}
        >
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        </select>
        <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''} `}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
