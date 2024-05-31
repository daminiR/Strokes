import Reactotron from 'reactotron-react-native';
import storage from 'app/utils/storage/mmkvStorage';

// Custom AsyncStorage Handler for MMKV to work with Reactotron
const MMKVStorageHandler = {
  setItem: (key, value) => storage.set(key, value),
  getItem: (key) => Promise.resolve(storage.getString(key)),
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  }
};

Reactotron.setAsyncStorageHandler(MMKVStorageHandler)
  .configure({ host: '192.168.1.16' }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

