import styles from '../../assets/styles';
import React, { useRef, useEffect, createContext,useContext, useState, ReactElement } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import  { Icon } from '../Icon/Icon';
import {CheckBox, Overlay} from 'react-native-elements'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { defaultAgeRange } from '../../constants'
import {UserContext} from '../../UserContext'
import { Cancel, Done, FilterSportsChips} from '../../components'
import _ from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFormikContext, Formik} from 'formik';
import {FilterFields} from '../../localModels/UserSportsList'
import { useImperativeHandle, forwardRef } from 'react'
import GameLevelCheckBox from '../../components/GameLevelCheckBox'
import AgeSliderFilter from '../../components/AgeSliderFilter'
import {FilterOverlay} from '../../components/FilterOverLay'
import {FilterOverlaySingle} from '../../components/FilterOverlaySingle'


const Filters = ({getFilterValue}) => {
  const [filter, setFilter] = useState(false);
  const _onFilter = () => {
    setFilter(true);
  };

  useEffect(() => {
    getFilterValue(filter)
  }, [filter]);

  return (
    <>
      <FilterOverlaySingle filter={filter} setFilter={setFilter} />
      <TouchableOpacity onPress={() => _onFilter()}style={styles.filters}>
        <Text style={styles.filtersText}>
          <Icon name="filter" /> Filters
        </Text>
      </TouchableOpacity>
    </>
  );
};

export {Filters}
