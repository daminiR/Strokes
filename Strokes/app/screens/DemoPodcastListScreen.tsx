import { observer } from "mobx-react-lite"
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
} from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { Episode } from "../models/Episode"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { useFocusEffect } from '@react-navigation/native';

const ICON_SIZE = 14
const MatchesCountDummy = observer(() => {
  const { matchStore } = useStores();
  // Use a dummy effect or variable that uses matchPool just for the sake of dependency
  React.useEffect(() => {
    console.log(`Updated matchPool length: ${matchStore.matchPool.length}`);
  }, [matchStore.matchPool.length]);

  return null; // Render nothing
});


export const DemoPodcastListScreen: FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function DemoPodcastListScreen(_props) {
    const { episodeStore } = useStores()
    const { likedUserStore, mongoDBStore, userStore, authenticationStore, matchStore } = useStores()

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
              await mongoDBStore.queryLikedUserProfiles(1, 10)
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
    const itemsPerPage = 10;  // Define items per page
    console.log(nextPage, itemsPerPage)

    try {
      const newProfiles = await mongoDBStore.queryLikedUserProfiles(nextPage, itemsPerPage);

      if (newProfiles.length > 0) {
        likedUserStore.appendLikedProfiles(newProfiles);  // Append new profiles without resetting the existing ones
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
      await mongoDBStore.queryLikedUserProfiles(1, 8) // Always fetch first page on refresh
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
          data={likedUserStore.likedProfiles.slice()}
          extraData={likedUserStore.likedProfiles.length}
          onEndReachedThreshold={0.2}
          onEndReached={getMoreData}
          refreshing={refreshing}
          estimatedItemSize={177}
          numColumns={2}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : likedUserStore.likedProfiles.length > 0 ? null : (
              <EmptyState
                preset="generic"
                style={$emptyState}
                headingTx="likedByUsers.noLikedProfiles.heading"
                contentTx="likedByUsers.noLikedProfiles.content"
                imageSource={null}
                button={null}
                buttonTx={null}
                imageStyle={$emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="likedByUsers.title" />
            </View>
          }
          renderItem={({ item }) => (
            <PorfileCard
              profile={item}
              isBlurred={item.isBlurred}
            />
          )}
        />

      </Screen>
    )
  },
)

const PorfileCard = observer(function PorfileCard({
  profile,
  onPressFavorite,
  isBlurred,
  isSwiping,
  handleSwipeLeft,
  handleSwipeRight
}: {
  profile: any // for now
  isBlurred: boolean
}) {
  const [showSportCard, setShowSportCard] = useState(false)
  const handleClose = () => {
    setShowSportCard(!showSportCard)
  }
  const handlePressCard = () => {
    setShowSportCard(!showSportCard)
  }
  return (
    <>
      <TouchableOpacity
        onPress={handlePressCard}
        style={$item} // Assuming $item is a predefined style
      >
        <Image
          source={{ uri: profile.imageSet[0].imageURL }}
          style={$itemThumbnail} // Assuming $itemThumbnail is predefined
          blurRadius={isBlurred ? 20 : 0}
        />
        <View style={$metadata}>
          {/* Assuming $metadata is predefined */}
          <Text style={$metadataText} size="sm">
            {/* Assuming $metadataText is predefined */}
            {profile.firstName + ", " + profile.sport.gameLevel}
          </Text>
        </View>
      </TouchableOpacity>
      <LikedByUserModal profile={profile} showSportCard={showSportCard} handleClose={handleClose} />
    </>
  )
})

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}
  const $iconStyle: ViewStyle = {
  marginTop: 10, // Adjust this value to lower the icon by the desired amount
};
const $rightFAB: ViewStyle = {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
  }
const $leftFAB: ViewStyle = {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
  }

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.md, // Adjust if necessary to align with the card's horizontal margin
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
};

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

 const screenWidth = Dimensions.get('window').width; // Import Dimensions from 'react-native'
export const cardMargin = spacing.md;
export const cardWidth = (screenWidth - (3 * cardMargin)) / 2; // For two columns, considering margin as spacing
const $item: ViewStyle = {
  // Remove padding as the content now directly touches the card's edges
  padding: 0,
  // Apply a bottom margin to each card for vertical spacing
  marginBottom: spacing.md,
  // Apply horizontal margins to create space between cards in a grid or list layout
  marginHorizontal: spacing.md / 2,
  // Set a specific height for the card, adjust based on your content needs
  height: 200, // Example height, adjust this value as necessary
  // Consider the width if you're using a grid layout (for 2 columns, as an example, you might want to adjust this)
  width: cardWidth,
  borderRadius: 10, // Maintain the card's border radius for visual consistency
};
const $itemThumbnail: ImageStyle = {
  width: '100%', // Make the image full width of the card
  height: '100%', // Adjust the height as needed or keep dynamic
  borderRadius: 10, // Optional: Adjust or remove if you want sharp corners
};

const $toggle: ViewStyle = {
  marginTop: spacing.md,
}

const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $iconContainer: ViewStyle = {
  height: ICON_SIZE,
  width: ICON_SIZE,
  flexDirection: "row",
  marginEnd: spacing.sm,
}

const $metadata: TextStyle = {
  // Assuming this style is for the container of the metadata
  position: 'absolute', // Position absolutely within the card, if overlaying text on image
  bottom: 0, // Align to the bottom of the card
  left: 0,
  width: '100%', // Full width
  backgroundColor: 'rgba(0, 0, 0, 0.8)', // Optional: Add a semi-transparent overlay for better readability
  paddingHorizontal: spacing.sm, // Inner spacing
  paddingVertical: spacing.xs,
  borderBottomLeftRadius: 10, // Match the card's border radius
  borderBottomRightRadius: 10,
};

const $metadataText: TextStyle = {
  color: '#FFFFFF', // Ensure text color contrasts with the overlay/background
  // No need for marginBottom if this is the only text
};
const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
// #endregion
