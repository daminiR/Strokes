import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Email, Hello, SignIn, ConfirmSignUp} from '../screens/Authenticator'
import { UserContext } from '../UserContext'
import {ProfileImages, ProfileComplete, ProfileSport, ProfileGender, ProfileName, ProfileBirthday} from '../screens/Authenticator'
import { NavigationContainer } from '@react-navigation/native'

const Stack = createStackNavigator()

export type RootStackSignOutParamList = {
  HELLO: undefined
  SIGN_IN: undefined
  CONFIRM_SIGN_UP: undefined
  EMAIL : undefined
  PROFILE_NAME: undefined
  USER: undefined
  BIRTHDAY: undefined
  GENDER: undefined
  SPORT: undefined
  IMAGE_SET: undefined
}

export default function SignOutStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
      <Stack.Screen name="HELLO" component={Hello} />
      <Stack.Screen name="SIGN_IN" component={SignIn} />
      <Stack.Screen name="CONFIRM_SIGN_UP" component={ConfirmSignUp} />
      <Stack.Screen name="EMAIL" component={Email} />
      <Stack.Screen name="PROFILE_NAME" component={ProfileName} />
      <Stack.Screen name="BIRTHDAY" component={ProfileBirthday} />
      <Stack.Screen name="GENDER" component={ProfileGender} />
      <Stack.Screen name="SPORT" component={ProfileSport} />
      <Stack.Screen name="IMAGE_SET" component={ProfileImages} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
