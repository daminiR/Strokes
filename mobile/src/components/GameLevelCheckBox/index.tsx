import {styles} from '@styles'
import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native';
import {CheckBox} from 'react-native-elements'
import _ from 'lodash'
import { useFormikContext} from 'formik';
import {FilterFields} from '@localModels'
import { useImperativeHandle, forwardRef } from 'react'
import {_storeGameLevelFilter} from '@localStore'

const GameLevelCheckBox =  (props, ref) => {
  useImperativeHandle(ref, () => ({
    _onPressDoneGame: () => {
      _onDoneGameLevel();
    },
  }));
  const {
    setValues,
    values: filterValues,
  } = useFormikContext<FilterFields>();
  const [gameLevel1, setGameLevel1] = useState(false);
  const [gameLevel2, setGameLevel2] = useState(false);
  const [gameLevel0, setGameLevel0] = useState(false);
  const [filterSport] = useState(null);

  useEffect(() => {
    setGameLevel0(filterValues.gameLevels.gameLevel0);
    setGameLevel1(filterValues.gameLevels.gameLevel1);
    setGameLevel2(filterValues.gameLevels.gameLevel2);
  }, []);
  useEffect(() => {
    const gameLevelObj = {
      gameLevel0: gameLevel0,
      gameLevel1: gameLevel1,
      gameLevel2: gameLevel2,
    };
    setValues({...filterValues, gameLevels: gameLevelObj});
  }, [gameLevel0, gameLevel1, gameLevel2]);

  const _onPressGameLevel = (gameLevel) => {
    switch (gameLevel) {
      case 0:
        setGameLevel0(!gameLevel0);
        break;
      case 1:
        setGameLevel1(!gameLevel1);
        break;
      case 2:
        setGameLevel2(!gameLevel2);
        break;
    }
  };
  const _onDoneGameLevel = () => {
    const gameLevelObj = {
      gameLevel0: gameLevel0,
      gameLevel1: gameLevel1,
      gameLevel2: gameLevel2,
    }
    _storeGameLevelFilter(gameLevelObj);
  };

  return (
    <>
      <View style={{marginTop: 20}}>
        <Text style={styles.filtersText}>Filter level for:{filterSport}</Text>
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
