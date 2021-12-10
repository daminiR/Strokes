import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useContext, useEffect, useState, ReactElement } from 'react'
import {
  TouchableOpacity,
} from 'react-native';
import styles from '../../../assets/styles'
import {UserContext} from '../../../UserContext'
import { useFormikContext} from 'formik';
import { _check_single } from '../../../utils/Upload'
import {useNavigation} from '@react-navigation/native';
import { EditFields} from '../../../localModels/UserSportsList'
import {settingsFlatList} from '../../../constants'

const ProfileAttirbutes = () => {
  const {userData, userLoading} = useContext(UserContext)
  const {values: formikValues } = useFormikContext<EditFields>();
  const navigation = useNavigation()
  // update first name on profile screen
  useEffect(() => {
    if (!userLoading) {
      const user = userData.squash;
      // first name
      const first_name_ind_to_update = settingsFlatList.findIndex(
        (listAttribute) => listAttribute.title == 'Name',
      );
      settingsFlatList[first_name_ind_to_update].subtitle =
        formikValues.first_name + ' ' + formikValues.last_name;
      // age
      const age_ind_to_update = settingsFlatList.findIndex(
        (listAttribute) => listAttribute.title == 'Age',
      );
      settingsFlatList[age_ind_to_update].subtitle = formikValues.age;
      // gender
      const ind_to_update = settingsFlatList.findIndex(
        (listAttribute) => listAttribute.title == 'gender',
      );
      settingsFlatList[ind_to_update].subtitle = formikValues.gender;
      // neighborhood details
      const neighborhoodIdx = settingsFlatList.findIndex(
        (listAttribute) => listAttribute.title == 'Neighborhood',
      );
      settingsFlatList[neighborhoodIdx].subtitle = formikValues.location.city;
      //
    }
  }, [formikValues]);

  return (
    <>
      {settingsFlatList.map((item, i) => (
        <ListItem
          onPress={() => item.buttonPress(navigation)}
          key={i}
          bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </>
  );
}
export  { ProfileAttirbutes }
