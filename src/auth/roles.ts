import type { Role, User } from './types';

export const roleLabels: Record<Role, string> = {
  admin: 'Администратор',
  office_admin: 'Офисный администратор',
  guard: 'Охрана'
};

export const hasRole = (user: User | null, roles: Role[]) => {
  if (!user) return false;
  return roles.includes(user.role);
};
