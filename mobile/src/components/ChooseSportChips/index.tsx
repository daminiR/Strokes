import {Card} from 'react-native-elements'
import React from 'react'
import {View} from 'react-native';
import {sportsList} from '../../constants';
import styles from '../../assets/styles'
import {SportChips} from '../SportsChips'
import {sportsItemsVar} from '../../cache'
import { useReactiveVar } from "@apollo/client"

const ChooseSportsChips = ({userSportsList = null, getSportsList = null}) => {
  const getData = (newSport, isSelected) => {
  const allSports = sportsItemsVar()
    if(isSelected){
      sportsItemsVar([...sportsItemsVar(), {sport: newSport, game_level: 0}])
    }
    else{
      const filterSports = allSports.filter((sport) => sport.sport !== newSport)
      sportsItemsVar(filterSports)
    }
    if (getSportsList){
      getSportsList(sportsItemsVar())
    }
    //console.log(sportsItemsVar())
  }
  return (
    <>
      <Card containerStyle={styles.CardStyle}>
        <Card.Title> List of Acitivities</Card.Title>
        <Card.Divider />
        <View style={styles.sportChipSet}>
          {sportsList.map((sport, i) => (
            <SportChips
              key={i}
              sport={sport}
              isDisplay={false}
              isSelected={userSportsList?  userSportsList.some((currSport) => currSport.sport === sport): false}
              getData={getData}
            />
          ))}
        </View>
      </Card>
    </>
  );
};
export {ChooseSportsChips}
