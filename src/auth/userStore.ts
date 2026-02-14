import { mockUsers, type MockUser } from './mockUsers';

const STORED_USERS_KEY = 'auth_extra_users';
const USER_OVERRIDES_KEY = 'auth_user_overrides';
const DELETED_USERS_KEY = 'auth_user_deleted';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const readStoredUsers = (): MockUser[] => {
  const raw = localStorage.getItem(STORED_USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as MockUser[];
  } catch {
    return [];
  }
};

const writeStoredUsers = (users: MockUser[]) => {
  localStorage.setItem(STORED_USERS_KEY, JSON.stringify(users));
};

const readOverrides = (): MockUser[] => {
  const raw = localStorage.getItem(USER_OVERRIDES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as MockUser[];
  } catch {
    return [];
  }
};

const writeOverrides = (users: MockUser[]) => {
  localStorage.setItem(USER_OVERRIDES_KEY, JSON.stringify(users));
};

const readDeletedUsers = (): string[] => {
  const raw = localStorage.getItem(DELETED_USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as string[];
  } catch {
    return [];
  }
};

const writeDeletedUsers = (emails: string[]) => {
  localStorage.setItem(DELETED_USERS_KEY, JSON.stringify(emails));
};

const applyOverrides = (users: MockUser[]) => {
  const deleted = new Set(readDeletedUsers());
  const overrides = readOverrides();
  const overrideMap = new Map(overrides.map((user) => [user.email, user]));
  return users
    .filter((user) => !deleted.has(user.email))
    .map((user) => overrideMap.get(user.email) ?? user);
};

const removeDeletedEmail = (email: string) => {
  const deleted = readDeletedUsers();
  if (!deleted.includes(email)) return;
  writeDeletedUsers(deleted.filter((entry) => entry !== email));
};

export const getStoredUsers = () => applyOverrides(readStoredUsers());

export const getAllUsers = () => applyOverrides([...mockUsers, ...readStoredUsers()]);

export const userExists = (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  return getAllUsers().some((user) => user.email === normalizedEmail);
};

export const addStoredUser = (user: MockUser) => {
  const normalizedEmail = normalizeEmail(user.email);
  const existing = getAllUsers().some((entry) => entry.email === normalizedEmail);
  if (existing) {
    throw new Error('Пользователь с таким email уже существует');
  }

  removeDeletedEmail(normalizedEmail);

  const storedUsers = readStoredUsers();
  const normalizedUser = { ...user, email: normalizedEmail };
  storedUsers.push(normalizedUser);
  writeStoredUsers(storedUsers);
  return normalizedUser;
};

export const updateUser = (email: string, updates: Partial<MockUser>) => {
  const normalizedEmail = normalizeEmail(email);
  const storedUsers = readStoredUsers();
  const storedIndex = storedUsers.findIndex((user) => user.email === normalizedEmail);

  if (storedIndex >= 0) {
    storedUsers[storedIndex] = { ...storedUsers[storedIndex], ...updates };
    writeStoredUsers(storedUsers);
    return storedUsers[storedIndex];
  }

  const baseUser = mockUsers.find((user) => user.email === normalizedEmail);
  if (!baseUser) {
    return null;
  }

  const overrides = readOverrides();
  const overrideIndex = overrides.findIndex((user) => user.email === normalizedEmail);
  const updatedUser = { ...baseUser, ...updates };

  if (overrideIndex >= 0) {
    overrides[overrideIndex] = updatedUser;
  } else {
    overrides.push(updatedUser);
  }

  writeOverrides(overrides);
  removeDeletedEmail(normalizedEmail);
  return updatedUser;
};

export const deleteUser = (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  const storedUsers = readStoredUsers();
  const storedIndex = storedUsers.findIndex((user) => user.email === normalizedEmail);

  if (storedIndex >= 0) {
    storedUsers.splice(storedIndex, 1);
    writeStoredUsers(storedUsers);
    return;
  }

  const overrides = readOverrides().filter((user) => user.email !== normalizedEmail);
  writeOverrides(overrides);

  const deleted = new Set(readDeletedUsers());
  deleted.add(normalizedEmail);
  writeDeletedUsers(Array.from(deleted));
};
