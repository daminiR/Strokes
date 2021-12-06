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
export {createInitialFilterFormik}
