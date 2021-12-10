import styles from '../../assets/styles';
import React, {useState} from 'react';
import {Text, TouchableOpacity } from 'react-native';
import  { Icon } from '../Icon/Icon';
import _ from 'lodash'
import {FilterOverlaySingle} from '../../components/FilterOverlaySingle'


const Filters = () => {
  const [filter, setFilter] = useState(false);
  const _onFilter = () => {
    setFilter(true);
  };

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
