import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Hello, SignIn, SignUp, ForgotPassword} from '@screens'
import { NavigationContainer } from '@react-navigation/native'

const Stack = createStackNavigator()

export type RootStackSignOutParamList = {
  HELLO: undefined
  FORGOT_PASSWORD: undefined
  SIGNUP: undefined
  SIGN_IN: undefined
}

export  const SignOutStack = () =>  {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="HELLO">
        <Stack.Screen name="SIGNUP" component={SignUp} />
        <Stack.Screen name="HELLO" component={Hello} />
        <Stack.Screen name="SIGN_IN" component={SignIn} />
        <Stack.Screen name="FORGOT_PASSWORD" component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
