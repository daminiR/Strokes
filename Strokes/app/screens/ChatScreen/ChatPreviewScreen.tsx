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

interface ChatCardProp extends AppStackScreenProps<"ChartCardProps"> {}

export const ChatPreviewScreen: FC<ChatCardProp> = observer(function FaceCardProps(_props: any) {
  const swiperRef = useRef(null);
  const [index, setIndex] = useState(0)
  const { mongoDBStore, matchedProfileStore } = useStores()
  const { matchPool: cards } = matchStore;
  const [isLastCard, setIsLastCard] = useState(cards.length === 0)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false);
  const width = Dimensions.get("window").width
  return (
    <Screen preset="auto" style={$screenContentContainer} safeAreaEdges={["top"]}>
      <SportCard match={matchedProfileStore.matchedProfiles} />
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

