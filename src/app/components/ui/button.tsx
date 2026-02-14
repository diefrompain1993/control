interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center gap-2 rounded transition-all duration-200 font-normal';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 active:scale-95',
    secondary: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transform hover:scale-105 active:scale-95',
    destructive: 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-105 active:scale-95'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm'
  };
  
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
