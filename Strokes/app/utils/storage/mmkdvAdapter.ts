import { MMKV } from 'react-native-mmkv';
import { AsyncStorageStatic } from '@react-native-async-storage/async-storage'; // This import is just for type referencing

export const MMKVAdapter: AsyncStorageStatic = {
  getItem: (key: string) => {
    const value = MMKV.getString(key);
    return Promise.resolve(value ?? null);
  },
  setItem: (key: string, value: string) => {
    MMKV.set(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    MMKV.delete(key);
    return Promise.resolve();
  },
  clear: () => {
    MMKV.clearAll();
    return Promise.resolve();
  },
  getAllKeys: () => {
    const keys = MMKV.getAllKeys();
    return Promise.resolve(keys);
  },
  multiGet: (keys: string[]) => {
    const results = keys.map(key => [key, MMKV.getString(key) ?? null]);
    return Promise.resolve(results);
  },
  multiSet: (keyValuePairs: [string, string][]) => {
    keyValuePairs.forEach(([key, value]) => {
      MMKV.set(key, value);
    });
    return Promise.resolve();
  },
  multiRemove: (keys: string[]) => {
    keys.forEach(key => {
      MMKV.delete(key);
    });
    return Promise.resolve();
  },
  // Add other required methods by AsyncStorageStatic interface if needed
};
