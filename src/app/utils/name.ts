export const getNameWithInitials = (fullName?: string | null, fallback = '—') => {
  if (!fullName) return fallback;

  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;

  const [lastName, firstName, middleName] = parts;
  const extractInitial = (value?: string) => {
    if (!value) return '';
    const match = value.match(/[A-Za-zА-Яа-я]/);
    return match ? match[0].toUpperCase() : '';
  };

  const firstInitial = extractInitial(firstName);
  const middleInitial = extractInitial(middleName);
  const initials = [firstInitial, middleInitial]
    .filter(Boolean)
    .map((char) => `${char}.`)
    .join(' ');

  return `${lastName}${initials ? ` ${initials}` : ''}`;
};
