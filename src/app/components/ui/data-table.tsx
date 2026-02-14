interface Column {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export function DataTable({
  columns,
  data,
  loading = false,
  error,
  emptyMessage = 'Нет данных для отображения'
}: DataTableProps) {
  return (
    <div className="bg-white rounded-lg transition-all duration-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-${column.align || 'left'} py-3 px-4 text-sm text-gray-600`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center">
                  <div className="text-red-600 mb-2">Ошибка загрузки данных</div>
                  <div className="text-sm text-gray-500">{error}</div>
                </td>
              </tr>
            ) : loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b">
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 px-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '60%' }}></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-colors duration-150">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`text-${column.align || 'left'} py-3 px-4`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
