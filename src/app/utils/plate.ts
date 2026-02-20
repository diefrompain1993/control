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
const PLATE_COUNTRY_CODE_RE = new RegExp(`\\b(${PLATE_COUNTRY_CODES.join('|')})\\b`, 'i');

const PLATE_LETTERS = 'A-Z\u0410\u0412\u0415\u041a\u041c\u041d\u041e\u0420\u0421\u0422\u0423\u0425';
const PLATE_LETTER_CLASS = `[${PLATE_LETTERS}]`;

const platePatterns: Array<{ code: PlateCountryCode; re: RegExp }> = [
  { code: 'UA', re: new RegExp(`^${PLATE_LETTER_CLASS}{2}\\d{4}${PLATE_LETTER_CLASS}{2}$`) },
  { code: 'BY', re: new RegExp(`^\\d{4}${PLATE_LETTER_CLASS}{2}\\d$`) },
  { code: 'KZ', re: new RegExp(`^\\d{3}${PLATE_LETTER_CLASS}{3}\\d{2}$`) },
  { code: 'AZ', re: new RegExp(`^\\d{2,3}${PLATE_LETTER_CLASS}{2}\\d{3}$`) },
  { code: 'KG', re: new RegExp(`^\\d{2}\\d{3}${PLATE_LETTER_CLASS}{3}$`) },
  { code: 'UZ', re: new RegExp(`^\\d{2}${PLATE_LETTER_CLASS}\\d{3}${PLATE_LETTER_CLASS}{2}$`) },
  { code: 'UZ', re: new RegExp(`^\\d{2}\\d{3}${PLATE_LETTER_CLASS}{3}$`) },
  { code: 'AM', re: new RegExp(`^\\d{2}${PLATE_LETTER_CLASS}{2}\\d{3}$`) },
  { code: 'AM', re: new RegExp(`^\\d{3}${PLATE_LETTER_CLASS}{2}\\d{2}$`) },
  { code: 'TJ', re: new RegExp(`^\\d{4}${PLATE_LETTER_CLASS}{2}\\d{2}$`) },
  { code: 'MD', re: new RegExp(`^${PLATE_LETTER_CLASS}{3}\\d{3}$`) },
  { code: 'RUS', re: new RegExp(`^${PLATE_LETTER_CLASS}\\d{3}${PLATE_LETTER_CLASS}{2}\\d{0,3}$`) }
];

const BY_FORMAT_RE = new RegExp(`^(\\d{4})(${PLATE_LETTER_CLASS}{2})(\\d)$`);
const KZ_FORMAT_RE = new RegExp(`^(\\d{3})(${PLATE_LETTER_CLASS}{3})(\\d{2})$`);
const RUS_FORMAT_RE = new RegExp(
  `^(${PLATE_LETTER_CLASS})(\\d{3})(${PLATE_LETTER_CLASS}{2})(\\d{2,3})$`
);
const UA_FORMAT_RE = new RegExp(
  `^(${PLATE_LETTER_CLASS}{2})(\\d{4})(${PLATE_LETTER_CLASS}{2})$`
);
const AZ_FORMAT_RE = new RegExp(`^(\\d{2,3})(${PLATE_LETTER_CLASS}{2})(\\d{3})$`);
const KG_FORMAT_RE = new RegExp(`^(\\d{2})(\\d{3})(${PLATE_LETTER_CLASS}{3})$`);
const MD_FORMAT_RE = new RegExp(`^(${PLATE_LETTER_CLASS}{3})(\\d{3})$`);
const AM_FORMAT_RE = new RegExp(`^(\\d{2})(${PLATE_LETTER_CLASS}{2})(\\d{3})$`);
const AM_ALT_FORMAT_RE = new RegExp(`^(\\d{3})(${PLATE_LETTER_CLASS}{2})(\\d{2})$`);
const TJ_FORMAT_RE = new RegExp(`^(\\d{4})(${PLATE_LETTER_CLASS}{2})(\\d{2})$`);
const TM_FORMAT_RE = new RegExp(
  `^(${PLATE_LETTER_CLASS}{2})(\\d{4})(${PLATE_LETTER_CLASS}{2})$`
);
const UZ_FORMAT_RE = new RegExp(
  `^(\\d{2})(${PLATE_LETTER_CLASS})(\\d{3})(${PLATE_LETTER_CLASS}{2})$`
);
const UZ_ALT_FORMAT_RE = new RegExp(`^(\\d{2})(\\d{3})(${PLATE_LETTER_CLASS}{3})$`);

const stripPlateCountryPrefix = (value: string) => value.replace(PLATE_COUNTRY_PREFIX, '');
const sanitizePlateValue = (value: string) =>
  normalizePlateNumber(stripPlateCountryPrefix(value)).replace(/[^A-Z\u0410-\u042f0-9]/g, '');

const extractPlateCountryCode = (value?: string) => {
  if (!value) return null;
  const match = value.match(PLATE_COUNTRY_CODE_RE);
  return match ? (match[1].toUpperCase() as PlateCountryCode) : null;
};

