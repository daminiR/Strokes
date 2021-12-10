import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {ActiveChat, Profile, Chat, Match, Likes} from '../screens/Authenticator'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const ProfileStack = createStackNavigator()
const ChatStack = createStackNavigator()
const Tab  = createBottomTabNavigator()

 const returnSportListOptions = ({navigation, route}) => ({
 });
export type RootStackSignInParamList = {
  PROFILE: {data: number}
  EDIT_SPORTS: undefined
  EDIT_DESCRIPTION: undefined
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
    </ProfileStack.Navigator>
  );
}
export function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ProfileStack.Screen name="CHAT" component={Chat} />
      <ProfileStack.Screen name="ACTIVE_CHAT" component={ActiveChat} />
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
