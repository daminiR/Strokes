import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {ProfileImages, User, ProfileComplete, ProfileSport, ProfileGender, Profile, ProfileBirthday} from '../screens/Authenticator'
import { NavigationContainer } from '@react-navigation/native'


const Stack = createStackNavigator()


export type RootStackSignInParamList = {
  PROFILE: undefined
  USER: undefined
  BIRTHDAY: undefined
  GENDER: undefined
  SPORT: undefined
  IMAGE_SET: undefined
}


export default function SignInStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName= "USER" headerMode="none">
      <Stack.Screen name="USER" component={User} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
