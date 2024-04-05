import AsyncStorage from '@react-native-async-storage/async-storage';
const ROOT_STATE_STORAGE_KEY = "root-v1";

export const removeStore = async () => {
  try {
    await AsyncStorage.removeItem(ROOT_STATE_STORAGE_KEY)
    console.log("Item removed")
  } catch (e) {
    console.error("Error removing item:", e)
  }
};
