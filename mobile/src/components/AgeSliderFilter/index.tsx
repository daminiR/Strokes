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

const AgeSliderFilter = (props, ref) => {
useImperativeHandle(ref, () => ({
  _onPressDoneAgeSlide: () => {_onDoneAgeSlide()}
}))
  const {setValues, values: filterValues } = useFormikContext<FilterFields>();
  const [multiSliderValue, setMultiSliderValue] = useState(defaultAgeRange);
  //const _storeData = async (ageRange) => {
    //try {
      //await AsyncStorage.setItem('AGE_FILTER_RANGE', ageRange);
    //} catch (error) {
      //console.log(error);
    //}
  //};
  //const _retriveData = async () => {
    //try {
      //const ageRange = await AsyncStorage.getItem('AGE_FILTER_RANGE');
      //if (ageRange !== null) {
        //console.log("age", ageRange);
      //}
    //} catch (error) {
      //console.log(error);
    //}
  //};
  //useEffect(() => {
    //_retriveData()
  //}, []);
const _onDoneAgeSlide = () => {
    setValues({... filterValues, 'ageRange': multiSliderValue});
}
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
    <>
      <Text>
        Age between {filterValues.ageRange.minAge} and {filterValues.ageRange.maxAge}
      </Text>
      <MultiSlider
        values={[filterValues.ageRange.minAge, filterValues.ageRange.maxAge]}
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
