import { observer } from "mobx-react-lite"
import React, {useEffect, useRef, useState, useMemo} from "react"
import { TextInput, Dimensions, TextStyle, ViewStyle, View } from "react-native"
import { Button, Screen, FilterModal, Text, SBItem, TextField, SelectField, Toggle, SportCard} from "../components"
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
  const { matchPool: cards } = matchStore;
  const [isLastCard, setIsLastCard] = useState(cards.length === 0)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const width = Dimensions.get("window").width
  const onApplyFilters = () => {
    mongoDBStore.queryAfterFilterChange({
      age: {
        min: ageRange[0],
        max: ageRange[1],
      },
      gameLevel: {
        min: gameLevelRange[0],
        max: gameLevelRange[1],
      },
    })
  }
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
const onSwiped = (cardIndex: number) => {
  // Check if we've reached the last card
  if (cardIndex === cards.length - 1) {
    setIsLastCard(true)
  }
}
const onClose = () => {
  setIsVisible(false)
}
  return (
    <Screen preset="auto" style={$screenContentContainer} safeAreaEdges={["top"]}>
      <FilterModal
        onApplyFilters={onApplyFilters}
        isVisible={isVisible}
        onClose={onClose}
        filters={matchStore.preferences}
      />
      {cards.length > 0 ? (
        <>
          <Swiper
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
            disabled={isLastCard}
            onPress={() => {
              swiperRef.current?.swipeRight()
            }}
            style={$rightFAB}
          >
            <View style={$iconStyle}>
              <Icon size={34} name={"thumbs-up"} />
            </View>
          </Button>
          <Button
            disabled={isLastCard}
            onPress={() => {
              swiperRef.current?.swipeLeft()
            }}
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

