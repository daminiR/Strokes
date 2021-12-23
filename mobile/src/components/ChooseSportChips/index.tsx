import {Card} from 'react-native-elements'
import React, {useContext, useState, useEffect} from 'react'
import {DoneCancelContext} from '../../screens/Authenticator/Profile/index'
import {View} from 'react-native';
import { EditInputVar} from '../../cache'
import {sportsList} from '../../constants';
import styles from '../../assets/styles'
import {SportChips} from '../SportsChips'
import { Cancel, Done, } from '..'
import { EditFields} from '../../localModels/UserSportsList'
import _ from 'lodash'
import { useFormikContext} from 'formik';
import {Button, Overlay, CheckBox, Text} from 'react-native-elements'
import { ProfileFields} from '../../localModels/UserSportsList'


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
          {!isSignUp && (
            <Button
              title="Remove Sport"
              titleStyle={styles.buttonText}
              onPress={() => _onPressRemoveSport()}
              style={styles.buttonIndStyle}
              buttonStyle={styles.buttonStyle}
            />
          )}
        </View>
      </View>
    </Overlay>
  );
}

const removeSportSelect = (newSport, setTempSports, temptSports) => {
      const allSports = temptSports
      const filterSports = allSports.filter((sport) => sport.sport !== newSport)
      setTempSports(filterSports)
      //setFieldValue('sports', filterSports)
}
const undoSportSelect = (newSport, setTempSports, temptSports) => {
      const allSports = temptSports
      const filterSports = allSports.filter((sport) => sport.sport !== newSport)
      setTempSports(filterSports)
      //setFieldValue('sports', filterSports)
}
const ChooseSportsChips = ({isSignUp}) => {
  let setDisplayInput = null;
  let _onPressDoneInput = null
  let _onPressCancelInput = null
  if (!isSignUp) {
    setDisplayInput = useContext(DoneCancelContext);
     _onPressDoneInput = () => {
      setFieldValue('sports', temptSports);
      EditInputVar({inputType: '', displayInput: false});
      setDisplayInput(false);
    };
     _onPressCancelInput = () => {
      EditInputVar({inputType: '', displayInput: false});
      setDisplayInput(false);
    };
  }

  const {setFieldValue, values: formikValues} = useFormikContext<EditFields | ProfileFields>();
  const [temptSports, setTempSports] = useState(formikValues.sports)
  const getData = (newSport, isSelected, game_level) => {
    // need new logic here
    const sportObjTemp =_.find(temptSports, ['sport', newSport])
    if(isSelected){
      // find sport if exists already
      var new_values = null
      var newSportObj = null
      if (sportObjTemp) {
        //TODO: fix string -> number  in backend
        newSportObj = {sport: sportObjTemp.sport, game_level: game_level}
        new_values = _.map(temptSports, (sportObj) => {
          if (sportObj.sport == newSport) {
            return newSportObj;
          } else {
            return sportObj;
          }
        });
        console.log("new_vals 1",new_values)
        setTempSports(new_values)
      } else {
        newSportObj = [{sport: newSport, game_level: game_level}];
        if (temptSports != null) {
        new_values = temptSports.concat(newSportObj);
        console.log("new_vals 2",new_values)
        setTempSports(new_values)
        } else {
        new_values = newSportObj;
        setTempSports(new_values)
        console.log("new_vals 3",new_values)
        }
      }
    }
    else{
      if (sportObjTemp){
      }
      else{
        undoSportSelect(newSport, setTempSports, temptSports)
      }
    }
    if (isSignUp){
      console.log("are we null here",temptSports)
      setFieldValue('sports', temptSports)
    }
  }
  const _removeSport = (sport) => {
    removeSportSelect( sport, setTempSports, temptSports)
  }
  const renderFormikSports = () => {
    return (
      <>
        {!isSignUp && (
          <View style={styles.top}>
            <Cancel _onPressCancel={_onPressCancelInput} />
            <Done _onPressDone={_onPressDoneInput} />
          </View>
        )}
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
                  gameLevel={_.find(temptSports, [
                    'sport',
                    sport,
                  ])?.game_level.toString()}
                  isSelected={
                    formikValues.sports
                      ? formikValues.sports.some(
                          (currSport) => currSport.sport === sport,
                        )
                      : false
                  }
                  getData={getData}
                  removeSport={_removeSport}
                />
              );
            })}
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
