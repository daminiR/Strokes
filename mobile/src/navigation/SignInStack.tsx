import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {ProfileImages, User, ProfileComplete, ProfileSport, ProfileGender, Profile, ProfileBirthday} from '../screens/Authenticator'
import { UserContext } from '../UserContext'
import { NavigationContainer } from '@react-navigation/native'


const Stack = createStackNavigator()


export type RootStackSignInParamList = {
  PROFILE: undefined
  USER: undefined
  BIRTHDAY: undefined
  GENDER: undefined
  SPORT: undefined
  IMAGE_SET: undefined
  COMPLETE: undefined
}


export default function SignInStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
      <Stack.Screen name="USER" component={User} />
      <Stack.Screen name="PROFILE" component={Profile} />
      <Stack.Screen name="BIRTHDAY" component={ProfileBirthday} />
      <Stack.Screen name="GENDER" component={ProfileGender} />
      <Stack.Screen name="SPORT" component={ProfileSport} />
      <Stack.Screen name="IMAGE_SET" component={ProfileImages} />
      <Stack.Screen name="COMPLETE" component={ProfileComplete} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
