import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Email, Hello, SignIn, ConfirmSignUp, User} from './screens/Authenticator'
import { UserContext } from './UserContext'

const Stack = createStackNavigator()

export type RootStackParamList = {
  HELLO: undefined
  SIGN_IN: undefined
  CONFIRM_SIGN_UP: undefined
  USER: undefined
  EMAIL : undefined
}

const AppNavigator = () => {
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const {currentUser} = useContext(UserContext)

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      //initialRouteName="HELLO"
    >
      {currentUser === null ? (
        <Stack.Screen name="HELLO" component={Hello} />
      ) : (
      <Stack.Screen name="USER" component={User} />
      )}
      <Stack.Screen name="SIGN_IN" component={SignIn} />
      <Stack.Screen name="CONFIRM_SIGN_UP" component={ConfirmSignUp} />
      <Stack.Screen name="EMAIL" component={Email} />
    </Stack.Navigator>
  )
}

export default AppNavigator
