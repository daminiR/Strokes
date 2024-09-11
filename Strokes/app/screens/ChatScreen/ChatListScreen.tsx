import { observer } from "mobx-react-lite"
import { AppState, AppStateStatus } from 'react-native';
import React, {useEffect, useState, useCallback} from "react"
import messaging from '@react-native-firebase/messaging';
import {ActivityIndicator, ViewStyle, TextStyle, ImageStyle, Image, TouchableOpacity, View, StyleSheet, Dimensions} from "react-native"
import {reaction} from 'mobx';
import { navigate } from "../../navigators"
import {
  getGroupChannelTitle,
  getGroupChannelLastMessage
} from "@sendbird/uikit-utils"
import {
  GroupChannelPreview,
  Placeholder,
} from "@sendbird/uikit-react-native-foundation"
import { Screen, LoadingActivity, Text, ChatListItem} from '../../components';
import dayjs from "dayjs"
import { useFocusEffect } from '@react-navigation/native';
import {
  GroupChannel,
  HiddenChannelFilter,
  GroupChannelListOrder,
} from "@sendbird/chat/groupChannel"
import {
  ListView,
} from "../../components"
import { useStores } from "../../models"
import storage from "app/utils/storage/mmkvStorage"

const screenWidth = Dimensions.get('window').width; // Import Dimensions from 'react-native'
export const cardMargin = 16;
export const cardWidth = (screenWidth - (3 * cardMargin)) / 2; // For two columns, considering margin as spacing

const $item: ViewStyle = {
  padding: 0,
  marginBottom: cardMargin,
  marginHorizontal: cardMargin / 2,
  height: 200,
  width: cardWidth,
  borderRadius: 10,
};

const $itemThumbnail: ImageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: 10,
};

const $metadata: TextStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
};

const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $listContentContainer: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 32,
  paddingBottom: 32,
};

const $heading: ViewStyle = {
  marginBottom: 16,
}

const $emptyState: ViewStyle = {
  marginTop: 32,
}



export const ChatListScreen = observer(function ChatListScreen(_props) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const { matchedProfileStore, userStore, authenticationStore, chatStore } = useStores();
  const sdk = chatStore.sdk;
  const isSDKConnected = authenticationStore.isSDKConnected;
  const collection = chatStore.collection;
  const [isLoading, setIsLoading] = useState(true);

  // Debounced loading to prevent multiple triggers
  let isEndReachedCalledDuringMomentum = false;

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log("App is in the foreground, attempting to reconnect...");
        setIsLoading(true);

        if (!sdk || sdk.getConnectionState() !== 'OPEN') {
          try {
            await chatStore.connect(userStore._id, userStore.firstName, userStore.accessToken);
            console.log("Reconnection successful");
            await initializeCollection();
          } catch (error) {
            console.error("Failed to reconnect:", error);
            setIsLoading(false);
          }
        } else {
          console.log("SDK is already connected.");
        }
      } else if (nextAppState.match(/inactive|background/)) {
        console.log("App is in the background, disconnecting...");
        await chatStore.disconnect();
        setIsLoading(true);
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, chatStore, userStore]);

  const updateState = async (newCollection) => {
    try {
      await newCollection.loadMore();
      chatStore.setCollection(newCollection);
      setIsLoading(false);
      setIsRefreshing(false);
      console.log("Collection updated and loaded");
    } catch (error) {
      console.error("Failed to update state:", error);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const initializeCollection = useCallback(async () => {
    if (!isSDKConnected || !sdk) {
      setIsLoading(false);
      setIsRefreshing(false);
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
        onChannelsAdded: () => updateState(newCollection),
        onChannelsUpdated: () => updateState(newCollection),
        onChannelsDeleted: () => updateState(newCollection),
      });

      await newCollection.loadMore();
      chatStore.setCollection(newCollection);
      setIsLoading(false);
      setIsRefreshing(false);
      console.log("Collection loaded successfully");
    } catch (error) {
      console.error("Failed to initialize collection:", error);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [sdk, chatStore, userStore, authenticationStore, isSDKConnected]);

  useFocusEffect(
    useCallback(() => {
      const disposer = initializeCollection();
      return () => {
        //disposer?.();
      };
    }, [initializeCollection])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    initializeCollection();
  };

  const renderItem = ({ item }: { item: GroupChannel | null }) => {
    const onPressChannel = () => {
      const matchedUser = matchedProfileStore.findByChannelId(item.url);
      chatStore.setChatProfile(matchedUser);
      navigate('ChatTopNavigator');
    };

    return (
      <ChatListItem
        item={item}
        matchedProfileStore={matchedProfileStore}
        chatStore={chatStore}
        sdk={sdk}
        onPress={onPressChannel}
      />
    );
  };

  const onEndReachedHandler = async () => {
    if (!isEndReachedCalledDuringMomentum && collection?.hasMore && !isLoading) {
      setIsLoading(true);
      try {
        await collection.loadMore();
        chatStore.setCollection(collection);
      } catch (error) {
        console.error("Failed to load more channels:", error);
      } finally {
        setIsLoading(false);
        isEndReachedCalledDuringMomentum = true;
      }
    }
  };

  if (isLoading) {
    return <LoadingActivity />;
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={$screenContentContainer}
    >
      <View style={$heading}>
        <Text preset="heading" tx="chatScreenList.title" />
      </View>
      <ListView<GroupChannel>
        contentContainerStyle={$listContentContainer}
        data={collection?.channels || []}
        extraData={collection?.channels.length}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        renderItem={renderItem}
        onEndReached={onEndReachedHandler}
        onEndReachedThreshold={0.2}
        onMomentumScrollBegin={() => {
          isEndReachedCalledDuringMomentum = false;
        }}
        estimatedItemSize={177}
        numColumns={1}
        ListEmptyComponent={
          <View style={$emptyState}>
            <Placeholder icon={"channels"} message={"No channels"} />
          </View>
        }
      />
    </Screen>
  );
});


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  listEmptyComponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveIcon: {
    transform: [{rotate: '180deg'}],
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleIcon: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  screenContentContainer: {
    flex: 1,
  },
  heading: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

