import type { Role } from '@/auth/types';

export type RouteId =
  | 'dashboard'
  | 'events'
  | 'white-list'
  | 'black-list'
  | 'contractors'
  | 'vehicles'
  | 'users'
  | 'settings'
  | 'audit'
  | 'export';

const ALL_ROLES: Role[] = ['admin', 'office_admin', 'guard'];
const ADMIN_ROLES: Role[] = ['admin', 'office_admin'];
const EXPORT_ROLES: Role[] = ['office_admin'];

export const ROUTE_CONFIG: Record<RouteId, { path: string; roles: Role[] }> = {
  dashboard: {
    path: '/',
    roles: ALL_ROLES
  },
  events: {
    path: '/events',
    roles: ALL_ROLES
  },
  'white-list': {
    path: '/white-list',
    roles: ALL_ROLES
  },
  'black-list': {
    path: '/black-list',
    roles: ALL_ROLES
  },
  contractors: {
    path: '/contractors',
    roles: ALL_ROLES
  },
  vehicles: {
    path: '/vehicles',
    roles: ALL_ROLES
  },
  users: {
    path: '/users',
    roles: ADMIN_ROLES
  },
  settings: {
    path: '/settings',
    roles: ALL_ROLES
  },
  audit: {
    path: '/audit',
    roles: ADMIN_ROLES
  },
  export: {
    path: '/export',
    roles: EXPORT_ROLES
  }
};

export const MAIN_NAV_ROUTES: RouteId[] = [
  'dashboard',
  'events',
  'white-list',
  'black-list',
  'contractors',
  'vehicles'
];

export const MISC_NAV_ROUTES: RouteId[] = ['audit', 'export'];

export const DEFAULT_ROUTE_BY_ROLE: Record<Role, RouteId> = {
  admin: 'dashboard',
  office_admin: 'dashboard',
  guard: 'dashboard'
};

const PATH_ALIASES: Record<string, RouteId> = {
  '/dashboard': 'dashboard'
};

export const resolveRouteId = (pathname: string): RouteId | null => {
  const trimmed = pathname.replace(/\/+$/, '') || '/';
  if (PATH_ALIASES[trimmed]) return PATH_ALIASES[trimmed];

  const entry = Object.entries(ROUTE_CONFIG).find(([, config]) => config.path === trimmed);
  return entry ? (entry[0] as RouteId) : null;
};

export const getRoutePath = (routeId: RouteId) => ROUTE_CONFIG[routeId].path;
