import {Card} from 'react-native-elements'
import React from 'react'
import {View} from 'react-native';
import styles from '../../assets/styles'
import FilterChip from '../FilterChip'
import { FilterFields } from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';
import _ from 'lodash'

const FilterSportsChips = (props) => {
  const {values: filterValues} = useFormikContext<FilterFields>();
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
  return (
    <>
      {renderFormikSports()}
    </>
  )
};
export {FilterSportsChips}
