import React from 'react'
import {ActiveChatScreen} from '@components'
import { createMaterialTopTabNavigator  } from '@react-navigation/material-top-tabs';
import {tabBarSize} from '@constants'
import {Icon} from 'react-native-elements'
import { useRoute, useNavigation } from '@react-navigation/native'
const ActiveChatTab  = createMaterialTopTabNavigator()
export type RootStackProfileScreenParamList = {
  ACTIVE_CHAT_SCREEN: undefined
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
            case 'Profile Edit':
              iconName = focused ? 'person-outline' : 'person-outline';
              break;
            case 'Profile View':
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
        name="Chat Screen"
        component={ActiveChatScreen}
        initialParams={route.params}
      />
    </ActiveChatTab.Navigator>
  );
}


export {ActiveChatView}

