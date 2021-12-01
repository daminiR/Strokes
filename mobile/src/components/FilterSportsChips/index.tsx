import {Card} from 'react-native-elements'
import React, { createContext, useContext, useEffect, useState, ReactElement } from 'react'
import {View} from 'react-native';
import {sportsList} from '../../constants';
import styles from '../../assets/styles'
import {FilterChip} from '../FilterChip'
import {sportsItemsVar} from '../../cache'
import { useReactiveVar } from "@apollo/client"
import { FilterFields } from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';
import _ from 'lodash'

export const FilterSportContext = createContext(null);
const FilterSportsChips = ({isFilter = false, sportsList = null, selectedSport = null}) => {
  const {setValues, values: filterValues} = useFormikContext<FilterFields>();
  console.log("in filter valuess",filterValues)
  const allUserSports = _.map(sportsList, (sport) => {
    return {sport: sport, filterSelected: false};
  });
  const [allUserSportsFilter, setAllUserSportsFilter] = useState(allUserSports);
  const renderFormikSports = () => {
    return (
      <>
        <Card containerStyle={styles.CardStyle}>
          <Card.Title> List of Acitivities</Card.Title>
          <Card.Divider />
          <View style={styles.sportChipSet}>
            {filterValues.sportFilters.map((sportObj, i) => (
              <FilterChip
                key={i}
                sport={sportObj.sport}
                isDisplay={false}
                //isSelected={sport == filterSport ? true: false}
                isSelected={sportObj.filterSelected}
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
