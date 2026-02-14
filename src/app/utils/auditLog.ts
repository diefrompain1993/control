export interface AuditEntry {
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
}

const STORAGE_KEY = 'audit_log_entries';

const readStoredEntries = (): AuditEntry[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as AuditEntry[];
  } catch {
    return [];
  }
};

const writeStoredEntries = (entries: AuditEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const getStoredAuditEntries = () => readStoredEntries();

export const addAuditLogEntry = (entry: AuditEntry) => {
  const entries = readStoredEntries();
  entries.unshift(entry);
  writeStoredEntries(entries);
};
