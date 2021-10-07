import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import React, { useRef, useContext, useEffect, useState, ReactElement } from 'react'
import {UserContext} from '../../../UserContext'
import {ProfileContext} from './index'
import {UPLOAD_FILE, DELETE_IMAGE} from '../../../graphql/mutations/profile'
import {READ_SQUASH} from '../../../graphql/queries/profile'
import { ProfileSettingsInput } from "./profileSettingInput"
import {View, ScrollView, StyleSheet } from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { generateRNFile } from '../../../utils/Upload'
import { _check_single } from '../../../utils/Upload'
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'
import { onScreen, goBack } from '../../../constants'

const _first_name = (navigation) => {
      onScreen('FIRST_NAME', navigation)()
};
const _age = (navigation) => {
      onScreen('AGE', navigation)()
};
const _gender = (navigation) => {
      onScreen('GENDER', navigation)()
};
const list = [
  {title: 'Name', icon: 'av-timer', subtitle: 'Damini', buttonPress: _first_name},
  {title: 'Age', icon: 'flight-takeoff', subtitle: '27',buttonPress: _age},
  {title: 'gender', icon: 'flight-takeoff', subtitle: 'Female',buttonPress: _gender},
]
const ProfileAttirbutes = () => {
  const [loading, setLoading] = React.useState(null)
  const didMountRef = useRef(false)
  const navigation = useNavigation()
  const {squashData, newSportList} = useContext(ProfileContext);
  const {currentUser} = useContext(UserContext);
  // update first name on profile screen
  useEffect(() => {
    if (didMountRef.current){
  setLoading(true);
  if (
    squashData?.squash?.first_name != undefined &&
    squashData?.squash?.first_name.length != 0
  ) {
    const ind_to_update = list.findIndex((listAttribute => listAttribute.title == 'Name'))
    list[ind_to_update].subtitle = squashData!.squash.first_name + ' ' + squashData!.squash.last_name
    setLoading(false);
  }
  // for first name
}
    else {
      didMountRef.current = true
    }

  }, [squashData?.squash?.first_name])
  // update age on screen page
  useEffect(() => {
  setLoading(true);
  if (
    squashData?.squash?.age != undefined &&
    squashData?.squash?.age.length != 0
  ) {
    const ind_to_update = list.findIndex((listAttribute => listAttribute.title == 'Age'))
    list[ind_to_update].subtitle = squashData!.squash.age
    setLoading(false);
  }

  }, [squashData?.squash?.age])

  useEffect(() => {
  setLoading(true);
  if (
    squashData?.squash?.gender != undefined &&
    squashData?.squash?.gender.length != 0
  ) {
    const ind_to_update = list.findIndex((listAttribute => listAttribute.title == 'gender'))
    list[ind_to_update].subtitle = squashData!.squash.gender
    setLoading(false);
  }

  }, [squashData?.squash?.gender])

  return (
    <>
      {list.map((item, i) => (
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
  )
}
export  { ProfileAttirbutes }
