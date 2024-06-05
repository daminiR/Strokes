// ReactotronConfig.js
import Reactotron from 'reactotron-react-native';
import storage from './app/utils/storage/mmkvStorage';

// Initialize MMKV
//const storage = new MMKV();

// Custom AsyncStorage Handler for MMKV to work with Reactotron
const MMKVStorageHandler = {
  setItem: (key, value) => {
    try {
      storage.set(key, value);
    } catch (error) {
      console.error(`Error setting ${key} in MMKV: `, error);
    }
  },
  getItem: (key) => {
    try {
      const value = storage.getString(key);
      return Promise.resolve(value);
    } catch (error) {
      console.error(`Error getting ${key} from MMKV: `, error);
      return Promise.resolve(null);
    }
  },
  removeItem: (key) => {
    try {
      storage.delete(key);
      return Promise.resolve();
    } catch (error) {
      console.error(`Error removing ${key} from MMKV: `, error);
      return Promise.resolve();
    }
  }
};

