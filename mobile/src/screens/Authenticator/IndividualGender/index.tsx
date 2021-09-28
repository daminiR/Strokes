import React, { useContext, useState, ReactElement } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import * as Yup from 'yup'
import { onScreen, goBack } from '../../../constants'
import  auth  from '@react-native-firebase/auth'
import {Text} from 'react-native'

import {RootIndividualProfileInputParamList } from '../../../navigation/individualProfileStack'

type ProfileScreenNavigationProp = StackNavigationProp<RootIndividualProfileInputParamList, 'FIRST_NAME'>

type GenderT = {
  navigation: ProfileScreenNavigationProp
}
const Gender = ({ navigation }: GenderT): ReactElement => {
  return (
    <>
      <Text >
        "Gender"
      </Text >
    </>
  )
}
export { Gender }
