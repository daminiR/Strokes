import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { createStackNavigator } from '@react-navigation/stack';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import Config from "../config"
import {ProfileTopTabNavigator} from './ProfileTopTabNavigator'
import * as Screens from "app/screens"
// Import other screens as needed

export type ProfileStackParamList = {
  ProfileWelcome: undefined
  ProfilePreview: undefined
  ProfileUpdate: undefined
  ProfileTopTabNavigator: undefined
  SingleUpdate: undefined
  Settings: undefined
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = NativeStackScreenProps<
  ProfileStackParamList,
  T
>

const Stack = createNativeStackNavigator<ProfileStackParamList>()

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
      initialRouteName={"ProfileWelcome"}
    >
      <Stack.Screen name="ProfileWelcome" component={Screens.ProfileWelcomeScreen} />
      <Stack.Screen name="SingleUpdate" component={Screens.SingleUpdateScreen} />
      <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
      <Stack.Screen name="ProfileTopTabNavigator" component={ProfileTopTabNavigator} />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
}

