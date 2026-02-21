import { mockUsers, type MockUser } from './mockUsers';

const STORED_USERS_KEY = 'auth_extra_users';
const USER_OVERRIDES_KEY = 'auth_user_overrides';
const DELETED_USERS_KEY = 'auth_user_deleted';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const MOJIBAKE_REPLACEMENTS: Record<string, string> = {
  'РЃ': 'Ё',
  'Рђ': 'А',
  'Р‘': 'Б',
  'Р’': 'В',
  'Р“': 'Г',
  'Р”': 'Д',
  'Р•': 'Е',
  'Р–': 'Ж',
  'Р—': 'З',
  'Р': 'И',
  'Р™': 'Й',
  'Рљ': 'К',
  'Р›': 'Л',
  'Рњ': 'М',
  'Рќ': 'Н',
  'Рћ': 'О',
  'Рџ': 'П',
  'Р ': 'Р',
  'РЎ': 'С',
  'Рў': 'Т',
  'РЈ': 'У',
  'Р¤': 'Ф',
  'РҐ': 'Х',
  'Р¦': 'Ц',
  'Р§': 'Ч',
  'РЁ': 'Ш',
  'Р©': 'Щ',
  'РЄ': 'Ъ',
  'Р«': 'Ы',
  'Р¬': 'Ь',
  'Р­': 'Э',
  'Р®': 'Ю',
  'РЇ': 'Я',
  'Р°': 'а',
  'Р±': 'б',
  'Р²': 'в',
  'Рі': 'г',
  'Рґ': 'д',
  'Рµ': 'е',
  'Р¶': 'ж',
  'Р·': 'з',
  'Рё': 'и',
  'Р№': 'й',
  'Рє': 'к',
  'Р»': 'л',
  'Рј': 'м',
  'РЅ': 'н',
  'Рѕ': 'о',
  'Рї': 'п',
  'С‘': 'ё',
  'СЂ': 'р',
  'СЃ': 'с',
  'С‚': 'т',
  'Сѓ': 'у',
  'С„': 'ф',
  'С…': 'х',
  'С†': 'ц',
  'С‡': 'ч',
  'С€': 'ш',
  'С‰': 'щ',
  'СЉ': 'ъ',
  'С‹': 'ы',
  'СЊ': 'ь',
  'СЌ': 'э',
  'СЋ': 'ю',
  'СЏ': 'я',
  'В·': '·',
  'вЂ”': '—',
  'вЂ“': '–',
  'вЂ¦': '…',
  'в„–': '№',
  'вЂќ': '”',
  'вЂњ': '“',
  'вЂ™': '’',
  'вЂљ': '‚'
};

const MOJIBAKE_RE = new RegExp(
  Object.keys(MOJIBAKE_REPLACEMENTS)
    .sort((a, b) => b.length - a.length)
    .join('|'),
  'g'
);

const normalizeMojibakeText = (value: string) =>
  value.replace(MOJIBAKE_RE, (match) => MOJIBAKE_REPLACEMENTS[match] ?? match);

const normalizeUserText = (user: MockUser): MockUser => ({
  ...user,
  fullName: normalizeMojibakeText(user.fullName),
  lastLogin: normalizeMojibakeText(user.lastLogin)
});

const readStoredUsers = (): MockUser[] => {
  const raw = localStorage.getItem(STORED_USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as MockUser[]).map(normalizeUserText);
  } catch {
    return [];
  }
};

const writeStoredUsers = (users: MockUser[]) => {
  localStorage.setItem(
    STORED_USERS_KEY,
    JSON.stringify(users.map(normalizeUserText))
  );
};

const readOverrides = (): MockUser[] => {
  const raw = localStorage.getItem(USER_OVERRIDES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as MockUser[]).map(normalizeUserText);
  } catch {
    return [];
  }
};

const writeOverrides = (users: MockUser[]) => {
  localStorage.setItem(
    USER_OVERRIDES_KEY,
    JSON.stringify(users.map(normalizeUserText))
  );
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
    .map((user) => normalizeUserText(overrideMap.get(user.email) ?? user));
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
  const normalizedUser = normalizeUserText({ ...user, email: normalizedEmail });
  storedUsers.push(normalizedUser);
  writeStoredUsers(storedUsers);
  return normalizedUser;
};

export const updateUser = (email: string, updates: Partial<MockUser>) => {
  const normalizedEmail = normalizeEmail(email);
  const storedUsers = readStoredUsers();
  const storedIndex = storedUsers.findIndex((user) => user.email === normalizedEmail);

  if (storedIndex >= 0) {
    storedUsers[storedIndex] = normalizeUserText({
      ...storedUsers[storedIndex],
      ...updates
    });
    writeStoredUsers(storedUsers);
    return storedUsers[storedIndex];
  }

  const baseUser = mockUsers.find((user) => user.email === normalizedEmail);
  if (!baseUser) {
    return null;
  }

  const overrides = readOverrides();
  const overrideIndex = overrides.findIndex((user) => user.email === normalizedEmail);
  const updatedUser = normalizeUserText({ ...baseUser, ...updates });

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
