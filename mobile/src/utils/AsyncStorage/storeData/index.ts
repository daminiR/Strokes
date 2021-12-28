import AsyncStorage from '@react-native-async-storage/async-storage'

const _storeAgeRangeFilter = async (ageRange) => {
    try {
      await AsyncStorage.setItem('AGE_FILTER_RANGE', JSON.stringify(ageRange));
    } catch (error) {
      console.log(error);
    }
  };
const _storeSportFilter = async (sportFilter) => {
    try {
      await AsyncStorage.setItem('SPORT_FILTER', JSON.stringify(sportFilter));
    } catch (error) {
      console.log(error);
    }
  };
const _storeGameLevelFilter = async (gameLevelFilter) => {
    try {
      await AsyncStorage.setItem('GAME_LEVEL_FILTER', JSON.stringify(gameLevelFilter));
    } catch (error) {
      console.log(error);
    }
  };
export { _storeGameLevelFilter, _storeAgeRangeFilter, _storeSportFilter}
