import {useEffect, useState, useCallback} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useStores} from '../models';

export const useAppStateHandler = () => {
  const {chatStore, authenticationStore} = useStores();
  const [appState, setAppState] = useState(AppState.currentState);
  const [isLoading, setIsLoading] = useState(false);
  const [disconnectTimer, setDisconnectTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastBackgroundTime, setLastBackgroundTime] = useState<number | null>(null);
  const sdk = chatStore.sdk;
  const isSDKConnected = authenticationStore.isSDKConnected;
  const GRACE_PERIOD_MS = 10000; // 10 seconds grace period

  // Initialize chat collection
  const initializeCollection = useCallback(async () => {
    if (!isSDKConnected || !sdk) {
      setIsLoading(false);
      return;
    }
    try {
      const user = await sdk.currentUser;
      if (!user) {
        console.log("User not authenticated, reconnecting...");
        await authenticationStore.checkCognitoUserSession();
      }
      const newCollection = sdk.groupChannel.createGroupChannelCollection({
        order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
        limit: 10,
        hiddenChannelFilter: HiddenChannelFilter.UNHIDDEN,
        includeEmptyChannel: true,
      });

      newCollection.setGroupChannelCollectionHandler({
        onChannelsAdded: () => chatStore.setCollection(newCollection),
        onChannelsUpdated: () => chatStore.setCollection(newCollection),
        onChannelsDeleted: () => chatStore.setCollection(newCollection),
      });

      await newCollection.loadMore();
      chatStore.setCollection(newCollection);
      setIsLoading(false);
      console.log("Collection initialized successfully");
    } catch (error) {
      console.error("Failed to initialize collection:", error);
      setIsLoading(false);
    }
  }, [sdk, chatStore, authenticationStore, isSDKConnected]);

  // Handle app state changes (foreground/background)
  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    const currentTime = Date.now();

    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App is coming to the foreground
      const timeInBackground = lastBackgroundTime ? currentTime - lastBackgroundTime : GRACE_PERIOD_MS + 1;

      if (timeInBackground > GRACE_PERIOD_MS) {
        console.log("App is coming to the foreground. Revalidating session...");
        setIsLoading(true);
        clearTimeout(disconnectTimer as NodeJS.Timeout); // Cancel disconnect if any
        if (authenticationStore.isAuthenticated) {
          await authenticationStore.checkCognitoUserSession();
        }
        if (!isSDKConnected) {
          try {
            await chatStore.connect(userStore._id, userStore.firstName, userStore.accessToken);
            console.log("Reconnection successful");
            await initializeCollection();
          } catch (error) {
            console.error("Failed to reconnect:", error);
          } finally {
            setIsLoading(false);
          }
        } else {
          console.log("SDK is already connected.");
          setIsLoading(false);
        }
      } else {
        console.log("App came back quickly; skipping reconnection.");
      }
    } else if (nextAppState.match(/inactive|background/)) {
      // App is going to the background
      console.log("App is going to the background, scheduling disconnect...");
      setLastBackgroundTime(currentTime); // Track time app went to background
      const timer = setTimeout(async () => {
        try {
          console.log("Grace period ended. Disconnecting...");
          await chatStore.disconnect();
        } catch (error) {
          console.error("Disconnection failed:", error);
        }
      }, GRACE_PERIOD_MS);

      setDisconnectTimer(timer);
    }

    setAppState(nextAppState);
  }, [appState, chatStore, authenticationStore, isSDKConnected, disconnectTimer, lastBackgroundTime, initializeCollection]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
      if (disconnectTimer) {
        clearTimeout(disconnectTimer);
      }
    };
  }, [handleAppStateChange, disconnectTimer]);

  return {isLoading, appState};
};
