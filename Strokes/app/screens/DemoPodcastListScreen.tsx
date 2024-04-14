import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo } from "react"
import {
  AccessibilityProps,
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Platform,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  Dimensions,
} from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import {
  Button,
  ButtonAccessoryProps,
  PlayerDetails,
  Card,
  EmptyState,
  Icon,
  ListView,
  Screen,
  Text,
  Toggle,
  CircularPlayerRatingBar
} from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { Episode } from "../models/Episode"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { useFocusEffect } from '@react-navigation/native';

const ICON_SIZE = 14

const rnrImage1 = "https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"
const rnrImage2 = "https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"
const rnrImage3 = "https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"
const rnrImages = [rnrImage1, rnrImage2, rnrImage3]

export const DemoPodcastListScreen: FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function DemoPodcastListScreen(_props) {
    const { episodeStore } = useStores()
    const { likedUserStore, mongoDBStore, userStore, authenticationStore, matchStore } = useStores()

    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    /// Fetch liked IDs whenever the screen is focused
    useFocusEffect(
      React.useCallback(() => {
        let isActive = true
        const fetchLikedIds = async () => {
          if (isActive) {
            try {
              setIsLoading(true);
              await mongoDBStore.queryLikedUserProfiles(1, 10)
              setIsLoading(false)
            } catch (error) {
              console.error("Failed to fetch liked IDs on focus:", error)
            }
          }
        }
        fetchLikedIds()
        return () => setIsLoading(false)
      }, [mongoDBStore]),
    )

    //// initially, kick off a background refresh without the refreshing UI
    //useEffect(() => {
      //;(async function load() {
        //setIsLoading(true)
        //await episodeStore.fetchEpisodes()
        //setIsLoading(false)
      //})()
    //}, [episodeStore])

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([episodeStore.fetchEpisodes(), delay(750)])
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
          data={episodeStore.episodesForList.slice()}
          extraData={episodeStore.favorites.length + episodeStore.episodes.length}
          refreshing={refreshing}
          estimatedItemSize={177}
          onRefresh={manualRefresh}
          numColumns={2}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : (
              <EmptyState
                preset="generic"
                style={$emptyState}
                headingTx={
                  episodeStore.favoritesOnly
                    ? "demoPodcastListScreen.noFavoritesEmptyState.heading"
                    : undefined
                }
                contentTx={
                  episodeStore.favoritesOnly
                    ? "demoPodcastListScreen.noFavoritesEmptyState.content"
                    : undefined
                }
                button={episodeStore.favoritesOnly ? "" : undefined}
                buttonOnPress={manualRefresh}
                imageStyle={$emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="demoPodcastListScreen.title" />
            </View>
          }
          renderItem={({ item }) => (
            <EpisodeCard
              episode={item}
              isFavorite={episodeStore.hasFavorite(item)}
              onPressFavorite={() => episodeStore.toggleFavorite(item)}
            />
          )}
        />
      </Screen>
    )
  },
)

const EpisodeCard = observer(function EpisodeCard({
  episode,
  isFavorite,
  onPressFavorite,
}: {
  episode: Episode
  onPressFavorite: () => void
  isFavorite: boolean
}) {
  const liked = useSharedValue(isFavorite ? 1 : 0)

  const imageUri = useMemo<ImageSourcePropType>(() => {
    return rnrImages[Math.floor(Math.random() * rnrImages.length)]
  }, [])

  /**
   * Android has a "longpress" accessibility action. iOS does not, so we just have to use a hint.
   * @see https://reactnative.dev/docs/accessibility#accessibilityactions
   */
  const accessibilityHintProps = useMemo(
    () =>
      Platform.select<AccessibilityProps>({
        ios: {
          accessibilityLabel: episode.title,
          accessibilityHint: translate("demoPodcastListScreen.accessibility.cardHint", {
            action: isFavorite ? "unfavorite" : "favorite",
          }),
        },
        android: {
          accessibilityLabel: episode.title,
          accessibilityActions: [
            {
              name: "longpress",
              label: translate("demoPodcastListScreen.accessibility.favoriteAction"),
            },
          ],
          onAccessibilityAction: ({ nativeEvent }) => {
            if (nativeEvent.actionName === "longpress") {
              handlePressFavorite()
            }
          },
        },
      }),
    [episode, isFavorite],
  )

  const handlePressFavorite = () => {
    onPressFavorite()
    liked.value = withSpring(liked.value ? 0 : 1)
  }

  const handlePressCard = () => {
    openLinkInBrowser(episode.enclosure.link)
  }

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressCard}
      onLongPress={handlePressFavorite}
      {...accessibilityHintProps}
      ContentComponent={
        <View>
          <Image
            source={{
              uri: "https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg",
            }}
            style={$itemThumbnail}
          />
          <View style={$metadata}>
            <Text
              style={$metadataText}
              size="sm"
              accessibilityLabel={episode.datePublished.accessibilityLabel}
            >
              {"Damini, 3.8 "}
            </Text>
          </View>
        </View>
      }
    />
  )
})

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

const screenWidth = Dimensions.get('window').width; // Import Dimensions from 'react-native'
const cardMargin = spacing.md;
const cardWidth = (screenWidth - (3 * cardMargin)) / 2; // For two columns, considering margin as spacing
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
