import React from 'react'
import {createStackNavigator } from '@react-navigation/stack'
import {ActiveChat, Profile, Chat, Match, Likes, Login} from '@screens'
import {SendBirdChat} from '../../screens/Authenticator/SendBirdChat'
import Lobby from '../../screens/Authenticator/Lobby'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {tabBarSize} from '@constants'
import {Icon} from 'react-native-elements'
import { HeaderBackButton } from '@react-navigation/elements'

const ProfileStack = createStackNavigator()
const ChatStack = createStackNavigator()
const Tab  = createBottomTabNavigator()

export type RootStackSignInParamList = {
  PROFILE: {data: number}
  EDIT_SPORTS: undefined
  EDIT_DESCRIPTION: undefined
  ACTIVE_CHAT: undefined
  MATCH: undefined
  FIRST_NAME: undefined
  AGE: undefined
  LAST_NAME: undefined
  GENDER: undefined
  LIKES: undefined
  LOBBY: undefined
  LOGIN: undefined
  CHAT: undefined
  SBCHAT: undefined
}
 const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator initialRouteName="PROFILE">
      <ProfileStack.Screen options={{headerShown:false}} name="PROFILE" component={Profile} />
    </ProfileStack.Navigator>
  );
}
 const ChatStackScreen = () => {
  return (
    <ChatStack.Navigator>
      <ProfileStack.Screen  options={{headerShown:true }} name="LOBBY" component={Lobby} />
      <ProfileStack.Screen options={{headerShown:false}} name="SBCHAT" component={SendBirdChat} />
      <ProfileStack.Screen options={{headerShown:false}} name="CHAT" component={Chat} />
      <ProfileStack.Screen  options={{headerShown:true }} name="ACTIVE_CHAT" component={ActiveChat} />
      <ProfileStack.Screen  options={{headerShown:true }} name="LOGIN" component={Lobby} />
    </ChatStack.Navigator>
  );
}
const customTabBarStyle = {
  showLabel: false,
  inactiveTintColor: 'gray',
  style: {backgroundColor: '#2b1d08', height: 60},
  labelStyle: {
    color: '#242424',
    fontFamily: 'OpenSans-Regular',
    //fontSize: 10,
  },
};
 const MatchStackScreen = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={
          ({route}) => ({
          tabBarIcon: ({focused, size}) => {
            let iconName;
            switch (route.name) {
              case 'Match':
                iconName = focused ? 'home' : 'home';
                break;
              case 'Profile':
                iconName = focused ? 'person-outline' : 'person-outline';
                break;
              case 'Chat':
                iconName = focused
                  ? 'chat-bubble-outline'
                  : 'chat-bubble-outline';
                break;
              case 'Likes':
                iconName = focused ? 'favorite-border' : 'favorite-border';
                break;
            }
            // You can return any component that you like here!
            return (
              <Icon
                name={iconName}
                type="material"
                size={20}
                color={'#ff7f02'}
              />
            );
          },
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: customTabBarStyle.style,
          tabBarShowLabel: false
        })}
        initialRouteName="Match">
        <Tab.Screen options= {{headerShown: false}} name="Profile" component={ProfileStackScreen} />
        <Tab.Screen options= {{headerShown: false}} name="Match" component={Match} />
        <Tab.Screen options= {{headerShown: false}} name="Chat" component={ChatStackScreen} />
        <Tab.Screen options= {{headerShown: false}} name="Likes" component={Likes} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


export {MatchStackScreen, ChatStackScreen, ProfileStackScreen}
