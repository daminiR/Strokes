import styles, {SECONDARY_THEME} from '../../assets/styles';
import React, {useState} from 'react';
import {Text, TouchableOpacity } from 'react-native';
import {Icon } from 'react-native-elements';
import _ from 'lodash'
import {FilterOverlaySingle} from '../../components/FilterOverlaySingle'


const Filters = () => {
  const [filter, setFilter] = useState(false);
  const _onFilter = () => {
    setFilter(true);
  };

        //<Text style={styles.filtersText}>Filters
        //</Text>
  return (
    <>
      <FilterOverlaySingle filter={filter} setFilter={setFilter} />
      <TouchableOpacity onPress={() => _onFilter()}style={styles.filters}>
        <Icon name="filter-alt" type="material" color={SECONDARY_THEME} size={38}/>
      </TouchableOpacity>
    </>
  );
};

export {Filters}
