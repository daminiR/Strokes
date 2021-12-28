import React, {useEffect, useState } from 'react'
import {Text, View} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { defaultAgeRange } from '@constants'
import _ from 'lodash'
import { useFormikContext} from 'formik';
import {FilterFields} from '@localModels'
import { useImperativeHandle, forwardRef } from 'react'
import {_storeAgeRangeFilter} from '@localStore'

const AgeSliderFilter = (props, ref) => {
useImperativeHandle(ref, () => ({
  _onPressDoneAgeSlide: () => {_onDoneAgeSlide()}
}))
  const {setFieldValue, setValues, values: filterValues } = useFormikContext<FilterFields>();
  const [multiSliderValue, setMultiSliderValue] = useState(defaultAgeRange);
  const [loadingAgeRange, setLoadingAgeRange] = useState(true);
  useEffect(() => {
    setLoadingAgeRange(true)
    setMultiSliderValue(filterValues.ageRange)
    setLoadingAgeRange(false)
  }, []);
const _onDoneAgeSlide = () => {
    _storeAgeRangeFilter(multiSliderValue)
}
const _onAgeChanged = () => {
    setValues({... filterValues, 'ageRange': multiSliderValue});
}
  return (
    <>
      {!loadingAgeRange && (
        <View>
          <Text>
            Age between {multiSliderValue.minAge} and {multiSliderValue.maxAge}
          </Text>
          <MultiSlider
            values={[multiSliderValue.minAge, multiSliderValue.maxAge]}
            onValuesChange={(values) =>
              setMultiSliderValue({minAge: values[0], maxAge: values[1]})
            }
            onValuesChangeFinish={() => _onAgeChanged()}
            min={defaultAgeRange.minAge}
            max={defaultAgeRange.maxAge}
            step={1}
            allowOverlap
            snapped
          />
        </View>
      )}
    </>
  );
};
export default forwardRef(AgeSliderFilter)
