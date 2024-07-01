import { observer } from "mobx-react-lite"
import { format, isToday, isYesterday, subDays } from 'date-fns';
import { navigate, goBack} from "../../navigators"
import React, { useCallback, ComponentType, FC, useEffect, useState, useMemo } from "react"
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ImageStyle,
  TextStyle,
  StyleSheet,
  View,
  ViewStyle,
  Dimensions,
} from "react-native"
import { GroupChannelPreview } from "@sendbird/uikit-react-native-foundation"
import {
  LoadingActivity,
  EmptyState,
  ListView,
  Screen,
  Text,
  Button,
  LikedByUserModal,
} from "../../components"
import { colors } from "../../theme"
import { ChatListStackScreenProps } from "../navigators"
import { useStores } from "../../models"
import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM dd');
  }
}

const CustomHeaderComponent = () => {
  return null // This ensures that no header is rendered
}
const CustomHeaderComponent2 = () => {
  return LoadingActivity // This ensures that no header is rendered
}
const GroupChannelListFragment = createGroupChannelListFragment({
    StatusLoading: () => <LoadingActivity message="Loading..."/>,
    Header: CustomHeaderComponent,
    //List:  ListCompenent
  })


const accessToken = "a168129d92c66c9657aa6021871abf93fe546c45"
interface ChatListScreen extends ChatListStackScreenProps<"ChatList"> {}

export const ChatListScreen: FC<ChatListScreen> = observer(function ChatListScreen(_props) {
  const { matchedStore, userStore,authenticationStore, chatStore, matchedProfileStore } = useStores()
  const [isInitialized, setIsInitialized] = useState(false)
  const initializeSDK = async () => {
    try {
      await chatStore.initializeSDK()
      await chatStore.connect(userStore.userID, userStore.firstName, accessToken)
      setIsInitialized(true)
      console.log("Sendbird initializated:")
    } catch (error) {
      console.error("Sendbird initialization error:", error)
    }
  }
  useEffect(() => {
    initializeSDK()
  }, []) // Empty dependency array, initialization runs only once

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={styles.screenContentContainer}
    >
      <View style={styles.heading}>
        <Text preset="heading" tx="chatScreenList.title" />
      </View>
      <GroupChannelListFragment
        onPressChannel={(channel) => {
          const matchedUser = matchedProfileStore.findByChannelId(channel.url)
          chatStore.setChatProfile(matchedUser)
          navigate("ChatTopNavigator")
        }}
        renderGroupChannelPreview={({ channel, onPress }) => {
          const matchedUser = matchedProfileStore.findByChannelId(channel.url)
          if (!matchedUser) {
            // Optionally return null or a placeholder if no user is matched
            return null
          }
          const lastMessage = channel.lastMessage.message
          const lastMessageTime = formatTimestamp(channel.lastMessage.createdAt)
          return (
            <TouchableOpacity onPress={onPress}>
              <GroupChannelPreview
                title={matchedUser.firstName || "Unknown User"}
                titleCaption={lastMessageTime || "Unavailable"}
                coverUrl={matchedUser.imageSet[0]?.imageURL || "default_profile_image.png"}
                body={lastMessage || "No description available"}
                badgeCount={channel.unreadMessageCount}
              />
            </TouchableOpacity>
          )
        }}
      />
    </Screen>
  )
})

const styles = StyleSheet.create({
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


