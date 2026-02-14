import { Save } from 'lucide-react';
import { useState } from 'react';

export function Settings() {
  const [systemName, setSystemName] = useState('Мониторинг въездов');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [notifyAdmin, setNotifyAdmin] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState('admin@example.com');

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-2">Настройки</h1>
        <p className="text-sm text-gray-600">Конфигурация системы и параметры</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg p-6 mb-4">
        <h2 className="text-lg mb-4 pb-3 border-b">Общие настройки</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Название системы</label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="autoRefresh" className="text-sm text-gray-700">
              Автоматическое обновление данных
            </label>
          </div>

          {autoRefresh && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">Интервал обновления (секунды)</label>
              <input
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-48 px-4 py-2 border border-gray-300 rounded"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg p-6 mb-4">
        <h2 className="text-lg mb-4 pb-3 border-b">Уведомления</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="notifyAdmin"
              checked={notifyAdmin}
              onChange={(e) => setNotifyAdmin(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="notifyAdmin" className="text-sm text-gray-700">
              Отправлять уведомления администратору
            </label>
          </div>

          {notifyAdmin && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email для уведомлений</label>
              <input
                type="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                Уведомления будут отправляться при появлении автомобилей из чёрного списка
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Camera Settings */}
      <div className="bg-white rounded-lg p-6 mb-4">
        <h2 className="text-lg mb-4 pb-3 border-b">Настройки камер</h2>
        
        <div className="space-y-4">
          <div className="border rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">Въезд-1</h3>
                <p className="text-sm text-gray-600">192.168.1.101</p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                Подключена
              </span>
            </div>
            <button className="text-sm text-blue-600 hover:underline">
              Настроить камеру
            </button>
          </div>

          <div className="border rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">Въезд-2</h3>
                <p className="text-sm text-gray-600">192.168.1.102</p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                Подключена
              </span>
            </div>
            <button className="text-sm text-blue-600 hover:underline">
              Настроить камеру
            </button>
          </div>

          <button className="text-sm text-blue-600 hover:underline">
            + Добавить камеру
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Save className="w-4 h-4" />
          Сохранить изменения
        </button>
      </div>
    </>
  );
}
