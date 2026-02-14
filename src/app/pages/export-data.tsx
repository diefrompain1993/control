import { Download, FileText, Table as TableIcon, Users as UsersIcon } from 'lucide-react';
import { PageHeader } from '@/app/components/ui/page-header';

export function ExportData() {
  return (
    <>
      <PageHeader
        title="Экспорт данных"
        description="Экспорт отчётов и данных в различных форматах"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-500 transition-all duration-200">
          <div className="flex items-start gap-4 h-full">
            <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
              <TableIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg mb-2">Журнал въездов</h3>
              <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                Экспорт всех событий распознавания за выбранный период
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 self-start">
                <Download className="w-4 h-4" />
                Экспортировать
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-green-500 transition-all duration-200">
          <div className="flex items-start gap-4 h-full">
            <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg mb-2">Белый список</h3>
              <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                Экспорт списка разрешённых автомобилей
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 self-start">
                <Download className="w-4 h-4" />
                Экспортировать
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-red-500 transition-all duration-200">
          <div className="flex items-start gap-4 h-full">
            <div className="p-3 bg-red-100 rounded-lg flex-shrink-0">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg mb-2">Чёрный список</h3>
              <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                Экспорт списка запрещённых автомобилей
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 self-start">
                <Download className="w-4 h-4" />
                Экспортировать
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-purple-500 transition-all duration-200">
          <div className="flex items-start gap-4 h-full">
            <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg mb-2">Пользователи</h3>
              <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                Экспорт списка пользова��елей системы
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 self-start">
                <Download className="w-4 h-4" />
                Экспортировать
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg p-6">
        <h3 className="text-lg mb-4">Параметры экспорта</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Формат файла</label>
            <select className="w-full max-w-md px-3 py-2 border border-gray-300 rounded text-sm">
              <option>Excel (.xlsx)</option>
              <option>CSV (.csv)</option>
              <option>PDF (.pdf)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Период</label>
            <div className="flex gap-4 max-w-md">
              <input type="date" className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm" />
              <span className="self-center text-gray-600">—</span>
              <input type="date" className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}