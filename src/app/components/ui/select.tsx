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
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Выберите...',
  hidePlaceholderOption = false,
  disabled = false,
  size = 'md'
}: SelectProps) {
  const sizeStyles = {
    sm: 'h-9 px-3 py-1.5 text-[13px]',
    md: 'h-10 px-3 py-2 text-sm'
  };

  return (
    <div>
      {label && <label className="block text-sm text-gray-600 mb-2">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 ${sizeStyles[size]}`}
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
    </div>
  );
}
