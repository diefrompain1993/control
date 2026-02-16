const ORG_PREFIX_RE = /^(?:\u043E\u043E\u043E|\u043E\u0430\u043E|\u0437\u0430\u043E|\u043F\u0430\u043E|\u0430\u043E|\u0442\u043E\u043E|\u0438\u043F|\u0447\u043F|ooo|oao|zao|pao|ao)/i;

export const isOrganizationName = (value: string) => {
  const trimmed = value.trim();
  return ORG_PREFIX_RE.test(trimmed) || /["\u00AB\u00BB]/.test(trimmed);
};

export const normalizeOrganizationName = (value: string) => {
  const cleaned = value
    .toLowerCase()
    .replace(/["'\u00AB\u00BB]/g, '')
    .replace(/[^a-z\u0430-\u044f\u04510-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.replace(ORG_PREFIX_RE, '').trim();
};

export const normalizeOwnerName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z\u0430-\u044f\u0451\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const getOwnerShortLabel = (value: string) => {
  if (isOrganizationName(value)) {
    return value.trim();
  }

  const cleaned = value
    .replace(/[^A-Za-z\u0410-\u042f\u0430-\u044f\u0401\u0451\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return value.trim();
  return cleaned.split(' ')[0];
};