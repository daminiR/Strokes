import AsyncStorage from '@react-native-async-storage/async-storage'

const _storeAgeRangeFilter = async (ageRange) => {
    try {
      await AsyncStorage.setItem('AGE_FILTER_RANGE', JSON.stringify(ageRange));
    } catch (error) {
      console.log(error);
    }
  };
export { _storeAgeRangeFilter}