const normalizeRegionValue = (value?: string) =>
  normalizePlateNumber(value ?? '').replace(/[^A-Z\u0410-\u042f0-9]/g, '');

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getRegionDigits = (value: string, length?: number) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return length ? digits.slice(0, length) : digits;
};

const getRegionLetters = (value: string, length?: number) => {
  const letters = value.replace(/[^A-Z\u0410-\u042f]/g, '');
  if (!letters) return '';
  return length ? letters.slice(0, length) : letters;
};

const formatByCountry = (normalized: string, code: PlateCountryCode) => {
  switch (code) {
    case 'BY':
      return normalized.replace(BY_FORMAT_RE, '$1 $2-$3');
    case 'KZ':
      return normalized.replace(KZ_FORMAT_RE, '$1 $2 $3');
    case 'RUS':
      return normalized.replace(RUS_FORMAT_RE, '$1$2$3 $4');
    case 'UA':
      return normalized.replace(UA_FORMAT_RE, '$1 $2 $3');
    case 'AZ':
      return normalized.replace(
        AZ_FORMAT_RE,
        (_, region: string, letters: string, digits: string) =>
          region.length === 2 ? `${region}-${letters}-${digits}` : `${region} ${letters} ${digits}`
      );
    case 'KG':
      return normalized.replace(KG_FORMAT_RE, '$1 $2$3');
    case 'MD':
      return normalized.replace(MD_FORMAT_RE, '$1 $2');
    case 'AM': {
      const primary = normalized.replace(AM_FORMAT_RE, '$1 $2 $3');
      return primary !== normalized ? primary : normalized.replace(AM_ALT_FORMAT_RE, '$1 $2 $3');
    }
    case 'TJ':
      return normalized.replace(TJ_FORMAT_RE, '$1 $2 $3');
    case 'TM':
      return normalized.replace(TM_FORMAT_RE, '$1 $2 $3');
    case 'UZ': {
      const primary = normalized.replace(UZ_FORMAT_RE, '$1 $2$3$4');
      return primary !== normalized ? primary : normalized.replace(UZ_ALT_FORMAT_RE, '$1 $2$3');
    }
    default:
      return normalized;
  }
};

export const buildPlateNumber = (plate: string, region?: string, _country?: string) => {
  const normalized = sanitizePlateValue(plate);
  if (!normalized) return '';
  const regionValue = normalizeRegionValue(region);
  const rusMatch = normalized.match(
    new RegExp(`^(${PLATE_LETTER_CLASS}\\d{3}${PLATE_LETTER_CLASS}{2})(\\d{2,3})?$`)
  );

  if (rusMatch) {
    const base = rusMatch[1];
    const existingRegion = rusMatch[2] ?? '';
    const nextRegion = getRegionDigits(regionValue, 3) || existingRegion;
    return nextRegion ? `${base}${nextRegion}` : base;
  }

  if (!regionValue || normalized.endsWith(regionValue)) {
    return normalized;
  }

  return `${normalized}${regionValue}`;
};

export const formatPlateNumber = (value: string) => {
  const normalized = sanitizePlateValue(value);
  const info = getPlateCountryInfo(value);
  return formatByCountry(normalized, info.code);
};

export const formatPlateNumberWithRegion = (
  plate: string,
  region?: string,
  country?: string
) => {
  const built = buildPlateNumber(plate, region, country);
  const formattedBuilt = formatPlateNumber(built);
  const normalizedRegion = normalizeRegionValue(region);

  if (!normalizedRegion) return formattedBuilt;

  const separatedRegionPattern = new RegExp(`[\\s-]${escapeRegExp(normalizedRegion)}$`);
  if (separatedRegionPattern.test(formattedBuilt)) {
    return formattedBuilt;
  }

  const normalizedPlate = sanitizePlateValue(plate);
  const base =
    normalizedPlate.endsWith(normalizedRegion)
      ? normalizedPlate.slice(0, -normalizedRegion.length)
      : normalizedPlate;
  const formattedBase = base ? formatPlateNumber(base) : formattedBuilt;

  return `${formattedBase} ${normalizedRegion}`.trim();
};

export const getPlateCountryCode = (value: string, country?: string) => {
  const explicitCode = extractPlateCountryCode(country);
  if (explicitCode) return explicitCode;
  const info = getPlateCountryInfo(value);
  return info.code === 'UNKNOWN' ? '—' : info.code;
};

export const getPlateRegionCode = (value: string) => getPlateCountryCode(value);

export const getPlateRegionLabel = (value: string, country?: string) =>
  getPlateCountryCode(value, country);

export const formatPlateWithCountryCode = (value: string, country?: string) =>
  `${formatPlateNumber(value)} (${getPlateCountryCode(value, country)})`;

export const formatPlateWithRegionLabel = (value: string, country?: string) =>
  formatPlateWithCountryCode(value, country);

export const formatPlateWithRegion = (value: string) =>
  formatPlateWithCountryCode(value);

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
