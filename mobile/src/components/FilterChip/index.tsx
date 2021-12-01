import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {View, ScrollView, StyleSheet} from 'react-native';
import {sportsItemsVar, DescriptionVar} from '../../../cache'
import {useNavigation} from '@react-navigation/native';
import { onScreen, goBack } from '../../../constants'
import {ProfileContext} from './index'
import { useQuery, useMutation, useLazyQuery, HTTPFetchNetworkInterface} from '@apollo/client'
//import {sportsList} from './../../../constants';
import  DatePicker  from 'react-native-date-picker'
import { RootStackParamList } from '../../../AppNavigator'
import { ProfileScreenNavigationProp} from './index'
import { SportContext } from '../IndividualSports/index'
import {GET_SPORTS_LIST} from '../../../graphql/queries/profile'
import {ProfileAttirbutes} from "./ProfileAttributes"
import styles from '../../assets/styles'
import {FilterSportContext} from '../FilterSportsChips'
import _ from 'lodash'
import { FilterFields } from '../../localModels/UserSportsList'
import { useFormikContext} from 'formik';

const FilterChip = ({sport, isSelected = false, isDisplay}) => {
  const {setValues, values: filterValues} = useFormikContext<FilterFields>();
  const {allUserSportsFilter, setAllUserSportsFilter} = useContext(FilterSportContext);
  const [dynamicStyle, setDynamicStyle] = React.useState(styles.ChipButton)
  useEffect(() => {
    const filterSelected = _.find(filterValues.sportFilters, (filterSportObj) => {
      return filterSportObj.sport == sport;
    }).filterSelected
    if (filterSelected){
      setDynamicStyle(styles.ChipButtonSelected)
    }
    else {
      setDynamicStyle(styles.ChipButton);
    }
  }, [allUserSportsFilter])

  const _selected = () => {
      const trial = _.map(allUserSportsFilter, (obj) => {
        if (obj.sport == sport) {
          return {sport: obj.sport, filterSelected: true};
        } else {
          return {sport: obj.sport, filterSelected: false};
        }
      });
      setAllUserSportsFilter(trial);
      setValues({... filterValues, 'sportFilters': trial});
      //getData(trial)
  };
  return (
    <>
      <Chip
        title= {sport}
        titleStyle={styles.chipText}
        icon={{
          name: 'bluetooth',
          type: 'font-awesome',
          size: 20,
          color: 'black',
        }}
        buttonStyle={dynamicStyle}
        containerStyle={styles.singleChip}
        onPress={() => _selected()}
        disabled={isDisplay}
        disabledTitleStyle={styles.chipText}
        disabledStyle={styles.ChipButton}
      />
    </>
  );
};

export { FilterChip }
