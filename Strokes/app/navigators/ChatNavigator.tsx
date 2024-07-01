import React from 'react';
import { MMKVAdapter } from 'app/utils/storage/mmkdvAdapter';
import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { platformServices } from "../services/api/sendbird"
import { SendbirdChatProvider } from "@sendbird/uikit-react-native"
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

export type ChatListStackParamList = {
  ChatList: undefined
  ChatTopNavigator: undefined
  ChatSettings: undefined
  ChatReport: undefined
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type ChatListStackScreenProps<T extends keyof ChatListStackParamList> = NativeStackScreenProps<
  ChatListStackParamList,
  T
>

const Stack = createNativeStackNavigator<ChatListStackParamList>()

export function ChatStack() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"ChatList"}>
        <Stack.Screen name="ChatTopNavigator" component={ChatTopTabNavigator} />
        <Stack.Screen name="ChatList" component={Screens.ChatListScreen2} />
        <Stack.Screen name="ChatSettings" component={Screens.ChatSettingsScreen} />
        <Stack.Screen name="ChatReport" component={Screens.ChatReportScreen} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
  )
}

