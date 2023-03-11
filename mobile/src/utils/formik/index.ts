import _ from 'lodash'
import {_retriveGameLevel,_storeSportFilter, _retriveAgeRangeFilter, _retriveSportFilter} from '@localStore'
import {defaultAgeRange, defaultGameLevel} from '@constants'
import {SportFilters} from '@localModels'
import {filterSportChangedVar} from '@cache'

const createInitialValuesFormik = (dataGlobal) => {
    if (dataGlobal){
      const formik_images = dataGlobal.image_set.map((imageObj) => ({
      img_idx: imageObj.img_idx,
      imageURL: imageObj.imageURL,
      filePath: imageObj.filePath,
    }));
      const formik_sports = dataGlobal.sports.map((sportObj) => ({
        sport: sportObj.sport,
        game_level: sportObj.game_level,
      }));
      const formik_location =  {
        city: dataGlobal.location.city,
        state: dataGlobal.location.state,
        country: dataGlobal.location.country,
      }
      const new_formik = {
        email: dataGlobal.email,
        phoneNumber: dataGlobal.phoneNumber,
        first_name: dataGlobal.first_name,
        last_name: dataGlobal.last_name,
        age: dataGlobal.age,
        gender: dataGlobal.gender,
        image_set: formik_images,
        sports: formik_sports,
        location: formik_location,
        description: dataGlobal.description,
        remove_uploaded_images: [],
        add_local_images: [],
        original_uploaded_image_set: formik_images,
      };
      return new_formik
    }
}
import { isCityChangedVar, cityVar, EditInputVar} from '@cache'
const switchInputOnDone= (touched, formikValues, inputType, validationErrors, setFieldValue, setDisplayInput) => {
    switch (inputType) {
      case 'Name Input':
        if (_.isEmpty(validationErrors.first_name) && _.isEmpty(validationErrors.last_name)) {
          setFieldValue('first_name', formikValues.first_name);
          setFieldValue('last_name', formikValues.last_name);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
      case 'Birthday Input':
        if (_.isEmpty(validationErrors.age)) {
          setFieldValue('age', formikValues.age);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
      case 'Neighborhood Input':
        if (_.isEmpty(validationErrors.age) && touched.location) {
          setFieldValue('location', formikValues.location);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
      case 'Gender Input':
        if (_.isEmpty(validationErrors.age)) {
          setFieldValue('gender', formikValues.gender);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
      case 'Description Input':
        if (_.isEmpty(validationErrors.description)) {
          setFieldValue('description', formikValues.description);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
      case 'Sports Input':
        if (_.isEmpty(validationErrors.sports)) {
          setFieldValue('sports', formikValues.sports);
          EditInputVar({inputType: '', displayInput: false}) &&
          setDisplayInput(false);
        }
        break;
    }

}
const switchInputOnCancel = (formikInitialValues, setFieldValue, inputType, setDisplayInput) => {
    switch (inputType) {
      case 'Name Input':
        setFieldValue('first_name', formikInitialValues.first_name)
        setFieldValue('last_name', formikInitialValues.last_name)
        break;
      case 'Birthday Input':
        setFieldValue('age', formikInitialValues.age)
        break;
      case 'Neighborhood Input':
        setFieldValue('location', formikInitialValues.location)
        break;
      case 'Gender Input':
        setFieldValue('gender', formikInitialValues.gender)
        break;
      case 'Description Input':
        setFieldValue('description', formikInitialValues.description)
        break;
      case 'Sports Input':
        setFieldValue('sports', formikInitialValues.sports)
        break;
    }
    EditInputVar({inputType: '', displayInput: false})
    setDisplayInput(false);


}
const createInitialFilterFormik = async (sports) => {
  const ageRange = await _retriveAgeRangeFilter()
  const sportFilter = await _retriveSportFilter()
  const gameLevelFilter = await _retriveGameLevel()
  // cached values is not in current sports remove it and chosse any one in the sports filer
  const sportsList = _.map(sports, sportObj =>{return sportObj.sport})
  var defailtSportFilter  = null
  if (sportFilter && !_.includes(sportsList, sportFilter.sport)) {
   filterSportChangedVar(true)
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
    filterSportChangedVar(false)
    defailtSportFilter = _.map(sports, (sportObj, key) => {
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
export {switchInputOnCancel, switchInputOnDone, createInitialValuesFormik, createInitialFilterFormik}
