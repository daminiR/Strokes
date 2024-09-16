import {observer} from "mobx-react-lite"
import React, {useEffect, useRef, useState} from "react"
import { View } from "react-native"
import {
  Button,
  LoadingActivity,
  Screen,
  FilterModal,
  AlertModal,
  Text,
  LoadingModal,
  SportCard,
} from "../../components"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"
import { colors } from "../../theme"
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-deck-swiper';
import { useHeader } from "../../utils/useHeader"
import { goBack} from "../../navigators"
import { styles } from "./styles/PlayerSwipeScreen.styles"


interface FaceCardProps extends AppStackScreenProps<"FaceCardProps"> {}

export const FaceCardScreen: FC<FaceCardProps> = observer(function FaceCardProps(_props) {
  const swiperRef = useRef(null);
  const [index, setIndex] = useState(0)
  const { mongoDBStore, userStore, matchStore } = useStores()
  const [isLoading, setIsLoading] = useState(false);
  const { matchPool: cards } = matchStore;
  const [isLastCard, setIsLastCard] = useState(cards.length === 0)
  const [isVisible, setIsVisible] = useState(false)
  const [isAlertVisible, setAlertIsVisible] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false);
  const onCloseAlert = () => {
    setAlertIsVisible(false)
  }
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
  //  const handleSwipeAction = async (actionType) => {
   // setIsSwiping(false)
  //}
  const handleSwipeAction = async (actionType) => {
    var isMatched = false
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
if (actionType === "like") {
      isMatched = await matchStore.likeAction(cards[index].matchUserId, setAlertIsVisible);
  } else {
     await matchStore.dislikeAction(cards[index].matchUserId);
  }      } catch (error) {
        console.error("Failed to update match store:", error)
      } finally {
        // Reset swiping status after the action completes or fails
        setTimeout(() => {
          setIsSwiping(false)
          setAlertIsVisible(isMatched)
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
    <Screen preset="auto" style={styles.screenContentContainer}>
      <FilterModal
        onApplyFilters={onApplyFilters}
        isVisible={isVisible}
        onClose={onClose}
        filters={matchStore.filters}
      />
      <LoadingModal isVisible={isSwiping} message="Please wait..." />
      <AlertModal
        isVisible={isAlertVisible}
        onClose={onCloseAlert}
      />
      {cards.length > 0 ? (
        <>
          <Swiper
            key={JSON.stringify(cards)}
            containerStyle={styles.swiperStyle}
            ref={swiperRef}
            cardStyle={styles.cardStyle}
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
            style={styles.rightFAB}
          >
            <View style={styles.iconStyle}>
              <Icon size={34} name={"thumbs-up"} />
            </View>
          </Button>
          <Button
            disabled={isSwiping}
            onPress={handleSwipeLeft}
            style={styles.leftFAB}
          >
            <View style={styles.iconStyle}>
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
