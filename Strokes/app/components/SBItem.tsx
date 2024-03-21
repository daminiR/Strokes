import React from "react";
import type { StyleProp, ViewStyle, ViewProps, ImageSourcePropType } from "react-native";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import type { AnimateProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

import Constants from "expo-constants";
import {
  CircularPlayerRatingBar,
  PlayerDetails,
  Header,
  Card,
  Button,
  AutoImage,
  Text,
} from '../components';

import { SBImageItem } from "./SBImageItem";
import { SBTextItem } from "./SBTextItem";

interface Props extends AnimateProps<ViewProps> {
  style?: StyleProp<ViewStyle>
  index?: number
  pretty?: boolean
  showIndex?: boolean
  img?: ImageSourcePropType
}

export const SBItem: React.FC<Props> = (props) => {
  const { style, showIndex = true, index, pretty, img, testID, ...animatedViewProps } = props;
  const enablePretty = Constants?.expoConfig?.extra?.enablePretty || false;
  const [isPretty, setIsPretty] = React.useState(pretty || enablePretty);
  return (
    <LongPressGestureHandler
      onActivated={() => {
        setIsPretty(!isPretty)
      }}
    >
      <Animated.View testID={testID} style={{ flex: 1 }} {...animatedViewProps}>
          <AutoImage
            style={$autoImage}
            source={{
              uri: "https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg",
            }}
          />
      </Animated.View>
    </LongPressGestureHandler>
  )
}

const $autoImage: ImageStyle = {
    width: '100%', // Make the image full width considering the padding of the screen
    height: 400, // Adjust the height as necessary
    resizeMode: 'cover',
    borderRadius: 8, // Optional: if you want rounded corners to match the PlayerDetails card
    marginBottom: 16, // Space between the image and the next component
  }
