import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Hello, SignIn} from '../screens/Authenticator'
import {SignUp} from '../screens/Authenticator'
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
