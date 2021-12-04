import styles from '../../assets/styles';
import React, { useRef, useEffect, createContext,useContext, useState, ReactElement } from 'react'
import {Text } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { defaultAgeRange } from '../../constants'
import _ from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFormikContext, Formik} from 'formik';
import {FilterFields} from '../../localModels/UserSportsList'
import { useImperativeHandle, forwardRef } from 'react'
import {_retriveAgeRangeFilter} from '../../utils/AsyncStorage/retriveData'
import {_storeAgeRangeFilter} from '../../utils/AsyncStorage/storeData'



const AgeSliderFilter = (props, ref) => {
useImperativeHandle(ref, () => ({
  _onPressDoneAgeSlide: () => {_onDoneAgeSlide()}
}))
  const {setValues, values: filterValues } = useFormikContext<FilterFields>();
  const [multiSliderValue, setMultiSliderValue] = useState(defaultAgeRange);
  useEffect(() => {
    _retriveAgeRangeFilter(setMultiSliderValue)
  }, []);
const _onDoneAgeSlide = () => {
    setValues({... filterValues, 'ageRange': multiSliderValue});
    _storeAgeRangeFilter(multiSliderValue)
}
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
    <>
      <Text>
        Age between {multiSliderValue.minAge} and {multiSliderValue.maxAge}
      </Text>
      <MultiSlider
        values={[multiSliderValue.minAge, multiSliderValue.maxAge]}
        onValuesChange={(values) => setMultiSliderValue({minAge: values[0], maxAge: values[1]})}
        min={defaultAgeRange.minAge}
        max={defaultAgeRange.maxAge}
        step={1}
        allowOverlap
        snapped
      />
    </>
  );
};
export default forwardRef(AgeSliderFilter)
