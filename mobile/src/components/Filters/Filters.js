import styles from '../../assets/styles';
import React, { useEffect, useContext, useState, ReactElement } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import  { Icon } from '../Icon/Icon';
import {Overlay} from 'react-native-elements'

const FilterOverlay = ({filter, setFilter}) => {
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
      <Overlay isVisible={filter} onBackdropPress={() => setFilter(!filter)}>
        <View style={styles.filterOverlay}>
        <Text>Matched!</Text>
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
