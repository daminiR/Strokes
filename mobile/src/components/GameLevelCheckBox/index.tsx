import styles from '../../assets/styles';
import React, { useRef, useEffect, createContext,useContext, useState, ReactElement } from 'react'
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
import { useImperativeHandle, forwardRef } from 'react'

const GameLevelCheckBox = (props, ref) => {
useImperativeHandle(ref, () => ({
  _onPressDoneGame: () => {_onDoneGameLevel()}
}))
const {setValues, setFieldValue, values: filterValues} = useFormikContext<FilterFields>();
const [gameLevel1, setGameLevel1] = useState(filterValues.gameLevels.gameLevel1);
const [gameLevel2, setGameLevel2] = useState(filterValues.gameLevels.gameLevel2);
const [gameLevel0, setGameLevel0] = useState(filterValues.gameLevels.gameLevel0);
const [filterSport, setFilterSport] = useState(null);
useEffect(() => {
  const filterSport = _.find(filterValues.sportFilters, (filterSportObj) => {
    return filterSportObj.filterSelected == true;
  })?.sport
  if (filterSport){
    setFilterSport(filterSport);
  }
}, [filterValues.sportFilters]);

const _onPressGameLevel = (gameLevel) => {
  switch (gameLevel){
    case 0:
      setGameLevel0((c) => !c)
      break
    case 1:
      setGameLevel1((c) => !c)
      break
    case 2:
      setGameLevel2((c) => !c)
      break
  }
}

const _onDoneGameLevel = () => {
  console.log("onDone")
  setValues({... filterValues, 'gameLevels' :{
    gameLevel0: true,
    gameLevel1: gameLevel1,
    gameLevel2: gameLevel2,
  }});
  console.log( "game", filterValues)
  console.log("0, 1, 2 here", gameLevel0, gameLevel1, gameLevel2)

  //setValues({
    //...filterValues,
    //gameLevels: {gameLevel0: gameLevel0, gameLevel1: gameLevel1, gameLevel2: gameLevel2},
  //});
}

return (
  // TODO:set the sports car filters, age, and game level thats all for now
  <>
    <View style={{marginTop: 20}}>
    <Text style={styles.filtersText}>
      Filter level for:{filterSport}
    </Text>
    <CheckBox
      title="Beginner"
      checked={gameLevel0}
      onPress={() => _onPressGameLevel(0)}
    />
    <CheckBox
      title="Intermediate"
      checked={gameLevel1}
      onPress={() => _onPressGameLevel(1)}
    />
    <CheckBox
      title="Advanced"
      checked={gameLevel2}
      onPress={() => _onPressGameLevel(2)}
    />
    </View>
  </>
);
};
export default forwardRef(GameLevelCheckBox)
