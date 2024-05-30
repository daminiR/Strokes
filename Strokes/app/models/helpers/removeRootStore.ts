import { MMKV } from 'react-native-mmkv';
const ROOT_STATE_STORAGE_KEY = "root-v1";

export const removeStore = async () => {
  try {
    await MMKV.delete(ROOT_STATE_STORAGE_KEY)
    console.log("Item removed")
  } catch (e) {
    console.error("Error removing item:", e)
  }
};
