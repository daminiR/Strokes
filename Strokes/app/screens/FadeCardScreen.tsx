import { observer } from "mobx-react-lite"
import Config from 'react-native-config';
import React, {useEffect, useRef, useState, useMemo} from "react"
import { isRTL, translate, TxKeyPath } from "../i18n"
import { TextInput, Dimensions, TextStyle, ViewStyle, View } from "react-native"
import { Button, Icon, Screen, Text, SBItem, TextField, SelectField, Toggle, SportCard} from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { interpolate } from "react-native-reanimated"
import Carousel, { TAnimationStyle } from "react-native-reanimated-carousel"

const PAGE_WIDTH = Dimensions.get('window').width;

interface FaceCardProps extends AppStackScreenProps<"FaceCardProps"> {}

export const FaceCardScreen: FC<FaceCardProps> = observer(function FaceCardProps(_props) {
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
  const width = Dimensions.get('window').width;
  useEffect(() => {
    // Pre-fill logic if necessary
    return () => userStore.reset()
  }, [userStore])

  return (
    <Screen
      preset="auto"
      style={$screenContentContainer}
      contentContainerStyle={$contentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$carouselContainer}>
        <Carousel
          loop
          style={{
            width: PAGE_WIDTH,
            height: 240,
            justifyContent: "center",
            alignItems: "center",
          }}
          width={PAGE_WIDTH * 0.7}
          height={240}
          data={[...new Array(6).keys()]}
          renderItem={({ index }) => {
            //return <SportCard />
             return <SBItem key={index} index={index} />;
          }}
          customAnimation={animationStyle}
        />
      </View>
    </Screen>
  )

})

const $screenContentContainer: ViewStyle = {
  flex: 1,
  //paddingVertical: spacing.xxl,
  //paddingHorizontal: spacing.lg,
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
const $carousel = {
  maxWidth: PAGE_WIDTH, // Ensure the Carousel does not exceed screen width
  maxHeight: "100%", // Limit Carousel's height to 100% of its container
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

const $inputWrapperStyle: ViewStyle = {
  marginBottom: spacing.lg,
  flexDirection: "row", // Aligns children side by side
  justifyContent: "space-around", // Distributes children evenly with space around them
  alignItems: "center", // Centers children vertically in the container
  flexWrap: "wrap", // Allows items to wrap to the next line if the container is too narrow
  backgroundColor: colors.palette.neutral200,
  overflow: "hidden",
}
