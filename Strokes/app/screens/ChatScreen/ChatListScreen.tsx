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
import {GroupChannelPreview} from "@sendbird/uikit-react-native-foundation"
import { type ContentStyle } from "@shopify/flash-list"
import {
  EmptyState,
  ListView,
  Screen,
  Text,
  Button,
  LikedByUserModal,
} from "../../components"
import { isRTL, translate } from "../../i18n"
import { useStores } from "../../models"
import { Episode } from "../../models/Episode"
import { colors, typography, spacing } from "../../theme"
import { useFocusEffect } from '@react-navigation/native';
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
    return null;  // This ensures that no header is rendered
};

const GroupChannelListFragment = createGroupChannelListFragment({
  Header: CustomHeaderComponent,
  //List:  ListCompenent
})
const userID = "0c951930-a533-4430-a582-5ce7ec6c61bc"
const accessToken = "6572603456b4d9f1b6adec6c283ef5adc6099418"

export const ChatListScreen = observer(() => {
  const { chatStore, matchedProfileStore} = useStores()

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
        onPressCreateChannel={(channelType) => {
          //navigation.navigate(Routes.GroupChannelCreate, { channelType });
        }}
        onPressChannel={(channel) => {
          const matchedUser = matchedProfileStore.findByChannelId(channel.url);
          chatStore.setChatProfile(matchedUser)
          navigate("ChatTopNavigator")
        }}
        // Optionally customize query parameters
        // query={{
        //   includeEmpty: true,
        //   includeFrozen: false,
        // }}
      renderGroupChannelPreview={({ channel, onPress}) => {
          const matchedUser = matchedProfileStore.findByChannelId(channel.url);
          if (!matchedUser) {
            // Optionally return null or a placeholder if no user is matched
            return null;
          }
          const lastMessage = channel.lastMessage.message
          const lastMessageTime = formatTimestamp(channel.lastMessage.createdAt);
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
});

const styles = StyleSheet.create({
  screenContentContainer: {
    flex: 1,
  },
  heading: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
});


