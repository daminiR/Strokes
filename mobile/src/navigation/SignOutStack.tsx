import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Email, Hello, SignIn, ConfirmSignUp} from '../screens/Authenticator'
import { UserContext } from '../UserContext'
import {ProfileImages, ProfileComplete, ProfileSport,SignUp,  ProfileGender, ProfileName, ProfileBirthday} from '../screens/Authenticator'
import { NavigationContainer } from '@react-navigation/native'

const Stack = createStackNavigator()

export type RootStackSignOutParamList = {
  HELLO: undefined
  SIGNUP: undefined
  SIGN_IN: undefined
}

export default function SignOutStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="HELLO">
      <Stack.Screen name="SIGNUP" component={SignUp} />
      <Stack.Screen name="HELLO" component={Hello} />
      <Stack.Screen name="SIGN_IN" component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
