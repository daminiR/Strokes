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

const FilterOverlay = ({filter, setFilter}) => {
  // TODO : this needs to update every time user changes list of activities
  const {setValues, values: filterValues } = useFormikContext<FilterFields>();
  const gameLevelRef = useRef()
  const ageSliderRef = useRef()
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

  const _onDone = () => {
    if (gameLevelRef.current){
      gameLevelRef.current._onPressDoneGame();
    }
    if (ageSliderRef.current){
      ageSliderRef.current._onPressDoneAgeSlide();
    }
    console.log( "why is this printing after", filterValues)
  };
  const renderFilter = () => {
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
    <Overlay isVisible={filter} onBackdropPress={() => setFilter(!filter)}>
      <View style={styles.top}>
        <Cancel/>
        <Done _onPressDone={_onDone}/>
      </View>
      <View style={styles.filterOverlay}>
        <AgeSliderFilter ref={ageSliderRef}/>
        <View style={styles.sportChipSet}>
          {!loadingSports && (
            <FilterSportsChips
              sportsList={sportsList}
            />
          )}
        </View>
        <GameLevelCheckBox ref={gameLevelRef}/>
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
