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
import {ChatTopTabNavigator} from './ChatTopTabNavigator'
import * as Screens from "app/screens"
// Import other screens as needed

export type ProfileStackParamList = {
  ChatList: undefined
  ChatTopNavigator: undefined
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

export function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
      initialRouteName={"ChatList"}
    >
      <Stack.Screen name="ChatTopNavigator" component={ChatTopTabNavigator} />
      <Stack.Screen name="ChatList" component={Screens.ChatListScreen} />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
}

