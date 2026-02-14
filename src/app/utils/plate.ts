export const normalizePlateNumber = (value: string) => {
  if (!value) return '';

  const map: Record<string, string> = {
    A: '\u0410',
    B: '\u0412',
    C: '\u0421',
    E: '\u0415',
    H: '\u041d',
    K: '\u041a',
    M: '\u041c',
    O: '\u041e',
    P: '\u0420',
    T: '\u0422',
    X: '\u0425',
    Y: '\u0423',
    R: '\u0420'
  };

  return value
    .toUpperCase()
    .replace(/[\s-]+/g, '')
    .replace(/[A-Z]/g, (char) => map[char] ?? char);
};

type PlateCountryCode =
  | 'RUS'
  | 'BY'
  | 'KZ'
  | 'UA'
  | 'AM'
  | 'AZ'
  | 'KG'
  | 'MD'
  | 'TJ'
  | 'TM'
  | 'UZ'
  | 'UNKNOWN';

const PLATE_COUNTRY_LABELS: Record<PlateCountryCode, string> = {
  RUS: '\u0420\u0443\u0441\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  BY: '\u0411\u0435\u043b\u043e\u0440\u0443\u0441\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  KZ: '\u041a\u0430\u0437\u0430\u0445\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  UA: '\u0423\u043a\u0440\u0430\u0438\u043d\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  AM: '\u0410\u0440\u043c\u044f\u043d\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  AZ: '\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  KG: '\u041a\u044b\u0440\u0433\u044b\u0437\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  MD: '\u041c\u043e\u043b\u0434\u0430\u0432\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  TJ: '\u0422\u0430\u0434\u0436\u0438\u043a\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  TM: '\u0422\u0443\u0440\u043a\u043c\u0435\u043d\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  UZ: '\u0423\u0437\u0431\u0435\u043a\u0441\u043a\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430',
  UNKNOWN: '\u0414\u0440\u0443\u0433\u0438\u0435 \u043d\u043e\u043c\u0435\u0440\u0430'
};

const PLATE_COUNTRY_CODES: PlateCountryCode[] = [
  'RUS',
  'BY',
  'KZ',
  'UA',
  'AM',
  'AZ',
  'KG',
  'MD',
  'TJ',
  'TM',
  'UZ'
];

const PLATE_COUNTRY_PREFIX = new RegExp(
  `^(${PLATE_COUNTRY_CODES.join('|')})[\\s-]*`,
  'i'
);

const PLATE_LETTERS = 'A-Z\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425';
const PLATE_LETTER_CLASS = `[${PLATE_LETTERS}]`;

const platePatterns: Array<{ code: PlateCountryCode; re: RegExp }> = [
  { code: 'UA', re: new RegExp(`^${PLATE_LETTER_CLASS}{2}\\d{4}${PLATE_LETTER_CLASS}{2}$`) },
  { code: 'BY', re: new RegExp(`^\\d{4}${PLATE_LETTER_CLASS}{2}\\d$`) },
  { code: 'KZ', re: new RegExp(`^\\d{3}${PLATE_LETTER_CLASS}{3}\\d{2}$`) },
  { code: 'RUS', re: new RegExp(`^${PLATE_LETTER_CLASS}\\d{3}${PLATE_LETTER_CLASS}{2}\\d{0,3}$`) }
];

const BY_FORMAT_RE = new RegExp(`^(\\d{4})(${PLATE_LETTER_CLASS}{2})(\\d)$`);
const KZ_FORMAT_RE = new RegExp(`^(\\d{3})(${PLATE_LETTER_CLASS}{3})(\\d{2})$`);

const stripPlateCountryPrefix = (value: string) => value.replace(PLATE_COUNTRY_PREFIX, '');

const formatByCountry = (normalized: string, code: PlateCountryCode) => {
  switch (code) {
    case 'BY':
      return normalized.replace(BY_FORMAT_RE, '$1 $2-$3');
    case 'KZ':
      return normalized.replace(KZ_FORMAT_RE, '$1 $2 $3');
    default:
      return normalized;
  }
};

export const formatPlateNumber = (value: string) => {
  const stripped = stripPlateCountryPrefix(value);
  const normalized = normalizePlateNumber(stripped);
  const info = getPlateCountryInfo(normalized);
  return formatByCountry(normalized, info.code);
};

export const getPlateCountryInfo = (value: string) => {
  const trimmed = value.trim();
  const prefixMatch = trimmed.match(PLATE_COUNTRY_PREFIX);

  if (prefixMatch) {
    const code = prefixMatch[1].toUpperCase() as PlateCountryCode;
    return { code, label: PLATE_COUNTRY_LABELS[code] };
  }

  const normalized = normalizePlateNumber(stripPlateCountryPrefix(trimmed)).replace(
    /[^A-Z\u0410-\u042f0-9]/g,
    ''
  );

  for (const pattern of platePatterns) {
    if (pattern.re.test(normalized)) {
      return { code: pattern.code, label: PLATE_COUNTRY_LABELS[pattern.code] };
    }
  }

  return { code: 'UNKNOWN' as PlateCountryCode, label: PLATE_COUNTRY_LABELS.UNKNOWN };
};
