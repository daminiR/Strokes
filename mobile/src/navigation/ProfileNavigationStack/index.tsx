import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {ActiveChat, Profile, Chat, Match, Likes} from '@screens'
import {PictureWall, ProfileView} from '@components'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator  } from '@react-navigation/material-top-tabs';
import {tabBarSize} from '@constants'
import {Icon} from 'react-native-elements'

const Tab2  = createMaterialTopTabNavigator()
export type RootStackProfileScreenParamList = {
  PROFILE_VIEW: undefined
  PROFILE_EDIT: undefined
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
 const ProfileInputEdits = () => {
  return (
      <Tab2.Navigator
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Profile Edit':
                iconName = focused ? 'home' : 'home';
                break;
              case 'Profile View':
                iconName = focused ? 'person-outline' : 'person-outline';
                break;
            }
            // You can return any component that you like here!
            return <Icon name={iconName} type='material' size={size} color={'#ff7f02'} />;
          },
         tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
        tabBarOptions={customTabBarStyle}
        initialRouteName="ProfileEdit">
        <Tab2.Screen name="Profile Edit" component={PictureWall}/>
        <Tab2.Screen name="Profile View" component={ProfileView}/>
      </Tab2.Navigator>
  );
}


export {ProfileInputEdits}

