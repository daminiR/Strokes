import { MMKV } from 'react-native-mmkv';
import storage from 'app/utils/storage/mmkvStorage';
const ROOT_STATE_STORAGE_KEY = "root-v1";

export const removeStore = async () => {
  try {
    storage.delete(ROOT_STATE_STORAGE_KEY)
    console.log("Item removed")
  } catch (e) {
    console.error("Error removing item:", e)
  }
};
