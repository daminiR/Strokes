import { observer } from "mobx-react-lite"
import { navigate, goBack} from "../../navigators"
import React, { ComponentType, FC, useEffect, useState, useMemo } from "react"
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  Dimensions,
} from "react-native"
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

export const ChatListScreen = observer(
  function ChatListScreen(_props) {
    const { episodeStore } = useStores()
    const { matchedProfileStore, mongoDBStore } = useStores()
    const [refreshing, setRefreshing] = React.useState(false)
    const [isSwiping, setIsSwiping] = useState(false);
    const [isLoading, setIsLoading] = React.useState(false)
    const [page, setPage] = React.useState(1); // Pagination state

    /// Fetch liked IDs whenever the screen is focused
    useFocusEffect(
      React.useCallback(() => {
        let isActive = true
        const fetchLikedIds = async () => {
          if (isActive) {
            try {
              setIsLoading(true)
              await mongoDBStore.queryMatchedUserProfiles(1, 16)
              setIsLoading(false)
            } catch (error) {
              console.error("Failed to fetch liked IDs on focus:", error)
            }
          }
        }
        fetchLikedIds()
        return () => setIsLoading(false)
      }, []),
    )
const getMoreData = async () => {
  if (!isLoading) {
    setIsLoading(true);  // Indicate loading new data

    const nextPage = page + 1;  // Calculate the next page number
    const itemsPerPage = 16;  // Define items per page
    console.log(nextPage, itemsPerPage)

    try {
      const newProfiles = await mongoDBStore.queryMatchedUserProfiles(nextPage, itemsPerPage);

      if (newProfiles.length > 0) {
        matchedProfileStore.appendMatchedProfiles(newProfiles);  // Append new profiles without resetting the existing ones
        setPage(nextPage);  // Update the current page only if new data was fetched
      }
    } catch (error) {
      console.error("Failed to fetch additional liked profiles:", error);
    }

    setIsLoading(false);  // Reset loading state
  }
};
    const manualRefresh = async () => {
      setRefreshing(true)
      setIsLoading(true)
      await mongoDBStore.queryMatchedUserProfiles(1, 8) // Always fetch first page on refresh
      setPage(1) // Reset page to 1
      setIsLoading(false)
      setRefreshing(false)
    }
    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <ListView<Episode>
          contentContainerStyle={$listContentContainer}
          data={matchedProfileStore.matchedProfiles.slice()}
          extraData={matchedProfileStore.matchedProfiles.length}
          onEndReachedThreshold={0.4}
          onEndReached={getMoreData}
          refreshing={refreshing}
          estimatedItemSize={177}
          numColumns={1}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : matchedProfileStore.matchedProfiles.length > 0 ? null : (
              <EmptyState
                preset="generic"
                style={$emptyState}
                headingTx="likedByUsers.noLikedProfiles.heading"
                contentTx="likedByUsers.noLikedProfiles.content"
                imageStyle={$emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="chatScreenList.title" />
            </View>
          }
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
            />
          )}
        />

      </Screen>
    )
  },
)

interface ProfileCardProps {
  profile: any;
}


const ProfileCard = observer(function ProfileCard({
  profile,
}: ProfileCardProps) {
  const { chatStore } = useStores()
  const handlePressCard = () => {
    chatStore.setChatProfile(profile)
    navigate("ChatTopNavigator")
  }

  return (
    <>
      <TouchableOpacity onPress={handlePressCard} style={$item} activeOpacity={0.9}>
        <Image
          source={{ uri: profile.imageSet[0].imageURL }}
          style={$thumbnail}
        />
        <View style={$metadata}>
          <Text style={$metadataName}>{profile.firstName}</Text>
          <Text
            style={profile.chat.readReceiptsStatus ? $metadataLastMessage : $metadataLastMessageBold}
          >
            {profile.chat.lastMessagePreview}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  )
});

// Updated styles
const $item: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F0F0F0',
  paddingVertical: 12,
  //paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#DDD',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 1,
  elevation: 1,
};

const $thumbnail: ImageStyle = {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 15,
  borderWidth: 1,
  borderColor: colors.border,
};

const $metadata: ViewStyle = {
  flex: 1,
};

const $metadataName: TextStyle = {
  fontSize: 16,
  fontWeight: "500",
  color: colors.text,
};

const $metadataLastMessage: TextStyle = {
  fontSize: 14,
  color: colors.textdim,
};

const $metadataLastMessageBold: TextStyle = {
  fontSize: 14,
  color: colors.textdim,
  fontWeight: 'bold',
};


// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}
const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.md, // Adjust if necessary to align with the card's horizontal margin
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
};

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const screenWidth = Dimensions.get("window").width // Import Dimensions from 'react-native'
export const cardMargin = spacing.md;
export const cardWidth = (screenWidth - (3 * cardMargin)) / 2; // For two columns, considering margin as spacing


const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
// #endregion
