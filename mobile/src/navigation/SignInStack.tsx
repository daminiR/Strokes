import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {Profile, Chat, Match, Likes} from '../screens/Authenticator'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const ProfileStack = createStackNavigator()
const ChatStack = createStackNavigator()
const Tab  = createBottomTabNavigator()

export type RootStackSignInParamList = {
  PROFILE: undefined
  CHAT: undefined
  MATCH: undefined
  LIKES: undefined
}
export function ProfileStackScreen() {
  return (
      <ProfileStack.Navigator>
      <ProfileStack.Screen name="PROFILE" component={Profile} />
      </ProfileStack.Navigator>
  )
}
export function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ProfileStack.Screen name="CHAT" component={Chat} />
    </ChatStack.Navigator>
  );
}
export default function MatchStackScreen() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='MATCH'>
        <Tab.Screen name="PROFILE" component={ProfileStackScreen} />
        <Tab.Screen name="MATCH" component={Match} />
        <Tab.Screen name="CHAT" component={ChatStackScreen} />
        <Tab.Screen name="LIKES" component={Likes} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
