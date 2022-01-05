import _ from 'lodash'
import {_retriveGameLevel,_storeSportFilter, _retriveAgeRangeFilter, _retriveSportFilter} from '@localStore'
import {defaultAgeRange, defaultGameLevel} from '@constants'
import {SportFilters} from '@localModels'

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

  console.log(sportFilter)
  console.log(sports)
  // cached values is not in current sports remove it and chosse any one in the sports filer
  var defailtSportFilter  = null
  if (!_.includes(sports, sportFilter.sport)) {

   defailtSportFilter = _.map(sports, (sportObj, key) => {
     if (key == '0') {
      const new_cached = {sport: sportObj.sport, filterSelected: true} as SportFilters;
      _storeSportFilter(new_cached)
      return new_cached
     } else {
       return {sport: sportObj.sport, filterSelected: false} as SportFilters;
     }
   })
  }
  else{
    defailtSportFilter = _.map(sports, (sportObj, key) => {
      console.log(sportObj);
      if (sportFilter) {
        // is sport filter exists and in sports filter
        if (sportObj.sport == sportFilter.sport) {
          return sportFilter as SportFilters;
        } else {
          return {sport: sportObj.sport, filterSelected: false} as SportFilters;
        }
        // is sport filter exists but filter values are changed in profile
      } else {
        if (key == '0') {
          return {sport: sportObj.sport, filterSelected: true} as SportFilters;
        } else {
          return {sport: sportObj.sport, filterSelected: false} as SportFilters;
        }
      }
    });
  }
  return {
    ageRange: ageRange ? ageRange : defaultAgeRange,
    sportFilters: defailtSportFilter,
    gameLevels: gameLevelFilter ? gameLevelFilter :defaultGameLevel,
  };
};
export {createInitialValuesFormik, createInitialFilterFormik}
