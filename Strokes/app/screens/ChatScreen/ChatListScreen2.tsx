import {FlatList, Image, Platform, Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import { reaction } from 'mobx';
import { navigate, goBack} from "../../navigators"
import { Reactotron } from './../../devtools/ReactotronClient';
import React, { useEffect, useLayoutEffect, useState } from "react"
import {
  getGroupChannelLastMessage,
  getGroupChannelTitle,
} from "@sendbird/uikit-utils"
import {
  GroupChannelPreview,
  Placeholder,
} from "@sendbird/uikit-react-native-foundation"
import { Screen, LoadingActivity, Text} from 'app/components';
import dayjs from "dayjs"
import {
  GroupChannel,
  GroupChannelCollection,
  GroupChannelListOrder,
} from "@sendbird/chat/groupChannel"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

export const ChatListScreen2 = observer(function ChatListScreen(_props) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { matchedProfilStore, authenticationStore, chatStore, matchedProfileStore } = useStores()
  const sdk = chatStore.sdk
  const isSDKConnected = authenticationStore.isSDKConnected
  const [collection, setCollection] = useState<GroupChannelCollection>()
  const [isLoading, setIsLoading] = useState(true) // Initially set to true
  useEffect(() => {
    if (!isSDKConnected || !sdk) {
      setIsLoading(false) // If not connected or no SDK, stop loading
      return
    }

    const collection = sdk.groupChannel.createGroupChannelCollection({
      order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
      limit: 10,
    })

    const updateState = () => {
      setIsLoading(false) // Set loading to false when data is fetched or updated
    }

    collection.setGroupChannelCollectionHandler({
      onChannelsAdded: updateState,
      onChannelsUpdated: updateState,
      onChannelsDeleted: updateState,
    })

    setCollection(collection)
    collection
      .loadMore()
      .then(updateState)
      .catch(() => setIsLoading(false))

    return () => {
      collection.dispose()
    }
  }, [sdk, isSDKConnected])
  const handleRefresh = async () => {
    if (!collection || !sdk) {
      console.log("SDK or collection not available.")
      return
    }
    setIsRefreshing(true) // Show the refresh indicator
    try {
      // You may want to reload your collection here or perform any refresh logic
      await collection.loadMore() // Assuming loadMore refreshes your collection
    } catch (error) {
      console.error("Failed to refresh the group channel collection:", error)
    } finally {
      setIsRefreshing(false) // Hide the refresh indicator
    }
  }

  useEffect(() => {
    // Define the async function within useEffect
    const refreshData = async () => {
      console.log("Number of matched profiles changed, running refresh logic")
      setIsRefreshing(true)
      try {
        await handleRefresh()
      } catch (error) {
        console.error("Error during refresh:", error)
      } finally {
        setIsRefreshing(false) // Ensure you set this to false after refresh
      }
    }

    // Setup reaction
    const disposer = reaction(
      () => matchedProfileStore.matchedProfiles.length, // React only to changes in the length of the array
      refreshData, // Call the async function defined above
    )

    // Cleanup function to dispose of the reaction when the component unmounts
    return () => {
      disposer()
    }
  }, [matchedProfileStore]) // Dependencies should include anything external used in the effect
  const keyExtractor = (item: GroupChannel) => item.url
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
    return <LoadingActivity />
  }

  const listEmptyComponent = (
    <View style={styles.listEmptyComponent}>
      <Placeholder icon={"channels"} message={"No channels"} />
    </View>
  )

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={styles.screenContentContainer}
    >
      <View style={styles.heading}>
        <Text preset="heading" tx="chatScreenList.title" />
      </View>
      <FlatList
        data={collection?.channels || []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={
          isLoading
            ? null
            : async () => {
                if (collection?.hasMore) {
                  setIsLoading(true)
                  await collection.loadMore()
                  setIsLoading(false)
                }
              }
        }
        contentContainerStyle={styles.container}
        ListEmptyComponent={listEmptyComponent}
        onRefresh={handleRefresh} // Add the handler for pull-to-refresh
        refreshing={isRefreshing} // The state that controls the visibility of the refresh indicator
      />
    </Screen>
  )
})
//const useHeaderButtons = () => {
  //const {colors} = useUIKitTheme();
  //const {sdk, setUser} = useRootContext();
  //const {navigation} = useAppNavigation<Routes.GroupChannelList>();

  //useLayoutEffect(() => {
    //const onPressDisconnect = async () => {
      //logger.log('try disconnect');

      //try {
        //if (Platform.OS === 'android') {
          //await sdk.unregisterFCMPushTokenAllForCurrentUser();
          //logger.log('fcm token unregistered');
        //}
        //if (Platform.OS === 'ios') {
          //await sdk.unregisterAPNSPushTokenAllForCurrentUser();
          //logger.log('apns token unregistered');
        //}
      //} catch {
        ////noop
      //}

      //try {
        //await sdk.disconnect();
      //} finally {
        //logger.log('disconnected');
        //authHandler.clarUser();
        //setUser(null);
      //}
    //};

    //const onPressCreateChannel = () => navigation.navigate(Routes.GroupChannelCreate);

    //navigation.setOptions({
      //headerTitle: () => (
        //<View style={styles.headerTitleContainer}>
          //<Text style={styles.headerTitle}>{'Channels'}</Text>
        //</View>
      //),
      //headerLeft: () => {
        //return (
          //<TouchableOpacity onPress={onPressDisconnect}>
            //<Icon icon={'leave'} containerStyle={styles.leaveIcon} />
          //</TouchableOpacity>
        //);
      //},
      //headerRight: () => {
        //return (
          //<TouchableOpacity onPress={onPressCreateChannel}>
            //<Icon icon={'create'} />
          //</TouchableOpacity>
        //);
      //},
    //});
  //}, []);
//};

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

