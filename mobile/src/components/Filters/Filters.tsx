import styles from '../../assets/styles';
import React, { useEffect, createContext,useContext, useState, ReactElement } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import  { Icon } from '../Icon/Icon';
import {CheckBox, Overlay} from 'react-native-elements'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { defaultAgeRange } from '../../constants'
import {UserContext} from '../../UserContext'
import { Cancel, Done, FilterSportsChips } from '../../components'
import _ from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFormikContext, Formik} from 'formik';
import {FilterFields} from '../../localModels/UserSportsList'


const GameLevelCheckBox = () => {
const [gameLevel1, setGameLevel1] = useState(false);
const [gameLevel2, setGameLevel2] = useState(false);
const [gameLevel3, setGameLevel3] = useState(false);
const [filterSport, setFilterSport] = useState(null);
const {setValues, values: filterValues} = useFormikContext<FilterFields>();
useEffect(() => {

  const filterSport = _.find(filterValues.sportFilters, (filterSportObj) => {
    return filterSportObj.filterSelected == true;
  })?.sport
  console.log("this is game level", filterSport)
  if (filterSport){
    setFilterSport(filterSport);
  }
  //setFilterSport(filterSport.sport)
}, [filterValues]);

return (
  // TODO:set the sports car filters, age, and game level thats all for now
  <>
    <View style={{marginTop: 20}}>
    <Text style={styles.filtersText}>
      Filter level for:{filterSport}
    </Text>
    <CheckBox
      title="Beginner"
      checked={gameLevel1}
      onPress={() => setGameLevel1((c) => !c)}
    />
    <CheckBox
      title="Intermediate"
      checked={gameLevel2}
      onPress={() => setGameLevel2((c) => !c)}
    />
    <CheckBox
      title="Advanced"
      checked={gameLevel3}
      onPress={() => setGameLevel3((c) => !c)}
    />
    </View>
  </>
);
};
const AgeSlider = ({currentAgeRange = defaultAgeRange}) => {
  const {setValues, values: filterValues } = useFormikContext<FilterFields>();
  const [multiSliderValue, setMultiSliderValue] = useState(currentAgeRange);
  const _storeData = async (ageRange) => {
    try {
      await AsyncStorage.setItem('AGE_FILTER_RANGE', ageRange);
    } catch (error) {
      console.log(error);
    }
  };
  const _retriveData = async () => {
    try {
      const ageRange = await AsyncStorage.getItem('AGE_FILTER_RANGE');
      if (ageRange !== null) {
        console.log("age", ageRange);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // local storage useEffect hook pair
  useEffect(() => {
    _retriveData()
  }, []);
  //useEffect(() => {
    //_storeData
  //}, []);

  const _onAgeSlide = (values) => {
    console.log(values)
    setValues({... filterValues, 'ageRange': {minAge: values[0], maxAge: values[1]}});
  }
  //const multiSliderValuesChange = (values) =>
    //setMultiSliderValue({minAge: values[0], maxAge: values[1]});
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
    <>
      <Text>
        Age between {filterValues.ageRange.minAge} and {filterValues.ageRange.maxAge}
      </Text>
      <MultiSlider
        values={[filterValues.ageRange.minAge, filterValues.ageRange.maxAge]}
        //sliderLength={250}
        onValuesChange={_onAgeSlide}
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
  // TODO : this needs to update every time user changes list of activities
  const {aloading, currentUser, data: currentUserData, userLoading} = useContext(UserContext)
  const [loadingSports, setLoadingSports] = useState(true)
  const [sportsList, setSportsList] = useState(null)
  const [selectedSport, setSelectedSport] = useState(null)
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
      <View style={styles.top}>
        <Cancel />
        <Done />
      </View>
      <View style={styles.filterOverlay}>
        <AgeSlider/>
        <View style={styles.sportChipSet}>
          {!loadingSports && (
            <FilterSportsChips
              sportsList={sportsList}
              selectedSport={sportsList[0]}
            />
          )}
        </View>
        <GameLevelCheckBox />
      </View>
    </Overlay>
  );
  }

  return (
      renderFilter()
  );
};

const Filters = () => {
  const {values: filterValues } = useFormikContext();
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
