import type { VehicleCategory, StoredVehicle } from '@/app/utils/vehicleStore';

export const BASE_VEHICLES: Record<VehicleCategory, StoredVehicle[]> = {
  white: [
    {
      id: 'white-1',
      category: 'white',
      plateNumber: 'Х777ХХ',
      owner: 'Петров П.П.',
      addedDate: '15.01.2025'
    },
    {
      id: 'white-2',
      category: 'white',
      plateNumber: 'Т888ТТ',
      owner: 'Николаев В.В.',
      addedDate: '20.01.2025'
    },
    {
      id: 'white-3',
      category: 'white',
      plateNumber: 'Р999РР',
      owner: 'Федоров С.И.',
      addedDate: '22.01.2025'
    },
    {
      id: 'white-4',
      category: 'white',
      plateNumber: 'С777МС',
      owner: 'Васильев О.И.',
      addedDate: '24.01.2025'
    }
  ],
  black: [
    {
      id: 'black-1',
      category: 'black',
      plateNumber: 'А123ВС',
      owner: 'Иванов И.И.',
      addedDate: '10.01.2025',
      notes: 'Нарушение режима'
    },
    {
      id: 'black-2',
      category: 'black',
      plateNumber: 'В222ВВ',
      owner: 'Соколов М.К.',
      addedDate: '18.01.2025',
      notes: 'Запрещён въезд'
    }
  ],
  contractor: [
    {
      id: 'contractor-1',
      category: 'contractor',
      plateNumber: 'М999МР',
      owner: 'ООО "СМК"',
      addedDate: '05.01.2025',
      notes: 'Подрядчик стройки'
    },
    {
      id: 'contractor-2',
      category: 'contractor',
      plateNumber: 'О555ОО',
      owner: 'ООО "СМК"',
      addedDate: '12.01.2025',
      notes: 'Временный доступ'
    },
    {
      id: 'contractor-3',
      category: 'contractor',
      plateNumber: 'К777КК',
      owner: 'ООО "ГрандСтрой"',
      addedDate: '18.01.2025',
      notes: 'Проектный подрядчик'
    },
    {
      id: 'contractor-4',
      category: 'contractor',
      plateNumber: 'Н123НН',
      owner: 'ООО "ТрансСервис"',
      addedDate: '21.01.2025',
      notes: 'Логистика'
    },
    {
      id: 'contractor-5',
      category: 'contractor',
      plateNumber: 'С909СС',
      owner: 'ООО "АльфаИнжиниринг"',
      addedDate: '25.01.2025',
      notes: 'Инженерные работы'
    }
  ],
  unlisted: [
    {
      id: 'unlisted-1',
      category: 'unlisted',
      plateNumber: 'К456КМ',
      owner: 'Неизвестно',
      addedDate: '24.01.2025',
      notes: 'Плохо распознан номер'
    },
    {
      id: 'unlisted-2',
      category: 'unlisted',
      plateNumber: 'С111СС',
      owner: 'Неизвестно',
      addedDate: '26.01.2025',
      notes: 'Плохо распознан номер'
    },
    {
      id: 'unlisted-3',
      category: 'unlisted',
      plateNumber: 'Р321КР',
      owner: 'Неизвестно',
      addedDate: '27.01.2025',
      notes: 'Плохо распознан номер'
    }
  ]
};
