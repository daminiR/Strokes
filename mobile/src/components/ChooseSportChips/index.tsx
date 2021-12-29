import {Card} from 'react-native-elements'
import React, {useContext, useState} from 'react'
import {DoneCancelContext} from '@Contexts'
import {View} from 'react-native';
import { EditInputVar} from '@cache'
import {sportsList} from '@constants';
import { styles } from '@styles'
import {  Done, Cancel, SportChips} from '@components'
import { EditFields, ProfileFields} from '@localModels'
import _ from 'lodash'
import { useFormikContext} from 'formik';


const removeSportSelect = (isSignUp, setFieldValue, newSport, setTempSports, temptSports, setTempSports2) => {
      const allSports = temptSports
      const filterSports = allSports.filter((sport) => sport.sport !== newSport)
      setTempSports(filterSports);
      setTempSports2(filterSports);
      isSignUp && setFieldValue('sports', filterSports);
}
const undoSportSelect = (isSignUp, setFieldValue, newSport, setTempSports, temptSports, setTempSports2) => {
      const allSports = temptSports
      const filterSports = allSports.filter((sport) => sport.sport !== newSport)
      setTempSports(filterSports);
      setTempSports2(filterSports);
      isSignUp && setFieldValue('sports', filterSports);
}
const ChooseSportsChips = ({isSignUp}) => {
  var setDisplayInput = null;
  let _onPressDoneInput = null
  let _onPressCancelInput = null

    var setTempSports2 = null;
   if (!isSignUp){
    var {setTempSports2} = useContext(DoneCancelContext);
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
        console.log('new_vals 1', new_values);
        setTempSports(new_values)
        setTempSports2(new_values)
        isSignUp && setFieldValue('sports', new_values)
      }
      else {
        newSportObj = [{sport: newSport, game_level: game_level}];
        if (temptSports != null) {
        new_values = temptSports.concat(newSportObj);
        console.log("new_vals 2",new_values)
        setTempSports(new_values)
        setTempSports2(new_values)
        isSignUp && setFieldValue('sports', new_values)
        } else {
        new_values = newSportObj;
        console.log("new_vals 3",new_values)
        setTempSports(new_values)
        setTempSports2(new_values)
        isSignUp && setFieldValue('sports', new_values)
        }
      }
    }
    else{
      if (sportObjTemp){
      }
      else{
        undoSportSelect(isSignUp, setFieldValue, newSport, setTempSports, temptSports, setTempSports2)
      }
    }
  }
  const _removeSport = (sport) => {
    removeSportSelect( isSignUp, setFieldValue, sport, setTempSports, temptSports, setTempSports2)
  }
  if (!isSignUp) {
    var {setDisplayInput} = useContext(DoneCancelContext);
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
                  isSignUp={isSignUp}
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
export {ChooseSportsChips}
