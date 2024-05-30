// storageUtils.js
import storage from './mmkvStorage';

export async function loadString(key: string): Promise<string | null> {
  try {
    const value = storage.getString(key);
    return value !== undefined ? value : null;
  } catch {
    return null;
  }
}

export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    storage.set(key, value);
    return true;
  } catch {
    return false;
  }
}

export async function load(key: string): Promise<unknown | null> {
  try {
    const jsonString = storage.getString(key);
    return jsonString ? JSON.parse(jsonString) : null;
  } catch {
    return null;
  }
}

export async function save(key: string, value: unknown): Promise<boolean> {
  try {
    storage.set(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export async function remove(key: string): Promise<void> {
  try {
    storage.delete(key);
  } catch {}
}

export async function clear(): Promise<void> {
  try {
    storage.clearAll();
  } catch {}
}

