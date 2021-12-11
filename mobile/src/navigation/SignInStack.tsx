import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {ActiveChat, Profile, Chat, Match, Likes} from '../screens/Authenticator'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {tabBarSize} from '../constants'
import {Icon} from 'react-native-elements'

const ProfileStack = createStackNavigator()
const ChatStack = createStackNavigator()
const Tab  = createBottomTabNavigator()

 const returnSportListOptions = ({navigation, route}) => ({
 });
const screenOptionStyle = {
  headerBackTitle: "",
  tabBarStyle: [{height: 30}]
};
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
      <ProfileStack.Screen options={{headerShown:false}} name="PROFILE" component={Profile} />
    </ProfileStack.Navigator>
  );
}
export function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ProfileStack.Screen options={{headerShown:false}} name="CHAT" component={Chat} />
      <ProfileStack.Screen  options={{headerShown:false}} name="ACTIVE_CHAT" component={ActiveChat} />
    </ChatStack.Navigator>
  );
}
const customTabBarStyle = {
  showLabel: false,
  activeTintColor: '#0091EA',
  inactiveTintColor: 'gray',
  style: {backgroundColor: '#2b1d08', height: tabBarSize},
  labelStyle: {
    color: '#242424',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
};
export default function MatchStackScreen() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            console.log("what is focues", route.name)
            let iconName;
            switch (route.name) {
              case 'Match':
                iconName = focused ? 'home' : 'home';
                break;
              case 'Profile':
                iconName = focused ? 'person-outline' : 'person-outline';
                break;
              case 'Chat':
                iconName = focused ? 'chat-bubble-outline' : 'chat-bubble-outline';
                break;
              case 'Likes':
                iconName = focused ? 'favorite-border' : 'favorite-border';
                break;
            }
            // You can return any component that you like here!
            return <Icon name={iconName} type='material' size={size} color={'#ff7f02'} />;
          },
         tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
        tabBarOptions={customTabBarStyle}
        initialRouteName="Match">
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
        <Tab.Screen name="Match" component={Match} />
        <Tab.Screen name="Chat" component={ChatStackScreen} />
        <Tab.Screen name="Likes" component={Likes} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
