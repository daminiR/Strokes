import {Card} from 'react-native-elements'
import React, { createContext, useState} from 'react'
import {View} from 'react-native';
import styles from '../../assets/styles'
import {FilterChip} from '../FilterChip'
import { FilterFields } from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';
import _ from 'lodash'

export const FilterSportContext = createContext(null);
const FilterSportsChips = ({sportsList = null}) => {
  const {setValues, values: filterValues} = useFormikContext<FilterFields>();
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
