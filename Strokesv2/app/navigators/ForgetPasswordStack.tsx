import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import * as Screens from "app/screens" // Import the screens we just created

export type ForgotPasswordStackParamList = {
  ForgotPasswordEnterDetails: undefined
  ForgotPasswordVerification: undefined
  ForgotPasswordNewPassword: undefined
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = ["ForgotPasswordEnterDetails"]

export type ForgotPasswordStackScreenProps<T extends keyof ForgotPasswordStackParamList> = NativeStackScreenProps<
  ForgotPasswordStackParamList,
  T
>

const Stack = createNativeStackNavigator<ForgotPasswordStackParamList>()

export function ForgotPasswordStack() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"ForgotPasswordEnterDetails"}>
        <Stack.Screen name="ForgotPasswordEnterDetails" component={Screens.ForgotPasswordEnterDetailsScreen} />
        <Stack.Screen name="ForgotPasswordVerification" component={Screens.ForgotPasswordVerificationScreen} />
        <Stack.Screen name="ForgotPasswordNewPassword" component={Screens.ForgotPasswordNewPasswordScreen} />
      </Stack.Navigator>
  )
}

