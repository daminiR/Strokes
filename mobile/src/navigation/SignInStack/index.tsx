import React from 'react'
import {createStackNavigator } from '@react-navigation/stack'
import {ActiveChat, Profile, Chat, Match, Likes} from '@screens'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {tabBarSize} from '@constants'
import {Icon} from 'react-native-elements'
import { HeaderBackButton } from '@react-navigation/elements'

const ProfileStack = createStackNavigator()
const ChatStack = createStackNavigator()
const Tab  = createBottomTabNavigator()

 const returnSportListOptions = ({navigation, route}) => ({
 });

const screenOptionStyle = {
  //headerBackTitle: "",
  //tabBarStyle: [{height: 30}]
  //{
  "tabBarActiveTintColor": "#0091EA",
  "tabBarInactiveTintColor": "gray",
  "tabBarShowLabel": false,
  "tabBarLabelStyle": {
    "color": "#242424",
    "fontFamily": "OpenSans-Regular",
    "fontSize": 16
  },
  "tabBarStyle": [
    {
      "display": "flex"
    },
    null
  ]
}

export type RootStackSignInParamList = {
  PROFILE: {data: number}
  EDIT_SPORTS: undefined
  EDIT_DESCRIPTION: undefined
  CHAT: undefined
  ACTIVE_CHAT: undefined
  MATCH: undefined
  FIRST_NAME: undefined
  AGE: undefined
  LAST_NAME: undefined
  GENDER: undefined
  LIKES: undefined
}
 const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator initialRouteName="PROFILE">
      <ProfileStack.Screen options={{headerShown:false}} name="PROFILE" component={Profile} />
    </ProfileStack.Navigator>
  );
}
const trialOptions = {
  headerShown: true,
  headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => {
              }}
            />
          ),

}
 const ChatStackScreen = () => {
  return (
    <ChatStack.Navigator>
      <ProfileStack.Screen options={{headerShown:false}} name="CHAT" component={Chat} />
      <ProfileStack.Screen  options={{headerShown:false }} name="ACTIVE_CHAT" component={ActiveChat} />
    </ChatStack.Navigator>
  );
}
const customTabBarStyle = {
  showLabel: false,
  inactiveTintColor: 'gray',
  style: {backgroundColor: '#2b1d08', height: tabBarSize, alignItems: 'center', paddingTop: 15},
  labelStyle: {
    color: '#242424',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
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
                size={size}
                color={'#ff7f02'}
              />
            );
          },
          headerShown: false,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: customTabBarStyle.style,
          tabBarLabelStyle: customTabBarStyle.labelStyle,
        })}
        initialRouteName="Match">
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
        <Tab.Screen name="Match" component={Match} />
        <Tab.Screen name="Chat" component={ChatStackScreen} />
        <Tab.Screen name="Likes" component={Likes} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


export {MatchStackScreen, ChatStackScreen, ProfileStackScreen}

