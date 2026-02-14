interface FilterBarProps {
  children: React.ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg p-4 mb-4 transition-all duration-200">
      {children}
    </div>
  );
}

interface FilterGroupProps {
  columns?: number;
  children: React.ReactNode;
}

export function FilterGroup({ columns = 4, children }: FilterGroupProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {children}
    </div>
  );
}
