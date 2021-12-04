import AsyncStorage from '@react-native-async-storage/async-storage'

const _retriveAgeRangeFilter = async (setMultiSliderValue) => {
    try {
      const ageRange = await AsyncStorage.getItem('AGE_FILTER_RANGE');
      if (ageRange !== null) {
        setMultiSliderValue(JSON.parse(ageRange))
      }
    } catch (error) {
      console.log(error);
    }
  };

export { _retriveAgeRangeFilter}
