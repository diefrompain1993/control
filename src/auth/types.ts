export type Role = 'admin' | 'office_admin' | 'guard';

export interface User {
  email: string;
  role: Role;
  fullName: string;
  lastLogin?: string;
}
