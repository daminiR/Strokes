import {Card} from 'react-native-elements'
import React, { useState} from 'react'
import {View} from 'react-native';
import styles from '../../assets/styles'
import _ from 'lodash'
import { Cancel, } from '../Cancel'
import {  Done, } from '../Done/'
import {Button, Overlay, CheckBox, Text} from 'react-native-elements'

 const GameLevelChoose = ({removeSport, sport, getData,setGameLevelInput, setDynamicStyle, isVisible, setIsVisible, isSignUp}) => {
  const [gameLevel, setGameLevel] = useState(null);
  const _onPressGameLevel = (gameLevel) => {
    setGameLevel(gameLevel)
  };
  const _onCancel = () => {
    //getData(sport, false, gameLevel);
    // visual changes//
    setGameLevel(null)
    setDynamicStyle(styles.ChipButton);
    setIsVisible(false)
    // visual changes//
  };
  const _onDone = () => {
    // visual changes//
    if (gameLevel) {
      getData(sport, true, gameLevel);
      //setIsDisplayInput(true)
      setGameLevelInput(gameLevel)
      setIsVisible(false)
    }
    // visual changes//
  };
  const _onPressRemoveSport = () => {
    removeSport(sport)
    setIsVisible(false)
  }
  return (
    <Overlay isVisible={isVisible}>
      <View style={styles.top}>
        <Cancel _onPressCancel={_onCancel} />
        <Done _onPressDone={_onDone} />
      </View>
      <View style={{marginTop: 20}}>
        <Text style={styles.filtersText}>Filter level for:</Text>
        <CheckBox
          title="Beginner"
          checked={gameLevel === '0' ? true : false}
          onPress={() => _onPressGameLevel('0')}
        />
        <CheckBox
          title="Intermediate"
          checked={gameLevel === '1' ? true : false}
          onPress={() => _onPressGameLevel('1')}
        />
        <CheckBox
          title="Advanced"
          checked={gameLevel === '2' ? true : false}
          onPress={() => _onPressGameLevel('2')}
        />
        <View style={styles.helloButtons}>
            <Button
              title="Remove Sport"
              titleStyle={styles.buttonText}
              onPress={() => _onPressRemoveSport()}
              style={styles.buttonIndStyle}
              buttonStyle={styles.buttonStyle}
            />
        </View>
      </View>
    </Overlay>
  );
}
export {GameLevelChoose}
