import styles from '../../assets/styles';
import React, { useRef, useEffect,useContext, useState } from 'react'
import { View} from 'react-native';
import {Overlay} from 'react-native-elements'
import {UserContext} from '../../UserContext'
import { Cancel, Done, } from '../../components'
import FilterSportsChips from '../../components/FilterSportsChips'
import _ from 'lodash'
import {FilterFields} from '../../localModels/UserSportsList'
import GameLevelCheckBox from '../../components/GameLevelCheckBox'
import AgeSliderFilter from '../../components/AgeSliderFilter'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter} from '../../utils/AsyncStorage/retriveData'
import {defaultAgeRange, defaultGameLevel} from '../../constants'
import { useFormikContext, Formik, ErrorMessage} from 'formik'

const createInitialValuesFormik = (userData) => {
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
  const defailtSportFilter = _.map(sports, (sportObj, key) => {
    if (key == '0') {
      return {sport: sportObj.sport, filterSelected: true};
    } else {
      return {sport: sportObj.sport, filterSelected: false};
    }
  })

  const ageRange = await _retriveAgeRangeFilter()
  const sportFilter = await _retriveSportFilter()
  const gameLevelFilter = await _retriveGameLevel()
  return {
    ageRange: ageRange ? ageRange : defaultAgeRange,
    sportFilters: sportFilter ? sportFilter: defailtSportFilter,
    gameLevels: gameLevelFilter ? gameLevelFilter :defaultGameLevel,
  };
};
export {createInitialValuesFormik, createInitialFilterFormik}
