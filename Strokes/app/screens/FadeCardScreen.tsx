import { observer } from "mobx-react-lite"
import React, {useEffect, useRef, useState, useMemo} from "react"
import { TextInput, Dimensions, TextStyle, ViewStyle, View } from "react-native"
import { Button, Icon, Screen, Text, SBItem, TextField, SelectField, Toggle, SportCard} from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { interpolate } from "react-native-reanimated"
import Carousel, { TAnimationStyle } from "react-native-reanimated-carousel"
import Swiper from 'react-native-deck-swiper';


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height
const cards = [
  { text: 'Card 1' },
  { text: 'Card 2' },
  // Add more cards as needed
];


interface FaceCardProps extends AppStackScreenProps<"FaceCardProps"> {}

export const FaceCardScreen: FC<FaceCardProps> = observer(function FaceCardProps(_props) {
   const [index, setIndex] = useState(0);
  const { userStore, authenticationStore } = useStores()
  const animationStyle: TAnimationStyle = React.useCallback(
    (value: number) => {
      "worklet";

      const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
      const scale = interpolate(value, [-1, 0, 1], [1.25, 1, 0.25]);
      const opacity = interpolate(value, [-0.75, 0, 1], [0, 1, 0]);

      return {
        transform: [{ scale }],
        zIndex,
        opacity,
      }
    },
    [],
  );
   const data = [
    { title: 'First Item', id: 'item1' },
    { title: 'Second Item', id: 'item2' },
    { title: 'Third Item', id: 'item3' },
    // Add more items as necessary
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const width = Dimensions.get('window').width;
  useEffect(() => {
    // Pre-fill logic if necessary
    return () => userStore.reset()
  }, [userStore])
  const onSwiped = () => {
    console.log("Swiped card")
  }
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToNextItem = () => {
    const nextIndex = (currentIndex + 1) % data.length // Loop back to the first item at the end
    setCurrentIndex(nextIndex)
  }

  return (
    <Screen preset="auto" style={$screenContentContainer} safeAreaEdges={["top"]}>
      <Swiper
        containerStyle={$swiperStyle}
        cardStyle={$cardStyle}
        cards={cards}
        renderCard={({ index }) => {
          return <SportCard />
        }}
        onSwiped={onSwiped}
        onSwipedAll={() => {
          console.log("onSwipedAll")
        }}
        cardIndex={index}
        backgroundColor={"#4FD0E9"}
        horizontalSwipe={false}
        verticalSwipe={false}
        stackSize={2}
      ></Swiper>
    </Screen>
  )

})

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

