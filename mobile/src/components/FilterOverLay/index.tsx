import styles from '../../assets/styles';
import React, { useRef, useEffect,useContext, useState } from 'react'
import { View} from 'react-native';
import {Overlay} from 'react-native-elements'
import {UserContext} from '../../UserContext'
import { Cancel, Done, } from '../../components'
import FilterSportsChips from '../../components/FilterSportsChips'
import _ from 'lodash'
import {FilterFields} from '../../localModels/UserSportsList'
import GameLevelCheckBox from '../../components/GameLevelCheckBox'
import AgeSliderFilter from '../../components/AgeSliderFilter'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter} from '../../utils/AsyncStorage/retriveData'
import {defaultAgeRange, defaultGameLevel} from '../../constants'
import { useFormikContext, Formik, ErrorMessage} from 'formik'
import {FilterSchema} from '../../validationSchemas/FilterSchema'
import {createInitialFilterFormik} from '../../utils/formik/index'

  //// TODO : this needs to update every time user changes list of activities
const FilterOverlay = ({filter, setFilter}) => {
  //const {setValues, values: filterValues } = useFormikContext<FilterFields>();
  const gameLevelRef = useRef()
  const ageSliderRef = useRef()
  const sportFilterRef = useRef()
  const {aloading, currentUser, data: currentUserData, userLoading} = useContext(UserContext)
  const [loadingSports, setLoadingSports] = useState(true)
  const [sportsList, setSportsList] = useState(null)
  const [selectedSport, setSelectedSport] = useState(null)

  //useEffect(() => {
    //createInitialFilterFormik(
      //currentUserData.squash.sports,
    //).then((initialValues) => {
      //setInitialValuesFormik(initialValues);
    //})
    //.catch (error => {
      //console.log(error);
    //})
  //}, [filter])

  useEffect(() => {
    if(currentUserData){
        setLoadingSports(true);
        const sports = _.map(currentUserData.squash.sports, (sportObj) => {return sportObj.sport});
        setSportsList(sports);
        setLoadingSports(false);
    }
  }, [userLoading]);

  const _onDoneGame = () => {
    if (gameLevelRef.current){
      gameLevelRef.current._onPressDoneGame();
    }
  }
  const _onDoneAge = () => {
    if (ageSliderRef.current){
      ageSliderRef.current._onPressDoneAgeSlide();
    }
  }
  const _onDoneSport = () => {
    if ( sportFilterRef.current){
      sportFilterRef.current._onPressDoneSportFilter();
    }
  }
  const _onCancel = () => {
    setFilter(false)
  };
  const _onDone = () => {
      _onDoneAge()
      _onDoneGame()
      _onDoneSport()
      setFilter(false)
  };
  const renderFilter = () => {
  return (
    // TODO:set the sports car filters, age, and game level thats all for now
    <Overlay isVisible={filter}>
      <View>
        <View style={styles.top}>
          <Cancel _onPressCancel={_onCancel} />
          <Done _onPressDone={_onDone} />
        </View>
        <View style={styles.filterOverlay}>
          <AgeSliderFilter ref={ageSliderRef} />
          <View style={styles.sportChipSet}>
            {!loadingSports && (
              <FilterSportsChips ref={sportFilterRef} sportsList={sportsList} />
            )}
          </View>
          <GameLevelCheckBox ref={gameLevelRef} />
        </View>
      </View>
    </Overlay>
  );
  }

  return (
      renderFilter()
  );
};

export {FilterOverlay}
