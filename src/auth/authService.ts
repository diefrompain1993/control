import type { Role, User } from './types';
import { getAllUsers } from './userStore';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const AUTH_LAST_LOGIN_KEY = 'auth_last_login';
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const INVALID_CREDENTIALS_MESSAGE = 'Неверный email или пароль';

interface TokenPayload {
  email: string;
  role: Role;
  exp: number;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const base64UrlEncode = (value: string) =>
  btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const base64UrlDecode = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  return atob(`${base64}${padding}`);
};

const createToken = (user: User) => {
  const payload: TokenPayload = {
    email: user.email,
    role: user.role,
    exp: Date.now() + TOKEN_TTL_MS
  };

  // Mock token (NOT secure). This is only for local session simulation.
  return `mock.${base64UrlEncode(JSON.stringify(payload))}.token`;
};

const decodeToken = (token: string): TokenPayload | null => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payloadRaw = base64UrlDecode(parts[1]);
    return JSON.parse(payloadRaw) as TokenPayload;
  } catch {
    return null;
  }
};

const clearSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

const isTokenValid = (token: string | null, user: User | null) => {
  if (!token || !user) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  if (payload.email !== user.email || payload.role !== user.role) return false;
  return payload.exp > Date.now();
};

const formatDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

const readLastLoginMap = () => {
  const raw = localStorage.getItem(AUTH_LAST_LOGIN_KEY);
  if (!raw) return {} as Record<string, string>;
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
};

const writeLastLoginMap = (map: Record<string, string>) => {
  localStorage.setItem(AUTH_LAST_LOGIN_KEY, JSON.stringify(map));
};

export const getCurrentTimestamp = () => formatDateTime(new Date());

export const setLastLoginByEmail = (email: string, timestamp: string) => {
  const map = readLastLoginMap();
  map[email] = timestamp;
  writeLastLoginMap(map);
};

export const recordLastLogin = (email: string) => {
  const timestamp = getCurrentTimestamp();
  setLastLoginByEmail(email, timestamp);
  return timestamp;
};

export const getLastLoginByEmail = (email: string) => {
  const map = readLastLoginMap();
  return map[email] ?? null;
};

export const login = (email: string, password: string) => {
  const normalizedEmail = normalizeEmail(email);
  const foundUser = getAllUsers().find((user) => user.email === normalizedEmail);

  if (!foundUser || foundUser.password !== password) {
    throw new Error(INVALID_CREDENTIALS_MESSAGE);
  }

  const lastLogin = recordLastLogin(foundUser.email);
  const { password: _password, ...safeUser } = foundUser;
  const userWithLastLogin = { ...safeUser, lastLogin };
  const token = createToken(userWithLastLogin);

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithLastLogin));

  return { user: userWithLastLogin, token };
};

export const logout = () => {
  clearSession();
};

export const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const user = getCurrentUser();
  const valid = isTokenValid(token, user);
  if (!valid) {
    clearSession();
  }
  return valid;
};

export const getValidSession = (): { user: User; token: string } | null => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const user = getCurrentUser();
  if (!isTokenValid(token, user)) {
    clearSession();
    return null;
  }
  return { user: user as User, token: token as string };
};

export const authMessages = {
  invalidCredentials: INVALID_CREDENTIALS_MESSAGE
};
