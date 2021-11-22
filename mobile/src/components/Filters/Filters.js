import styles from '../../assets/styles';
import React, { useEffect, useContext, useState, ReactElement } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import  { Icon } from '../Icon/Icon';
import {Overlay} from 'react-native-elements'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import defautlAgeRange from '../../constants'

const AgeSlider = () => {
  const [multiSliderValue, setMultiSliderValue] = useState([3, 7]);
  multiSliderValuesChange = (values) => setMultiSliderValue(values);
  console.log('agerange', defautlAgeRange);
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
    <>
          <Text>Age between {multiSliderValue[0]} and {multiSliderValue[1]}</Text>
          <MultiSlider
          values={[multiSliderValue[0], multiSliderValue[1]]}
          //sliderLength={250}
          onValuesChange={multiSliderValuesChange}
          min={defautlAgeRange.minAge}
          max={defautlAgeRange.maxAge}
          step={1}
          allowOverlap
          snapped
          //customLabel={CustomLabel}
          />
    </>
  );
};


const FilterOverlay = ({filter, setFilter}) => {
const [multiSliderValue, setMultiSliderValue] = useState([3, 7]);
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
      <Overlay isVisible={filter} onBackdropPress={() => setFilter(!filter)}>
        <View style={styles.filterOverlay}>
          <AgeSlider/>
        </View>
      </Overlay>
  );
};

const Filters = () => {
  const [filter, setFilter] = useState(false);
  const _onFilter = () => {
    setFilter(true);
  };
  return (
    <>
      <FilterOverlay filter={filter} setFilter={setFilter} />
      <TouchableOpacity onPress={() => _onFilter()}style={styles.filters}>
        <Text style={styles.filtersText}>
          <Icon name="filter" /> Filters
        </Text>
      </TouchableOpacity>
    </>
  );
};

export {Filters}
