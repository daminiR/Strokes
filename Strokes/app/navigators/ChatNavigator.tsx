import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const userID = "0c951930-a533-4430-a582-5ce7ec6c61bc"
const accessToken = "6572603456b4d9f1b6adec6c283ef5adc6099418"
export function ChatStack() {
  return (
    <SendbirdUIKitContainer
      appId={process.env.REACT_APP_SENDBIRD_APP_ID}
      chatOptions={{ localCacheStorage: AsyncStorage }}
      platformServices={platformServices}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"ChatList"}>
        <Stack.Screen name="ChatTopNavigator" component={ChatTopTabNavigator} />
        <Stack.Screen name="ChatList" component={Screens.ChatListScreen} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </SendbirdUIKitContainer>
  )
}

