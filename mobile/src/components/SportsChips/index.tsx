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

 const SportChips = ({sport, isSelected = false, isDisplay, getData=null}) => {
  const [dynamicStyle, setDynamicStyle] = React.useState(styles.ChipButton)
  const [selected, setSelected] = React.useState(isSelected)
  useEffect(() => {
    if (selected){
      setDynamicStyle(styles.ChipButtonSelected)
    }
    else {
      setDynamicStyle(styles.ChipButton);
    }
  }, [selected])

  const _selected = (selected) => {
    if (selected) {
      selected = false;
      setSelected(selected)
    } else {
      selected = true;
      setSelected(selected)
    }
      getData(sport, selected)
  }
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
        onPress={() => _selected(selected)}
        disabled={isDisplay}
        disabledTitleStyle={styles.chipText}
        disabledStyle={styles.ChipButton}
      />
    </>
  );
};

export { SportChips }
