import { observer } from "mobx-react-lite"
import React, {useEffect, useRef, useState, useMemo} from "react"
import { TextInput, Dimensions, TextStyle, ViewStyle, View } from "react-native"
import {
  Button,
  LoadingActivity,
  Screen,
  FilterModal,
  Text,
  SBItem,
  TextField,
  SelectField,
  Toggle,
  SportCard,
} from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-deck-swiper';
import { useHeader } from "../utils/useHeader"
import { navigate, goBack} from "../navigators"

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

interface FaceCardProps extends AppStackScreenProps<"FaceCardProps"> {}

export const FaceCardScreen: FC<FaceCardProps> = observer(function FaceCardProps(_props) {
  const swiperRef = useRef(null);
  const [index, setIndex] = useState(0)
  const { mongoDBStore, userStore, authenticationStore, matchStore } = useStores()
const [isLoading, setIsLoading] = useState(false);
  const { matchPool: cards } = matchStore;
  const [isLastCard, setIsLastCard] = useState(cards.length === 0)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false);
  const width = Dimensions.get("window").width
  const onClose = () => {
    setIsVisible(false)
  }
  useEffect(() => {
    if (cards.length > 0) {
      setIsLastCard(false) // Reset isLastCard to false if cards length is more than 0
    }
    return () => userStore.reset()
  }, [userStore])

const onApplyFilters = async (age, gameLevel) => {
  setIsLoading(true); // Start loading
  try {
    await mongoDBStore.queryAfterFilterChange({
      age: {
        min: age[0],
        max: age[1],
      },
      gameLevel: {
        min: gameLevel[0],
        max: gameLevel[1],
      },
    });
    onClose(); // Close the modal if the operation is successful
  } catch (error) {
    console.error("Failed to apply filters:", error);
  } finally {
    setIsLoading(false); // Stop loading
  }
};

  const onFilter = () => {
    setIsVisible(true)
  }
  useHeader(
    {
      rightIcon: "settings",
      onRightPress: onFilter,
    },
    [goBack],
  )
  useEffect(() => {
    // Pre-fill logic if necessary
    return () => userStore.reset()
  }, [userStore])
  const handleSwipeAction = async (actionType) => {
    if (!isSwiping && swiperRef.current) {
      setIsSwiping(true)
      // Perform the swipe action first for better user experience
      if (actionType === "like") {
        swiperRef.current.swipeRight()
      } else {
        swiperRef.current.swipeLeft()
      }
      try {
        // Await the asynchronous action after the swipe
        await (actionType === "like"
          ? matchStore.likeAction(cards[index].matchUserId)
          : matchStore.dislikeAction(cards[index].matchUserId))
      } catch (error) {
        console.error("Failed to update match store:", error)
      } finally {
        // Reset swiping status after the action completes or fails
        setTimeout(() => {
          setIsSwiping(false)
        }, 25) // Adjust based on your swipe animation duration
      }
    }
  }
const handleSwipeRight = () => handleSwipeAction('like');
const handleSwipeLeft = () => handleSwipeAction('dislike');

const onSwiped = (cardIndex: number) => {
  //const newIndex = cardIndex + 1 // Assuming cardIndex is 0-based and increment for the next card
  setIndex(cardIndex) // Update the state to reflect the new index
  if (cardIndex === cards.length - 1) {
    setIsLastCard(true)
  }
}
   if (isLoading) {
     return <LoadingActivity />
   }
  return (
    <Screen preset="auto" style={$screenContentContainer}>
      <FilterModal
        onApplyFilters={onApplyFilters}
        isVisible={isVisible}
        onClose={onClose}
        filters={matchStore.filters}
      />
      {cards.length > 0 ? (
        <>
          <Swiper
            key={JSON.stringify(cards)}
            containerStyle={$swiperStyle}
            ref={swiperRef}
            cardStyle={$cardStyle}
            cards={cards}
            renderCard={(card) => {
              return <SportCard match={card} />
            }}
            onSwiped={onSwiped}
            onSwipedAll={() => {
              console.log("onSwipedAll")
            }}
            cardIndex={index}
            backgroundColor={colors.background}
            horizontalSwipe={false}
            verticalSwipe={false}
            stackSize={2}
          ></Swiper>
          <Button
            //disabled={isSwiping || index >= cards.length - 1}
            disabled={isSwiping}
            onPress={handleSwipeRight}
            style={$rightFAB}
          >
            <View style={$iconStyle}>
              <Icon size={34} name={"thumbs-up"} />
            </View>
          </Button>
          <Button
            disabled={isSwiping}
            onPress={handleSwipeLeft}
            style={$leftFAB}
          >
            <View style={$iconStyle}>
              <Icon size={34} name={"thumbs-down"} />
            </View>
          </Button>
          {isLastCard && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>You've reached the end!</Text>
          )}
        </>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No items to display.</Text>
      )}
    </Screen>
  )

})
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

const $cardStyle: ViewStyle = {
  flex: 1, // Ensure the card expands to fill available space
  marginTop: -60, // Removes margins
  marginLeft: -20, // Removes margins
  padding: 0, // Removes margins
  width: '100%',
  height: '100%'
  //justifyContent: "center", // Centers content vertically
  //alignItems: "center", // Centers the swiper horizontally
};
const $swiperStyle: ViewStyle = {
  flex: 1, // Use flex to ensure it expands to fill all available space
  height: '100%', // Ensures it spans the full height
  paddingHorizontal: 0, // Removes horizontal padding
  paddingVertical: 0, // Removes vertical padding
  marginBottom: 0, // Removes margins
};

const $screenContentContainer: ViewStyle = {
  flex: 1,
  paddingVertical: 0,
  paddingHorizontal: 0,
  height: '100%',
  //justifyContent: "center", // Centers the swiper vertically
  //alignItems: "center", // Centers the swiper horizontally
}
  const $iconStyle: ViewStyle = {
  marginTop: 10, // Adjust this value to lower the icon by the desired amount
};
const $contentContainer = {
  flexGrow: 1, // Allows the content to expand to fill the screen
  justifyContent: "center", // Centers content vertically
  alignItems: "center", // Centers content horizontally
}
const $carouselContainer = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

