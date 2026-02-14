import { AlertTriangle, Star, MoreHorizontal } from 'lucide-react';

interface Alert {
  icon: React.ReactNode;
  message: string;
  type: 'warning' | 'info';
}

const alerts: Alert[] = [
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    message: '3 события в чёрном списке сегодня',
    type: 'warning'
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    message: 'Ошибка отправки уведомления в Mattermost',
    type: 'warning'
  },
  {
    icon: <Star className="w-5 h-5" />,
    message: '2 "особых" автомобиля за последний час',
    type: 'info'
  }
];

export function AlertsPanel() {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Важное</h2>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`${alert.type === 'warning' ? 'text-yellow-500' : 'text-yellow-400'}`}>
              {alert.icon}
            </div>
            <p className="text-sm text-gray-700 flex-1">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
