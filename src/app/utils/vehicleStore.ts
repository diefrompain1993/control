export type VehicleCategory = 'white' | 'black' | 'contractor' | 'unlisted';

export interface StoredVehicle {
  id: string;
  category: VehicleCategory;
  plateNumber: string;
  region?: string;
  country?: string;
  owner: string;
  addedDate: string;
  notes?: string;
}


const STORAGE_KEY = 'stored_vehicles';
const OVERRIDES_KEY = 'vehicle_overrides';
const DELETED_KEY = 'vehicle_deleted_ids';

const readStoredVehicles = (): StoredVehicle[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredVehicle[];
  } catch {
    return [];
  }
};

const writeStoredVehicles = (vehicles: StoredVehicle[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
};

const readOverrides = (): StoredVehicle[] => {
  const raw = localStorage.getItem(OVERRIDES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredVehicle[];
  } catch {
    return [];
  }
};

const writeOverrides = (vehicles: StoredVehicle[]) => {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(vehicles));
};

const readDeletedIds = (): string[] => {
  const raw = localStorage.getItem(DELETED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as string[];
  } catch {
    return [];
  }
};

const writeDeletedIds = (ids: string[]) => {
  localStorage.setItem(DELETED_KEY, JSON.stringify(ids));
};

const formatDate = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};

const createId = () => `vehicle-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const removeDeletedId = (id: string) => {
  const ids = readDeletedIds();
  if (!ids.includes(id)) return;
  writeDeletedIds(ids.filter((entry) => entry !== id));
};

export const getStoredVehicles = () => readStoredVehicles();

export const getStoredVehiclesByCategory = (category: VehicleCategory) =>
  readStoredVehicles().filter((vehicle) => vehicle.category === category);

export const mergeVehicles = (baseVehicles: StoredVehicle[], storedVehicles: StoredVehicle[] = []) => {
  const deletedIds = new Set(readDeletedIds());
  const overrides = readOverrides();
  const overrideMap = new Map(overrides.map((vehicle) => [vehicle.id, vehicle]));

  const mergedBase = baseVehicles
    .filter((vehicle) => !deletedIds.has(vehicle.id))
    .map((vehicle) => overrideMap.get(vehicle.id) ?? vehicle);

  return [...storedVehicles, ...mergedBase];
};

export const addStoredVehicle = (
  category: VehicleCategory,
  data: Omit<StoredVehicle, 'id' | 'category' | 'addedDate'>
) => {
  const vehicles = readStoredVehicles();
  const entry: StoredVehicle = {
    id: createId(),
    category,
    plateNumber: data.plateNumber,
    region: data.region,
    country: data.country,
    owner: data.owner,
    notes: data.notes,
    addedDate: formatDate(new Date())
  };
  vehicles.unshift(entry);
  writeStoredVehicles(vehicles);
  return entry;
};

export const updateVehicleById = (updated: StoredVehicle) => {
  const stored = readStoredVehicles();
  const storedIndex = stored.findIndex((vehicle) => vehicle.id === updated.id);
  if (storedIndex >= 0) {
    stored[storedIndex] = { ...stored[storedIndex], ...updated };
    writeStoredVehicles(stored);
    return stored[storedIndex];
  }

  const overrides = readOverrides();
  const overrideIndex = overrides.findIndex((vehicle) => vehicle.id === updated.id);
  if (overrideIndex >= 0) {
    overrides[overrideIndex] = { ...overrides[overrideIndex], ...updated };
  } else {
    overrides.push(updated);
  }
  writeOverrides(overrides);
  removeDeletedId(updated.id);
  return updated;
};

export const deleteVehicleById = (id: string) => {
  const stored = readStoredVehicles();
  const storedIndex = stored.findIndex((vehicle) => vehicle.id === id);
  if (storedIndex >= 0) {
    stored.splice(storedIndex, 1);
    writeStoredVehicles(stored);
    return;
  }

  const overrides = readOverrides().filter((vehicle) => vehicle.id !== id);
  writeOverrides(overrides);

  const deletedIds = new Set(readDeletedIds());
  deletedIds.add(id);
  writeDeletedIds(Array.from(deletedIds));
};
