export type Stored<T> = {
  version: 1;
  updatedAt: number;
  data: T;
};

export function loadFromStorage<T>(key: string): Stored<T> | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Stored<T>;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(key: string, data: T): Stored<T> {
  const stored: Stored<T> = { version: 1, updatedAt: Date.now(), data };
  window.localStorage.setItem(key, JSON.stringify(stored));
  return stored;
}

