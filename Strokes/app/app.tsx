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
import { resetChatStackToChatList, navigate, resetToInitialState } from "./navigators";
import { SendbirdUIKitContainer } from "@sendbird/uikit-react-native";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { AppState, AppStateStatus } from "react-native";
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
//import { Toast } from "react-native-toast-message";
//import NetInfo from "@react-native-community/netinfo";

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
  const { chatStore, userStore, tempUserStore, authenticationStore } = useStores();

  const logCurrentState = async () => {
    const currentState = await storage.getString(ROOT_STATE_STORAGE_KEY);
    console.log("Current State:", currentState);
  };

  // Add the listener for push notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", remoteMessage);
      // Here, you can add logic to update the chat list or show a notification
      // For example, you might want to call a function to refresh the chat list
      await chatStore.handleNewMessage(remoteMessage);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (!tempUserStore.photosAppIsActive && authenticationStore.isAuthenticated) {
        if (appState !== "active" && nextAppState === "active") {
          console.log("App is coming to the foreground. Navigating to the start screen...");
          resetToInitialState();
          resetChatStackToChatList();
          // TODO when signout this navigate logic is different, but not important right now
          authenticationStore.checkCognitoUserSession();
          navigate("FaceCard");
        } else if (appState === "active" && nextAppState.match(/inactive|background/)) {
          console.log("App has gone to the background. Disconnecting...");
          chatStore.disconnect();
          authenticationStore.setProp("isSDKConnected", false);
          navigate("FaceCard");
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

  useEffect(() => {
    logCurrentState();
  }, []);

  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.

    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
    setTimeout(hideSplashScreen, 500);
  });

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  // Conditionally render loading screen until everything is ready
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
            chatOptions={{ localCacheStorage:MMKVAdapter }}
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
const $container: ViewStyle = {
  flex: 1,
};

