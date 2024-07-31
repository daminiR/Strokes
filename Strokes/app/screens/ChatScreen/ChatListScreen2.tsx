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
  const [isLoading, setIsLoading] = useState(true);

  const initializeCollection = useCallback(() => {
    if (!isSDKConnected || !sdk) {
      setIsLoading(false);
      return;
    }
    const newCollection = sdk.groupChannel.createGroupChannelCollection({
      order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
      limit: 10,
      hiddenChannelFilter: HiddenChannelFilter.UNHIDDEN,
    });
    console.log("Creating new collection", typeof newCollection);

    const updateState = () => {
      setIsLoading(false);
      setIsRefreshing(false)
    };

    newCollection.setGroupChannelCollectionHandler({
      onChannelsAdded: updateState,
      onChannelsUpdated: updateState,
      onChannelsDeleted: updateState,
      onMessageReceived: updateState,  // Added to refresh on new message received
    });

    newCollection.loadMore()
      .then(() => {
        updateState();
        chatStore.setCollection(newCollection);
      })
      .catch((error) => {
        console.error("Failed to load more channels:", error);
        setIsLoading(false);
      });

    return () => {
      newCollection?.dispose();
    };
  }, [sdk, isSDKConnected, chatStore]);

  useFocusEffect(
    useCallback(() => {
      initializeCollection();
    }, [initializeCollection])
  );
  // Refresh collection when a push notification is received
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      initializeCollection();  // Re-initialize collection on new message
    });

    return () => {
      unsubscribe();
    };
  }, [initializeCollection]);

const handleRefresh = async () => {
    setIsRefreshing(true);
    initializeCollection();
};

  useEffect(() => {
    const refreshData = async () => {
      console.log("Number of matched profiles changed, running refresh logic");
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
  }, [matchedProfileStore]);

  const keyExtractor = (item: GroupChannel) => item.url;

  const renderItem = ({ item }: { item: GroupChannel }) => {
    const onPressChannel = (): any => {
      const matchedUser = matchedProfileStore.findByChannelId(item.url)
      chatStore.setChatProfile(matchedUser)
      navigate("ChatTopNavigator")
    }

    // Fetch the matched user profile based on the channel ID
    const matchedUser = matchedProfileStore.findByChannelId(item.url)

    // Determine the title to be used in the preview
    const title = matchedUser
      ? matchedUser.firstName || "Unknown User"
      : getGroupChannelTitle(sdk.currentUser!.userId, item)

    // Determine the cover image URL to be used in the preview
    const coverUrl =
      matchedUser && matchedUser.imageSet && matchedUser.imageSet.length > 0
        ? matchedUser.imageSet[0].imageURL
        : item.coverUrl || "https://static.sendbird.com/sample/cover/cover_11.jpg" // Fallback to default cover image

    // Determine the last message and its timestamp
    const lastMessage = item.lastMessage ? item.lastMessage.message : "No description available"
    const lastMessageTime = item.lastMessage
      ? dayjs(item.lastMessage.createdAt).format("YYYY-MM-DD")
      : "Unavailable"

    return (
      <TouchableOpacity onPress={onPressChannel}>
        <GroupChannelPreview
          title={title}
          badgeCount={item.unreadMessageCount}
          body={getGroupChannelLastMessage(item)}
          bodyIcon={item.lastMessage?.isFileMessage() ? "file-document" : undefined}
          coverUrl={coverUrl}
          titleCaption={dayjs(item.createdAt).format("YYYY-MM-DD")}
          frozen={item.isFrozen}
          notificationOff={item.myPushTriggerOption === "off"}
        />
      </TouchableOpacity>
    )
  }

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
                  await collection.loadMore();
                  chatStore.setCollection(collection);
                  setIsLoading(false);
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

