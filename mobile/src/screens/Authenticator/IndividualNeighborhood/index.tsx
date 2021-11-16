import React, { useEffect, useContext, useState, ReactElement } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import {
  StyleSheet,
    FlatList,
    Image,
    ScrollView,
    Platform,
    SafeAreaView,
    View,
  } from 'react-native';
import { RouteProp } from '@react-navigation/native'
import {UPDATE_GENDER} from '../../../graphql/mutations/profile'
import * as Yup from 'yup'
import { onScreen, goBack, genderRadioObject} from '../../../constants'
import {UserContext} from '../../../UserContext'
import {CheckBox, Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import  auth  from '@react-native-firebase/auth'
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'
//import {Text} from 'react-native'

import {RootIndividualProfileInputParamList } from '../../../navigation/individualProfileStack'

type NeighborhoodScreenNavigationProp = StackNavigationProp<RootIndividualProfileInputParamList, 'NEIGHBORHOOD'>

type NeighborhoodT = {
  navigation: NeighborhoodScreenNavigationProp
}
const SetNeighborHood = ({ navigation }: NeighborhoodT): ReactElement => {
   const [updateGender] = useMutation(UPDATE_GENDER);
   const [radioButtons, setRadioButtons] = useState(genderRadioObject)
   const {currentUser} = useContext(UserContext)
   const onPressRadioButton = (radioButtonsArray: RadioButtonProps[]) => {
        setRadioButtons(radioButtonsArray);
        console.log(radioButtonsArray)
    }
  const _updateName = () => {
    const gender = radioButtons.find((genderObj) => genderObj.selected == true).value
    console.log(gender)
    updateGender({variables: {_id: currentUser.uid, gender: gender}})
    navigation.goBack()
  }

  return (
    <>
      <RadioGroup
            radioButtons={radioButtons}
            onPress={onPressRadioButton}
        />
      <Button
        title="Update"
        onPress={() => {
          _updateName();
        }}/>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    backgroundColor: 'grey',
    flex: 1,
  },
});
export { SetNeighborHood }
