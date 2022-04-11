import React from 'react'
import {SendBirdChat} from '../../screens/Authenticator/SendBirdChat'
import {ActiveChatProfileView, ActiveChatScreen} from '@components'
import { createMaterialTopTabNavigator  } from '@react-navigation/material-top-tabs';
import {tabBarSize} from '@constants'
import {Icon} from 'react-native-elements'
import { useRoute } from '@react-navigation/native'
const ActiveChatTab  = createMaterialTopTabNavigator()
export type RootStackProfileScreenParamList = {
  ACTIVE_CHAT_SCREEN: undefined
  ACTIVE_CHAT_PROFILE_SCREEN: undefined
  //PROFILE_EDIT: undefined
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
 const ActiveChatView = () => {
  const route = useRoute();
  return (
    <ActiveChatTab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Chat Screen':
              iconName = focused ? 'person-outline' : 'person-outline';
              break;
            case 'Chat Profile Screen':
              iconName = focused ? 'visibility' : 'visibility';
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
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
      tabBarOptions={customTabBarStyle}
      initialRouteName="ProfileEdit">
      <ActiveChatTab.Screen
        name="Chat Profile Screen"
        component={SendBirdChat}
        initialParams={route.params}
      />
      <ActiveChatTab.Screen
        name="Chat Screen"
        component={ActiveChatProfileView}
        initialParams={route.params}
      />
    </ActiveChatTab.Navigator>
  );
}
export {ActiveChatView}

