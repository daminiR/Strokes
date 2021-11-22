import styles from '../../assets/styles';
import React, { useEffect, createContext,useContext, useState, ReactElement } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import  { Icon } from '../Icon/Icon';
import {Overlay} from 'react-native-elements'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { defaultAgeRange } from '../../constants'
import {UserContext} from '../../UserContext'
import { FilterSportsChips } from '../../components'
import _ from 'lodash'

const AgeSlider = ({currentAgeRange = defaultAgeRange}) => {
const [multiSliderValue, setMultiSliderValue] = useState(currentAgeRange);
  const multiSliderValuesChange = values => setMultiSliderValue(values);
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
    <>
          <Text>Age between {multiSliderValue.minAge} and {multiSliderValue.maxAge}</Text>
          <MultiSlider
          values={[multiSliderValue.minAge, multiSliderValue.maxAge]}
          //sliderLength={250}
          onValuesChange={multiSliderValuesChange}
          min={defaultAgeRange.minAge}
          max={defaultAgeRange.maxAge}
          step={1}
          allowOverlap
          snapped
          //customLabel={CustomLabel}
          />
    </>
  );
};


const FilterOverlay = ({filter, setFilter}) => {
  const {aloading, currentUser, data: currentUserData, userLoading} = useContext(UserContext)
  const [loadingSports, setLoadingSports] = React.useState(true)
  const [sportsList, setSportsList] = React.useState(null)
  useEffect(() => {
    if(currentUserData){
        setLoadingSports(true);
        const sports = _.map(currentUserData.squash.sports, (sportObj) => {return sportObj.sport});
        setSportsList(sports);
        setLoadingSports(false);
    }
  }, [userLoading]);
  const renderFilter = () => {
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
    <Overlay isVisible={filter} onBackdropPress={() => setFilter(!filter)}>
      <View style={styles.filterOverlay}>
        <AgeSlider />
        <View style={styles.sportChipSet}>
            {!loadingSports && (
              <FilterSportsChips
                sportsList={sportsList}
                selectedSport={sportsList[0]}
              />
            )}
        </View>
      </View>
    </Overlay>
  );
  }

  return (
      renderFilter()
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
