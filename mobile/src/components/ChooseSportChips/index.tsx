import {Card} from 'react-native-elements'
import React, {useState} from 'react'
import {View} from 'react-native';
import {sportsList} from '../../constants';
import styles from '../../assets/styles'
import {SportChips} from '../SportsChips'
import { Cancel, Done, } from '..'
import { EditFields} from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';
import {Overlay, CheckBox, Text} from 'react-native-elements'


const GameLevelChoose = ({isVisible}) => {
  const [gameLevelVisible, setGameLevelVisible] = useState(false)
  const [gameLevel1, setGameLevel1] = useState(false);
  const [gameLevel2, setGameLevel2] = useState(false);
  const [gameLevel0, setGameLevel0] = useState(false);
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
  return(
    <Overlay isVisible={isVisible}>
          <View style={{marginTop: 20}}>
            <Text style={styles.filtersText}>Filter level for:</Text>
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
    </Overlay>
  )
}





const ChooseSportsChips = () => {
  const {setFieldValue, values: formikValues} = useFormikContext<EditFields>();
  const [gameLevelVisible, setGameLevelVisible] = useState(false)
  const getData = (newSport, isSelected) => {
    if(isSelected){
      setGameLevelVisible(true)
      const sportObj = [{sport: newSport, game_level: 0}];
      if (formikValues.sports != null){
      const new_values = formikValues.sports.concat(sportObj)
      setFieldValue('sports', new_values);
      }
      else{
      setFieldValue('sports', sportObj)
      }
    }
    else{
      const allSports = formikValues.sports
      const filterSports = allSports.filter((sport) => sport.sport !== newSport)
      setFieldValue('sports', filterSports)
    }
  }

  const renderFormikSports = () => {
    return (
      <>
        <GameLevelChoose isVisible={gameLevelVisible}/>
        <Card containerStyle={styles.CardStyle}>
          <Card.Title> List of Acitivities</Card.Title>
          <Card.Divider />
          <View style={styles.sportChipSet}>
            {sportsList.map((sport, i) => (
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
            ))}
          </View>
        </Card>
      </>
    );
  };
  return (
    renderFormikSports()
  )
};
export {ChooseSportsChips}
