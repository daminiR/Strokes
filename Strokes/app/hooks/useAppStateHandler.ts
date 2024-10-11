import {useEffect, useState, useCallback} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useStores} from '../models'; // Adjust this import based on your project structure

export const useAppStateHandler = () => {
  const {chatStore, userStore, authenticationStore, tempUserStore} = useStores();
  const [appState, setAppState] = useState(AppState.currentState);
  const [isLoading, setIsLoading] = useState(false);
  const sdk = chatStore.sdk;
  const isSDKConnected = authenticationStore.isSDKConnected;

  // Initialize the chat collection for channels
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
  }, [sdk, chatStore, userStore, authenticationStore, isSDKConnected]);

  // Handle app state changes (foreground/background)
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App is coming to the foreground
      console.log("App is coming to the foreground. Revalidating session...");
      setIsLoading(true);

      // Check if the session is still valid every time the app comes to the foreground
      if (authenticationStore.isAuthenticated) {
        await authenticationStore.checkCognitoUserSession();
      }

      if (!sdk) {
        try {
          await chatStore.connect(userStore._id, userStore.firstName, userStore.accessToken);
          console.log("Reconnection successful");
          await initializeCollection(); // Initialize the collection after reconnection
        } catch (error) {
          console.error("Failed to reconnect:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("SDK is already connected.");
        setIsLoading(false);
      }
    } else if (nextAppState.match(/inactive|background/)) {
      // App is going to the background
      console.log("App is going to the background, disconnecting...");
      try {
        await chatStore.disconnect();
      } catch (error) {
        console.error("Disconnection failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [appState, chatStore, userStore, initializeCollection, authenticationStore]);

  return {isLoading, appState};
};

