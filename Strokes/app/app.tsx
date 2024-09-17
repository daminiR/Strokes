/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("./devtools/ReactotronConfig.ts")
}
import "./i18n";
import "./utils/ignoreWarnings";
import { useFonts } from "expo-font";
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { platformServices } from "./services/api/sendbird";
import { MMKVAdapter } from "app/utils/storage/mmkdvAdapter";
import { navigate, resetToInitialState } from "./navigators";
import { SendbirdUIKitContainer } from "@sendbird/uikit-react-native";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import {Platform, AppState,  AppStateStatus, Text} from "react-native";
import { useInitialRootStore } from "./models";
import { AppNavigator, useNavigationPersistence } from "./navigators";
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary";
import * as storage from "./utils/storage";
import { customFontsToLoad } from "./theme";
import Config from "./config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useStores } from "./models";
import { ViewStyle, StyleSheet } from "react-native";
import client from "./services/api/apollo-client";
import { Provider } from "urql";
import { LoadingActivity } from "./components";
import messaging from "@react-native-firebase/messaging"; // Import messaging module
import Notifee, { AndroidImportance, EventType } from '@notifee/react-native';

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE";

// Web linking configuration
const prefix = Linking.createURL("/");
const config = {
  screens: {
    Login: {
      path: "",
    },
    Welcome: "welcome",
    Demo: {
      screens: {
        DemoShowroom: {
          path: "showroom/:queryIndex?/:itemIndex?",
        },
        DemoDebug: "debug",
        DemoPodcastList: "podcast",
        DemoCommunity: "community",
      },
    },
  },
};

// Background message handler
messaging().setBackgroundMessageHandler(async (message) => {
  const isSendbirdNotification = Boolean(message.data.sendbird);
  if (!isSendbirdNotification) return;

  const payload = JSON.parse(message.data.sendbird);

  const channelId = await Notifee.createChannel({
    id: "NOTIFICATION_CHANNEL_ID",
    name: "NOTIFICATION_CHANNEL_NAME",
    importance: AndroidImportance.HIGH,
  });

  await Notifee.displayNotification({
    id: message.messageId,
    title: "New message has arrived!",
    subtitle: `Number of unread messages: ${payload.unread_message_count}`,
    body: payload.message,
    data: payload,
    android: {
      channelId,
      smallIcon: "ic_notification",
      importance: AndroidImportance.HIGH,
    },
  });
});


interface AppProps {
  hideSplashScreen: () => Promise<boolean>;
}
/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
const App: React.FC<AppProps> = observer((props) => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const { hideSplashScreen } = props;
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY);

  const [areFontsLoaded] = useFonts(customFontsToLoad);
  const {matchedProfileStore, chatStore, userStore, tempUserStore, authenticationStore } = useStores();

  const onNotificationInteraction = async (event) => {
    let notificationData;
    if (Platform.OS === "ios") {
      notificationData = event.detail?.notification?.data;
    } else {
      notificationData = event.detail?.notification?.data;
    }
    if (notificationData?.sendbird) {
      const channelUrl = notificationData.sendbird.channel.channel_url;
      if (channelUrl) {
        const matchedUser = matchedProfileStore.findByChannelId(channelUrl);

        chatStore.setChatProfile(matchedUser);
        navigate("ChatTopNavigator");
      }
    }
  };

  useEffect(() => {
    const unsubscribeForeground = Notifee.onForegroundEvent(onNotificationInteraction);
    const unsubscribeBackground = Notifee.onBackgroundEvent(onNotificationInteraction);

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (!tempUserStore.photosAppIsActive && authenticationStore.isAuthenticated) {
        if (appState !== "active" && nextAppState === "active") {
          console.log("App is coming to the foreground. Navigating to the start screen...");
          resetToInitialState();
          //resetChatStackToChatList();
          // TODO when signout this navigate logic is different, but not important right now
          authenticationStore.checkCognitoUserSession();
          //navigate("FaceCard");
        } else if (appState === "active" && nextAppState.match(/inactive|background/)) {
          console.log("App has gone to the background. Disconnecting...");
          //chatStore.disconnect();
          //authenticationStore.setProp("isSDKConnected", false);
          //chatStore.setProp("isLoading", true);
          //navigate("FaceCard");
          // Add your disconnect logic here
        }
        setAppState(nextAppState);
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);


  const { rehydrated } = useInitialRootStore(() => {
    setTimeout(hideSplashScreen, 500);
  });

  if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded) {
    return <LoadingActivity />;
  }

  const linking = {
    prefixes: [prefix],
    config,
  };

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider value={client}>
          <SendbirdUIKitContainer
            appId={process.env.REACT_APP_SENDBIRD_APP_ID}
            chatOptions={{localCacheStorage:MMKVAdapter }}
            platformServices={platformServices}
            userProfile={{
              onCreateChannel: () => {}, // No-op function
            }}
          >
            <BottomSheetModalProvider>
              <ErrorBoundary catchErrors={Config.catchErrors}>
                <GestureHandlerRootView style={$container}>
                  <AppNavigator
                    linking={linking}
                    initialState={initialNavigationState}
                    onStateChange={onNavigationStateChange}
                  />
                </GestureHandlerRootView>
              </ErrorBoundary>
            </BottomSheetModalProvider>
          </SendbirdUIKitContainer>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
});

export default App;

const $container: ViewStyle = {
  flex: 1,
};

