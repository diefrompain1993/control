import type { User } from './types';

export interface MockUser extends User {
  password: string;
  lastLogin: string;
}

export const mockUsers: MockUser[] = [
  {
    email: 'admin@example.com',
    password: 'AdminPass1234',
    role: 'admin',
    fullName: 'Макаров Иван Сергеевич',
    lastLogin: '14.02.2026 09:15:42'
  },
  {
    email: 'office@example.com',
    password: 'OfficePass1234',
    role: 'office_admin',
    fullName: 'Соколова Анна Петровна',
    lastLogin: '13.02.2026 18:05:12'
  },
  {
    email: 'guard@example.com',
    password: 'GuardPass1234',
    role: 'guard',
    fullName: 'Крылов Дмитрий Олегович',
    lastLogin: '14.02.2026 07:58:03'
  }
];
