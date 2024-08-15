import { observer } from "mobx-react-lite"
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
import { Screen, LoadingActivity, Text } from '../../components';
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

export const ChatListScreen2 = observer(function ChatListScreen(_props) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { matchedProfileStore, authenticationStore, chatStore } = useStores();
  const sdk = chatStore.sdk;
  const isSDKConnected = authenticationStore.isSDKConnected;
  const collection = chatStore.collection;
  const [isLoading, setIsLoading] = useState(false);

  const updateState = async (newCollection) => {
    try {
      console.log("State update triggered, loading more channels", newCollection);
      await newCollection.loadMore();  // Load more channels
      chatStore.setCollection(newCollection);  // Update the chatStore with the new collection
      setIsLoading(false);
      setIsRefreshing(false);  // Stop refreshing in case of an error
      console.log("Collection loaded and set");
    } catch (error) {
      console.error("Failed to load more channels:", error);
      setIsLoading(false);
      setIsRefreshing(false);  // Stop refreshing in case of an error
    }
  };

  const initializeCollection = useCallback(() => {
    if (!isSDKConnected || !sdk) {
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }
      setIsLoading(false);
      setIsRefreshing(false);

    const newCollection = sdk.groupChannel.createGroupChannelCollection({
      order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
      limit: 10,
      hiddenChannelFilter: HiddenChannelFilter.UNHIDDEN,
      includeEmptyChannel: true,
    });

    newCollection.setGroupChannelCollectionHandler({
      onChannelsAdded: () => {
        console.log("Channels added");
        updateState(newCollection);
      },
      onChannelsUpdated: () => {
        console.log("Channels updated", isRefreshing);
        updateState(newCollection);
      },
      onChannelsDeleted: () => {
        console.log("Channels deleted");
        updateState(newCollection);
      },
      onChannelChanged: (channel: any) => {
        console.log("Channel changed:", channel);
        updateState(newCollection);
      },
    });

    newCollection.loadMore()
      .then(() => {
        chatStore.setCollection(newCollection);
        console.log("Collection loaded and set");
      })
      .catch((error) => {
        console.error("Failed to load more channels:", error);
        setIsLoading(false);
        setIsRefreshing(false); // Stop refreshing in case of an error
      });

    return () => {
      newCollection?.dispose();
    };
  }, [sdk, isSDKConnected, chatStore]);

  useFocusEffect(
    useCallback(() => {
      const disposer = initializeCollection();
      return () => {
        disposer?.();
      };
    }, [initializeCollection])
  );

  const handleRefresh = async () => {
    console.log("Refresh triggered");
    setIsRefreshing(true);
    initializeCollection();
  };

  useFocusEffect(
    useCallback(() => {
      const checkAndInitialize = async () => {
        if (!isSDKConnected) {
          console.log("SDK not connected, checking session");
          await authenticationStore.checkCognitoUserSession(false);
        }
        initializeCollection();
      };

      checkAndInitialize();
    }, [initializeCollection, isSDKConnected, authenticationStore])
  );

  useEffect(() => {
    const refreshData = async () => {
      console.log("Matched profiles changed, refreshing data");
      setIsRefreshing(true);
      try {
        await handleRefresh();
      } catch (error) {
        console.error("Error during refresh:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    const disposer = reaction(
      () => matchedProfileStore.matchedProfiles.length,
      refreshData,
    );

    return () => {
      disposer();
    };
  }, [matchedProfileStore, handleRefresh]);

  const renderItem = ({ item }: { item: GroupChannel | null }) => {
    if (!item) {
      return null;
    }

    const onPressChannel = () => {
      const matchedUser = matchedProfileStore.findByChannelId(item.url);
      chatStore.setChatProfile(matchedUser);
      navigate("ChatTopNavigator");
    };

    const matchedUser = matchedProfileStore.findByChannelId(item.url);
    const title = matchedUser ? matchedUser.firstName || "Unknown User" : getGroupChannelTitle(sdk.currentUser!.userId, item);
    const coverUrl = matchedUser && matchedUser.imageSet?.length > 0
      ? matchedUser.imageSet[0].imageURL
      : item.coverUrl || "https://static.sendbird.com/sample/cover/cover_11.jpg";

    const lastMessage = item.lastMessage ? item.lastMessage.message : "No description available";
    const lastMessageTime = item.lastMessage ? dayjs(item.lastMessage.createdAt).format("YYYY-MM-DD") : "Unavailable";

    const isFileMessage = item.lastMessage && typeof item.lastMessage.isFileMessage === 'function'
      ? item.lastMessage.isFileMessage()
      : false;

    return (
      <TouchableOpacity onPress={onPressChannel}>
        <GroupChannelPreview
          title={title}
          badgeCount={item.unreadMessageCount}
          body={lastMessage}
          bodyIcon={isFileMessage ? "file-document" : undefined}
          coverUrl={coverUrl}
          titleCaption={lastMessageTime}
          frozen={item.isFrozen}
          notificationOff={item.myPushTriggerOption === "off"}
        />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoadingActivity />;
  }

  const listEmptyComponent = (
    <View style={$emptyState}>
      <Placeholder icon={"channels"} message={"No channels"} />
    </View>
  );

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
        onEndReachedThreshold={0.2}
        onEndReached={
          isLoading
            ? null
            : async () => {
              if (collection?.hasMore) {
                setIsLoading(true);
                try {
                  await collection.loadMore();
                  chatStore.setCollection(collection);
                } catch (error) {
                  console.error("Failed to load more channels:", error);
                } finally {
                  setIsLoading(false);
                }
              }
            }
        }
        refreshing={isRefreshing}
        estimatedItemSize={177}
        numColumns={1}
        ListEmptyComponent={listEmptyComponent}
        onRefresh={handleRefresh}
        renderItem={renderItem}
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

