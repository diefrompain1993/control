interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl mb-2">{title}</h1>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 gap-2 [&>*]:whitespace-nowrap">
          {actions}
        </div>
      )}
    </div>
  );
}
