import {Card} from 'react-native-elements'
import React, { useContext, useEffect, useState, ReactElement } from 'react'
import {View} from 'react-native';
import {sportsList} from '../../constants';
import styles from '../../assets/styles'
import {SportChips} from '../SportsChips'
import {sportsItemsVar} from '../../cache'
import { useReactiveVar } from "@apollo/client"
import { EditFields} from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';

const ChooseSportsChips = () => {
  const {setFieldValue, values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<EditFields>();
  const getData = (newSport, isSelected) => {
    if(isSelected){
      const new_values = formikValues.sports.concat([{sport: newSport, game_level: 0}])
      setFieldValue('sports', new_values)

    }
    else{
      const allSports = formikValues.sports
      const filterSports = allSports.filter((sport) => sport.sport !== newSport)
      setFieldValue('sports', filterSports)
    }
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
              isSelected={formikValues.sports ?  formikValues.sports.some((currSport) => currSport.sport === sport): false}
              getData={getData}
            />
          ))}
        </View>
      </Card>
    </>
  );
};
export {ChooseSportsChips}
