import Reactotron from 'reactotron-react-native';
import { MMKV } from 'react-native-mmkv';

// Custom AsyncStorage Handler for MMKV to work with Reactotron
const MMKVStorageHandler = {
  setItem: (key, value) => MMKV.set(key, value),
  getItem: (key) => Promise.resolve(MMKV.getString(key)),
  removeItem: (key) => {
    MMKV.delete(key);
    return Promise.resolve();
  }
};

Reactotron.setAsyncStorageHandler(MMKVStorageHandler)
  .configure({ host: '192.168.1.16' }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

