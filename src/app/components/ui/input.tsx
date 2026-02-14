interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'time' | 'date';
  list?: string;
  step?: number | string;
  min?: string;
  max?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  icon,
  disabled = false,
  type = 'text',
  list,
  step,
  min,
  max,
  onFocus,
  onBlur
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-600 mb-2">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          list={list}
          step={step}
          min={min}
          max={max}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border border-gray-300 rounded text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50`}
        />
      </div>
    </div>
  );
}
