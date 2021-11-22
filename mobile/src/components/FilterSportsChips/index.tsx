import {Card} from 'react-native-elements'
import React, { createContext, useContext, useEffect, useState, ReactElement } from 'react'
import {View} from 'react-native';
import {sportsList} from '../../constants';
import styles from '../../assets/styles'
import {FilterChip} from '../FilterChip'
import {sportsItemsVar} from '../../cache'
import { useReactiveVar } from "@apollo/client"
import { EditFields} from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';
import _ from 'lodash'

export const FilterSportContext = createContext(null);
const FilterSportsChips = ({isFilter = false, sportsList = null, selectedSport = null}) => {
  const [trigger, setTrigger] = useState(false);
  const [filterSport, setFilterSport] = useState(selectedSport);
  const allUserSports = _.map(sportsList, (sport) => {
    return {sport: sport, filterSelected: false};
  });
  const [allUserSportsFilter, setAllUserSportsFilter] = useState(allUserSports);
  const getData = (newSport, isSelected) => {
    setTrigger(true)
    setFilterSport(newSport)
    console.log(filterSport)
    if(isSelected){
      const sportObj = [{sport: newSport, game_level: 0}];
      selectedSport = newSport
      //if (formikValues.sports != null){
      //const new_values = formikValues.sports.concat(sportObj)
      //setFieldValue('sports', new_values);
      //}
      //else{
      //setFieldValue('sports', sportObj)
      //}

    }
    else{
      //const allSports = formikValues.sports
      //const filterSports = allSports.filter((sport) => sport.sport !== newSport)
      //setFieldValue('sports', filterSports)
    }
  }

  //useEffect(() => {
    //if (trigger) {
      //console.log('here:w');
      //setTrigger(false);
    //}
    //}, [trigger])
  useEffect(() => {
    //if (trigger) {
      //setTrigger(false);
    //}
    }, [filterSport])

  const renderFormikSports = () => {
    return (
      <>
        <Card containerStyle={styles.CardStyle}>
          <Card.Title> List of Acitivities</Card.Title>
          <Card.Divider />
          <View style={styles.sportChipSet}>
            {sportsList.map((sport, i) => (
              <FilterChip
                key={i}
                sport={sport}
                isDisplay={false}
                //isSelected={sport == filterSport ? true: false}
                isSelected={false}
                getData={getData}
              />
            ))}
          </View>
        </Card>
      </>
    );
  };
  const value = {
    allUserSportsFilter: allUserSportsFilter,
    setAllUserSportsFilter: setAllUserSportsFilter,
  };
  return (
    <FilterSportContext.Provider value={value}>
      {renderFormikSports()}
    </FilterSportContext.Provider>
  )
};
export {FilterSportsChips}
