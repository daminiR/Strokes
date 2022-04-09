import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Lobby from '../../screens/Authenticator/Lobby'
import { NavigationContainer } from '@react-navigation/native'

const Stack = createStackNavigator()
export type RootStackChatParamList = {
  LOBBY: undefined
}

export  const ChatStack = () =>  {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="LOBBY">
        <Stack.Screen name="LOBBY" component={Lobby} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
