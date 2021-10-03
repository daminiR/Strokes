import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {FirstName, Age, Gender, LastName, Description} from '../screens/Authenticator'
import { UserContext } from '../UserContext'
import {ProfileImages, ProfileComplete, ProfileSport, ProfileGender, ProfileName, ProfileBirthday} from '../screens/Authenticator'
import { NavigationContainer } from '@react-navigation/native'

const Stack = createStackNavigator()

export type RootIndividualProfileInputParamList = {
  FIRST_NAME: undefined
  DESCRIPTION: undefined
  AGE: undefined
  GENDER: undefined
  LAST_NAME : undefined
}

export default function IndividualInputParamList() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
      <Stack.Screen name="FIRST_NAME" component={FirstName} />
      <Stack.Screen name="AGE" component={Age} />
      <Stack.Screen name="GENDER" component={Gender} />
      <Stack.Screen name="DESCRIPTION" component={Description} />
      <Stack.Screen name="LAST_NAME" component={LastName} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
