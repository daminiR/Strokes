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
import { useAppStateHandler } from "./hooks/useAppStateHandler";
import { platformServices } from "./services/api/sendbird";
import { MMKVAdapter } from "app/utils/storage/mmkdvAdapter";
import { navigate, resetToInitialState } from "./navigators";
import { SendbirdUIKitContainer } from "@sendbird/uikit-react-native";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { Platform, AppState, AppStateStatus, Text, LogBox } from "react-native";
import { useInitialRootStore } from "./models";
import { AppNavigator, useNavigationPersistence } from "./navigators";
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary";
import * as storage from "./utils/storage";
import { customFontsToLoad } from "./theme";
import Config from "./config";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {useStores} from "./models";
import {ViewStyle, StyleSheet} from "react-native";
import {publicClient} from "./services/api/apollo-client";
import { ApolloProvider } from '@apollo/client';
import { LoadingActivity } from "./components";
import messaging from "@react-native-firebase/messaging"; // Import messaging module
import Notifee, { AndroidImportance, EventType } from '@notifee/react-native';

LogBox.ignoreAllLogs(); // Ignore all log notifications, including warnings

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
  const { hideSplashScreen } = props;
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY);

  const [areFontsLoaded] = useFonts(customFontsToLoad);
  //const { isLoading } = useAppStateHandler(); // Using your custom hook
  const { matchedProfileStore, chatStore, authenticationStore} = useStores();
  const onNotificationInteraction = async (event) => {
    let notificationData;

    // Get the notification data based on the platform
    if (Platform.OS === "ios") {
      notificationData = event.detail?.notification?.data;
    } else {
      notificationData = event.detail?.notification?.data;
    }

    // Check if it's a Sendbird notification
    if (notificationData?.sendbird) {
      const channelUrl = notificationData.sendbird.channel.channel_url;

      if (channelUrl) {
        const matchedUser = matchedProfileStore.findByChannelId(channelUrl);

        // Set the chat profile and navigate
        chatStore.setChatProfile(matchedUser);
        navigate("ChatTopNavigator");

        // Reset the badge count after the notification is handled
        await Notifee.setBadgeCount(0);
        console.log('Badge count reset after notification interaction');
      }
    }
  };
   const [apolloClient, setApolloClient] = useState(publicClient);

  // Effect to switch Apollo Client based on authentication state
  // Effect to check authentication and switch to the private client when available
  useEffect(() => {
    if (authenticationStore.isAuthenticated && authenticationStore.apolloClient) {
      // Switch to the private (authenticated) Apollo client
      setApolloClient(authenticationStore.apolloClient);
    } else {
      // Use public client when user is not authenticated
      setApolloClient(publicClient);
    }
  }, [authenticationStore.isAuthenticated, authenticationStore.apolloClient]);

  useEffect(() => {
    //authenticationStore.signOut()
  }, []);

  useEffect(() => {
    const unsubscribeForeground = Notifee.onForegroundEvent(onNotificationInteraction);
    const unsubscribeBackground = Notifee.onBackgroundEvent(onNotificationInteraction);

    return () => {
      unsubscribeForeground();
      //unsubscribeBackground();
    };
  }, []);
  const { rehydrated } = useInitialRootStore(() => {
    setTimeout(hideSplashScreen, 500);
  });

  if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded ) {
    return <LoadingActivity message="Loading App" />;
  }
  if (authenticationStore.isRefreshing) {
    return <LoadingActivity message="Loading Refresh" />;
  }

  const linking = {
    prefixes: [prefix],
    config,
  };

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ApolloProvider client={apolloClient}>
          <SendbirdUIKitContainer
            appId={process.env.REACT_APP_SENDBIRD_APP_ID}
            chatOptions={{ localCacheStorage: MMKVAdapter }}
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
        </ApolloProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
});

export default App;

const $container: ViewStyle = {
  flex: 1,
};
