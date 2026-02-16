export interface EventLogEntry {
  date: string;
  time: string;
  camera: string;
  plateNumber: string;
  owner: string;
  status: 'Чёрный' | 'Белый' | 'Нет в списках' | 'Подрядчик';
}

export const MOCK_EVENTS: EventLogEntry[] = [
  {
    date: '14.02.2026',
    time: '12:41:23',
    camera: 'Въезд-1',
    plateNumber: 'A123BC77',
    owner: 'Иванов И.И.',
    status: 'Чёрный'
  },
  {
    date: '14.02.2026',
    time: '12:39:45',
    camera: 'Въезд-2',
    plateNumber: 'X777XX78',
    owner: 'Петров П.П.',
    status: 'Белый'
  },
  {
    date: '14.02.2026',
    time: '12:35:12',
    camera: 'Въезд-1',
    plateNumber: 'M999MR77',
    owner: 'ООО "СМК"',
    status: 'Подрядчик'
  },
  {
    date: '14.02.2026',
    time: '12:20:08',
    camera: 'Въезд-1',
    plateNumber: 'K456KM77',
    owner: 'Неизвестно',
    status: 'Нет в списках'
  },
  {
    date: '13.02.2026',
    time: '12:15:33',
    camera: 'Въезд-2',
    plateNumber: 'T888TT78',
    owner: 'Николаев В.В.',
    status: 'Белый'
  },
  {
    date: '13.02.2026',
    time: '12:10:17',
    camera: 'Въезд-1',
    plateNumber: 'O555OO50',
    owner: 'ООО "СМК"',
    status: 'Подрядчик'
  },
  {
    date: '13.02.2026',
    time: '11:58:42',
    camera: 'Въезд-3',
    plateNumber: 'K777KK52',
    owner: 'ООО "ГрандСтрой"',
    status: 'Подрядчик'
  },
  {
    date: '13.02.2026',
    time: '12:05:44',
    camera: 'Въезд-2',
    plateNumber: 'C111CC50',
    owner: 'Неизвестно',
    status: 'Нет в списках'
  },
  {
    date: '12.02.2026',
    time: '12:22:19',
    camera: 'Въезд-1',
    plateNumber: 'H123HH16',
    owner: 'ООО "ТрансСервис"',
    status: 'Подрядчик'
  },
  {
    date: '13.02.2026',
    time: '12:01:09',
    camera: 'Въезд-1',
    plateNumber: 'B222BB50',
    owner: 'Соколов М.К.',
    status: 'Чёрный'
  },
  {
    date: '12.02.2026',
    time: '11:54:22',
    camera: 'Въезд-3',
    plateNumber: '123ABC45',
    owner: 'ТОО "Алма"',
    status: 'Белый'
  },
  {
    date: '12.02.2026',
    time: '11:48:05',
    camera: 'Въезд-2',
    plateNumber: '1234AB5',
    owner: 'ОАО "МинскСтрой"',
    status: 'Чёрный'
  }
];
