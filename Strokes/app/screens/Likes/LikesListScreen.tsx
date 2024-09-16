import {observer} from "mobx-react-lite"
import React, { FC , useState } from "react"
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  View,
} from "react-native"
import {
  EmptyState,
  ListView,
  Screen,
  Text,
  LikedByUserModal,
} from "../../components"
import { useStores } from "../../models"
import { DemoTabScreenProps } from "../../navigators/DemoNavigator"
import { useFocusEffect } from '@react-navigation/native'
import { styles } from "./styles/LikesListScreen.styles"


export const DemoPodcastListScreen: FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function DemoPodcastListScreen(_props) {
    const {likedUserStore, mongoDBStore } = useStores()
    const [refreshing, setRefreshing] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [page, setPage] = React.useState(1); // Pagination state

    // Fetch liked IDs whenever the screen is focused
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
        contentContainerStyle={styles.screenContentContainer}
      >
        <ListView<ProfileCard>
          contentContainerStyle={styles.listContentContainer}
          data={likedUserStore.likedProfiles.slice()}
          extraData={likedUserStore.likedProfiles.length}
          onEndReachedThreshold={0.2}
          onEndReached={getMoreData}
          onRefresh={manualRefresh}
          refreshing={refreshing}
          estimatedItemSize={177}
          numColumns={2}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator />
            ) : likedUserStore.likedProfiles.length > 0 ? null : (
              <EmptyState
                preset="generic"
                style={styles.emptyState}
                headingTx="likedByUsers.noLikedProfiles.heading"
                contentTx="likedByUsers.noLikedProfiles.content"
                imageSource={null}
                button={null}
                buttonTx={null}
                imageStyle={styles.emptyStateImage}
                ImageProps={{ resizeMode: "contain" }}
              />
            )
          }
          ListHeaderComponent={
            <View style={styles.heading}>
              <Text preset="heading" tx="likedByUsers.title" />
            </View>
          }
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              isBlurred={item.isBlurred}
            />
          )}
        />

      </Screen>
    )
  },
)

const ProfileCard = observer(function PorfileCard({
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
        style={styles.item} // Assuming $item is a predefined style
      >
        <Image
          source={{ uri: profile.imageSet[0].imageURL }}
          style={styles.itemThumbnail} // Assuming $itemThumbnail is predefined
          blurRadius={isBlurred ? 20 : 0}
        />
        <View style={styles.metadata}>
          {/* Assuming $metadata is predefined */}
          <Text style={styles.metadataText} size="sm">
            {/* Assuming $metadataText is predefined */}
            {profile.firstName + ", " + profile.sport.gameLevel}
          </Text>
        </View>
      </TouchableOpacity>
      <LikedByUserModal profile={profile} showSportCard={showSportCard} handleClose={handleClose} />
    </>
  )
})

