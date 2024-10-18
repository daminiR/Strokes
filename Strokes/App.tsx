import "@expo/metro-runtime"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import App from "./app/app"
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "AsyncStorage store is deprecated due to the small size limit. Please use MMKVStorage store instead."
]);

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default IgniteApp
