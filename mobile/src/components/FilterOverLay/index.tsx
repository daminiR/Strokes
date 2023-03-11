import {styles} from '@styles'
import React, { useRef, useEffect,useContext, useState } from 'react'
import { View} from 'react-native';
import {Overlay} from 'react-native-elements'
import {UserContext} from '@UserContext'
import {  Done, Cancel, FilterSportsChips} from '@components'
import _ from 'lodash'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter} from '@localStore'

  //// TODO : this needs to update every time user changes list of activities
const FilterOverlay = ({filter, setFilter}) => {
  //const {setValues, values: filterValues } = useFormikContext<FilterFields>();
  const gameLevelRef = useRef()
  const ageSliderRef = useRef()
  const sportFilterRef = useRef();
  const {
    aloading,
    currentUser,
    dataGlobal: currentUserData,
    userLoading,
  } = useContext(UserContext);
  const [loadingSports, setLoadingSports] = useState(true)
  const [sportsList, setSportsList] = useState(null)
  const [selectedSport, setSelectedSport] = useState(null)

  useEffect(() => {
    if(currentUserData){
        setLoadingSports(true);
        const sports = _.map(currentUserData.sports, (sportObj) => {return sportObj.sport});
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
