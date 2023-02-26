import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Hello, SignIn, SignUp } from '@screens'
import { NavigationContainer } from '@react-navigation/native'

const Stack = createStackNavigator()

export type RootStackSignOutParamList = {
  HELLO: undefined
  SIGNUP: undefined
  SIGN_IN: undefined
}

export  const SignOutStack = ({initialRoutName="HELLO"}) =>  {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={initialRoutName}>
        <Stack.Screen name="SIGNUP" component={SignUp} />
        <Stack.Screen name="HELLO" component={Hello} />
        <Stack.Screen name="SIGN_IN" component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
