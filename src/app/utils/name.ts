const INITIAL_RE = /[A-Za-zА-Яа-яЁё]/;

const toTitleCase = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => (part ? `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}` : ''))
    .join('-');

const extractInitial = (value?: string) => {
  if (!value) return '';
  const match = value.match(INITIAL_RE);
  return match ? match[0].toUpperCase() : '';
};

const extractInitialsFromTokens = (tokens: string[]) => {
  const letters = tokens.flatMap((token) => token.match(INITIAL_RE) ?? []);
  return letters.slice(0, 2).map((char) => `${char.toUpperCase()}.`).join('');
};

export const getNameWithInitials = (fullName?: string | null, fallback = '—') => {
  if (!fullName) return fallback;

  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;

  const lastName = toTitleCase(parts[0]);
  const tail = parts.slice(1);
  const hasInitialTokens =
    tail.length > 0 && tail.every((part) => part.includes('.') || part.length === 1);

  if (hasInitialTokens) {
    const initials = extractInitialsFromTokens(tail);
    return `${lastName}${initials ? ` ${initials}` : ''}`;
  }

  const firstInitial = extractInitial(parts[1]);
  const middleInitial = extractInitial(parts[2]);
  const initials = [firstInitial, middleInitial]
    .filter(Boolean)
    .map((char) => `${char}.`)
    .join('');

  return `${lastName}${initials ? ` ${initials}` : ''}`;
};
