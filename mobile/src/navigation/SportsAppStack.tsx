import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {ProfileImages, User, ProfileComplete, ProfileSport, ProfileGender, Profile, ProfileBirthday} from '../screens/Authenticator'
import { NavigationContainer } from '@react-navigation/native'


const Stack = createStackNavigator()


export type RootStackSportAppParamList = {
  COMPLETE: undefined
}

export default function SportAppStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
      <Stack.Screen name="COMPLETE" component={ProfileComplete} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
