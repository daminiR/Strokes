import { AsyncStorageStatic } from '@react-native-async-storage/async-storage'; // This import is just for type referencing
import storage from './mmkvStorage';

export const MMKVAdapter: AsyncStorageStatic = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
  clear: () => {
    storage.clearAll();
    return Promise.resolve();
  },
  getAllKeys: () => {
    const keys = storage.getAllKeys();
    return Promise.resolve(keys);
  },
  multiGet: (keys: string[]) => {
    const results = keys.map(key => [key, storage.getString(key) ?? null]);
    return Promise.resolve(results);
  },
  multiSet: (keyValuePairs: [string, string][]) => {
    keyValuePairs.forEach(([key, value]) => {
      storage.set(key, value);
    });
    return Promise.resolve();
  },
  multiRemove: (keys: string[]) => {
    keys.forEach(key => {
      storage.delete(key);
    });
    return Promise.resolve();
  },
  // Add other required methods by AsyncStorageStatic interface if needed
};
