export interface AuditEntry {
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
}

const STORAGE_KEY = 'audit_log_entries';
const MAX_AUDIT_ENTRIES = 500;

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

const normalizeChangeSeparator = (value: string) => value.replaceAll(' > ', ' → ');

const normalizeAuditEntry = (entry: AuditEntry): AuditEntry => ({
  timestamp: entry.timestamp,
  user: normalizeMojibakeText(entry.user),
  action: normalizeMojibakeText(entry.action),
  target: normalizeMojibakeText(entry.target),
  details: normalizeChangeSeparator(normalizeMojibakeText(entry.details))
});

const readStoredEntries = (): AuditEntry[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const normalized = (parsed as AuditEntry[]).map(normalizeAuditEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return [];
  }
};

const writeStoredEntries = (entries: AuditEntry[]) => {
  const normalized = entries.map(normalizeAuditEntry).slice(0, MAX_AUDIT_ENTRIES);
  let nextEntries = normalized;
  while (nextEntries.length > 0) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
      return;
    } catch {
      const nextLength = Math.floor(nextEntries.length / 2);
      if (nextLength <= 0) break;
      nextEntries = nextEntries.slice(0, nextLength);
    }
  }
};

export const getStoredAuditEntries = () => readStoredEntries();

export const addAuditLogEntry = (entry: AuditEntry) => {
  try {
    const entries = readStoredEntries();
    entries.unshift(normalizeAuditEntry(entry));
    writeStoredEntries(entries);
  } catch {
    // Audit log failures must not block main user actions.
  }
};
