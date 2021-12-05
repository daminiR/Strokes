import AsyncStorage from '@react-native-async-storage/async-storage'

const _retriveAgeRangeFilter = async () => {
    try {
      const ageRange = await AsyncStorage.getItem('AGE_FILTER_RANGE');
      if (ageRange !== null) {
        return JSON.parse(ageRange)
        //setMultiSliderValue(JSON.parse(ageRange))
      }
    } catch (error) {
      console.log(error);
    }
  };

const _retriveSportFilter = async () => {
    try {
      const sportFilter = await AsyncStorage.getItem('SPORT_FILTER');
      if (sportFilter !== null) {
        return JSON.parse(sportFilter)
      }
    } catch (error) {
      console.log(error);
    }
  };
const _retriveGameLevel = async () => {
    try {
      const gameLevelFilter = await AsyncStorage.getItem('GAME_LEVEL_FILTER');
      if (gameLevelFilter !== null) {
        return JSON.parse(gameLevelFilter)
      }
    } catch (error) {
      console.log(error);
    }
  };
export { _retriveAgeRangeFilter, _retriveSportFilter, _retriveGameLevel}
