import {Card} from 'react-native-elements'
import React, { createContext, useState} from 'react'
import {View} from 'react-native';
import styles from '../../assets/styles'
import FilterChip from '../FilterChip'
import { FilterFields } from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';
import _ from 'lodash'
import {forwardRef } from 'react'

const FilterSportsChips = (props, ref) => {
  const sportsList = props.sportsList
  const {values: filterValues} = useFormikContext<FilterFields>();
  const [allUserSportsFilter, setAllUserSportsFilter] = useState(filterValues.sportFilters);
  const renderFormikSports = () => {
    return (
      <>
        <Card containerStyle={styles.CardStyle}>
          <Card.Title> List of Acitivities</Card.Title>
          <Card.Divider />
          <View style={styles.sportChipSet}>
            {filterValues.sportFilters.map((sportObj, i) => (
              <FilterChip
                ref={ref}
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
    <>
      {renderFormikSports()}
    </>
  )
};
export default forwardRef(FilterSportsChips)
