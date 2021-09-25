import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {Profile, Chat, Match, Likes} from '../screens/Authenticator'
import {FirstName, Age, Gender, LastName} from '../screens/Authenticator/'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const ProfileStack = createStackNavigator()
const IndividualStack = createStackNavigator()
const ChatStack = createStackNavigator()
const Tab  = createBottomTabNavigator()

export type RootStackSignInParamList = {
  PROFILE: undefined
  CHAT: undefined
  MATCH: undefined
  FIRST_NAME: undefined
  AGE: undefined
  LAST_NAME: undefined
  GENDER: undefined
  LIKES: undefined
}
export function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator initialRouteName="PROFILE">
      <ProfileStack.Screen name="PROFILE" component={Profile} />
      <ProfileStack.Screen name="FIRST_NAME" component={FirstName} />
      <ProfileStack.Screen name="AGE" component={Age} />
      <ProfileStack.Screen name="LAST_NAME" component={LastName} />
      <ProfileStack.Screen name="GENDER" component={Gender} />
    </ProfileStack.Navigator>
  );
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
      <Tab.Navigator initialRouteName='PROFILE'>
        <Tab.Screen name="PROFILE" component={ProfileStackScreen} />
        <Tab.Screen name="MATCH" component={Match} />
        <Tab.Screen name="CHAT" component={ChatStackScreen} />
        <Tab.Screen name="LIKES" component={Likes} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
