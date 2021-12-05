import styles from '../../assets/styles';
import React, { useEffect, createContext,useContext, useState, ReactElement } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import {CheckBox} from 'react-native-elements'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { defaultAgeRange } from '../../constants'
import {UserContext} from '../../UserContext'
import { Cancel, Done, FilterSportsChips } from '../../components'
import _ from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFormikContext, Formik} from 'formik';
import {FilterFields} from '../../localModels/UserSportsList'
import { useImperativeHandle, forwardRef } from 'react'
import {_storeGameLevelFilter} from '../../utils/AsyncStorage/storeData'

const GameLevelCheckBox =  (props, ref) => {
useImperativeHandle(ref, () => ({
  _onPressDoneGame: () => {_onDoneGameLevel()}
}))
const {setValues, setFieldValue, values: filterValues} = useFormikContext<FilterFields>();
const [gameLevel1, setGameLevel1] = useState(false);
const [gameLevel2, setGameLevel2] = useState(false);
const [gameLevel0, setGameLevel0] = useState(false);
const [filterSport, setFilterSport] = useState(null);

useEffect(() => {
  console.log("game level valeus", filterValues.gameLevels)
      setGameLevel0(filterValues.gameLevels.gameLevel0)
      setGameLevel1(filterValues.gameLevels.gameLevel1)
      setGameLevel2(filterValues.gameLevels.gameLevel2)
  }, [filterValues]);

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
  const gameLevel = {
    gameLevel0: gameLevel0,
    gameLevel1: gameLevel1,
    gameLevel2: gameLevel2,
  }
  //setFieldValue('gameLevels', gameLevel);
  const newValues = {
    gameLevels: gameLevel,
    ageRange: filterValues.ageRange,
    sportFilters: filterValues.sportFilters
  }
    //setValues({... filterValues, 'ageRange': multiSliderValue});
    setValues(prevValues => ({
      ...prevValues,
      ...newValues
    }));
  _storeGameLevelFilter(gameLevel)
  //validate(filterValues)
}

return (
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
