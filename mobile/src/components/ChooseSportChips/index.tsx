import {Card} from 'react-native-elements'
import React, {useState, useEffect} from 'react'
import {View} from 'react-native';
import {sportsList} from '../../constants';
import styles from '../../assets/styles'
import {SportChips} from '../SportsChips'
import { Cancel, Done, } from '..'
import { EditFields} from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';
import {Overlay, CheckBox, Text} from 'react-native-elements'


 const GameLevelChoose = ({ setIsDisplayInput,setGameLevelInput, setDynamicStyle, isVisible, setIsVisible}) => {
  const [gameLevel, setGameLevel] = useState(null);
  const _onPressGameLevel = (gameLevel) => {
    setGameLevel(gameLevel)
  };
  const _onCancel = () => {
    setGameLevel(null)
    setDynamicStyle(styles.ChipButton);
    setIsVisible(false)
  };
  const _onDone = () => {
    if (gameLevel) {
      setIsDisplayInput(true)
      setGameLevelInput(gameLevel)
      setIsVisible(false)
    }
  };
  return(
    <Overlay isVisible={isVisible}>
        <View style={styles.top}>
          <Cancel _onPressCancel={_onCancel} />
          <Done _onPressDone={_onDone} />
        </View>
          <View style={{marginTop: 20}}>
            <Text style={styles.filtersText}>Filter level for:</Text>
            <CheckBox
              title="Beginner"
              checked={gameLevel === '0'? true : false}
              onPress={() => _onPressGameLevel('0')}
            />
            <CheckBox
              title="Intermediate"
              checked={gameLevel === '1'? true : false}
              onPress={() => _onPressGameLevel('1')}
            />
            <CheckBox
              title="Advanced"
              checked={gameLevel === '2'? true : false}
              onPress={() => _onPressGameLevel('2')}
            />
          </View>
    </Overlay>
  )
}

const undoSportSelect = (setFieldValue, formikValues, newSport) => {
      const allSports = formikValues.sports
      const filterSports = allSports.filter((sport) => sport.sport !== newSport)
      setFieldValue('sports', filterSports)
}
const ChooseSportsChips = () => {
  const {setFieldValue, values: formikValues} = useFormikContext<EditFields>();
  const [gameLevelVisible, setGameLevelVisible] = useState(false)
  const [isUndo, setIsUndo] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [currentSportObj, setCurrentSportObj] = useState(null)
  const getData = (newSport, isSelected) => {
    if(isSelected){
      const sportObj = [{sport: newSport, game_level: 0}];
      setCurrentSportObj(sportObj)
      setGameLevelVisible(true)
      if (formikValues.sports != null){
      const new_values = formikValues.sports.concat(sportObj)
      setFieldValue('sports', new_values);
      }
      else{
      setFieldValue('sports', sportObj)
      }
    }
    else{
      undoSportSelect(setFieldValue, formikValues, newSport)
    }
  }
  const undoSport = () => {
    setIsUndo(true)
    console.log(currentSportObj)
    undoSportSelect(setFieldValue, formikValues, currentSportObj.sport)
  }
  const renderFormikSports = () => {
    return (
      <>
        <Card containerStyle={styles.CardStyle}>
          <Card.Title> List of Acitivities</Card.Title>
          <Card.Divider />
          <View style={styles.sportChipSet}>
            {sportsList.map((sport, i) => {
              return (
                  <SportChips
                    key={i}
                    sport={sport}
                    isDisplay={false}
                    isSelected={
                      formikValues.sports
                        ? formikValues.sports.some(
                            (currSport) => currSport.sport === sport,
                          )
                        : false
                    }
                    getData={getData}
                  />
              );})}
          </View>
        </Card>
      </>
    );
  };
  return (
    renderFormikSports()
  )
};
export {GameLevelChoose, ChooseSportsChips}
