import _ from 'lodash'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter} from '@localStore'
import {defaultAgeRange, defaultGameLevel} from '@constants'

const createInitialValuesFormik = (userData, phoneNumber, email) => {
    if (userData){
      const formik_images = userData.squash.image_set.map((imageObj) => ({
      img_idx: imageObj.img_idx,
      imageURL: imageObj.imageURL,
      filePath: imageObj.filePath,
    }));
      const formik_sports = userData.squash.sports.map((sportObj) => ({
        sport: sportObj.sport,
        game_level: sportObj.game_level,
      }));
      const formik_location =  {
        city: userData.squash.location.city,
        state: userData.squash.location.state,
        country: userData.squash.location.country,
      }
      return {
        email: email,
        phoneNumber: phoneNumber,
        first_name: userData.squash.first_name,
        last_name: userData.squash.last_name,
        age: userData.squash.age,
        gender: userData.squash.gender,
        image_set: formik_images,
        sports: formik_sports,
        location: formik_location,
        description: userData.squash.description,
        remove_uploaded_images: [],
        add_local_images: [],
        original_uploaded_image_set: formik_images
      }
    }
}
const createInitialFilterFormik = async (sports) => {
  const ageRange = await _retriveAgeRangeFilter()
  const sportFilter = await _retriveSportFilter()
  const gameLevelFilter = await _retriveGameLevel()

  console.log("cached", sportFilter)
  const defailtSportFilter = _.map(sports, (sportObj, key) => {
    if (sportFilter){
    if (sportObj.sport == sportFilter.sport) {
      return sportFilter;
    } else {
      return {sport: sportObj.sport, filterSelected: false};
    }
    }
    else{
    if (key == '0') {
      return {sport: sportObj.sport, filterSelected: true};
    } else {
      return {sport: sportObj.sport, filterSelected: false};
    }
    }
  })

  return {
    ageRange: ageRange ? ageRange : defaultAgeRange,
    sportFilters: defailtSportFilter,
    gameLevels: gameLevelFilter ? gameLevelFilter :defaultGameLevel,
  };
};
export {createInitialValuesFormik, createInitialFilterFormik}
