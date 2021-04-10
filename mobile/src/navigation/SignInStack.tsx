import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {Profile, User, Match} from '../screens/Authenticator'
import { NavigationContainer } from '@react-navigation/native'


const ProfileStack = createStackNavigator()
const ChatStack = createStackNavigator()
const MatchStack = createStackNavigator()

export type RootStackSignInParamList = {
  PROFILE: undefined
  CHAT: undefined
  MATCH: undefined
}

export function ProfileStackScreen() {
  return (
    <NavigationContainer>
      <ProfileStack.Navigator initialRouteName= "USER" headerMode="none">
      <ProfileStack.Screen name="USER" component={User} />
      <ProfileStack.Screen name="MATCH" component={Match} />
      </ProfileStack.Navigator>
    </NavigationContainer>
  )
}

export function ChatStackScreen() {
  return (
    <NavigationContainer>
      <ChatStack.Navigator initialRouteName= "USER" headerMode="none">
      <ChatStack.Screen name="PROFILE" component={Profile} />
      <ChatStack.Screen name="MATCH" component={Match} />
      </ChatStack.Navigator>
    </NavigationContainer>
  )
}

export  function MatchStackScreen() {
  return (
    <NavigationContainer>
      <ChatStack.Navigator initialRouteName= "USER" headerMode="none">
      <ChatStack.Screen name="USER" component={User} />
      <ChatStack.Screen name="PROFILE" component={Profile} />
      </ChatStack.Navigator>
    </NavigationContainer>
  )
}
