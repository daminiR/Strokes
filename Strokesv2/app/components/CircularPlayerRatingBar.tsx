import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from "react-native-circular-progress"
import { typography, colors, spacing } from "../theme"
import { Text } from "../components"

interface CircularPlayerRatingBarProps {
  rating: number;
  maxRating: number;
  size?: number;
  width?: number;
  backgroundColor?: string;
  fillColor?: string;
  tintColor?: string;
  textStyle?: object;
}

export const CircularPlayerRatingBar: React.FC<CircularPlayerRatingBarProps> = ({
  rating,
  maxRating,
  size = 80,
  width = 15,
  backgroundColor = '#e0e0e0',
  fillColor = colors.background,
  tintColor = '#4caf50',
  textStyle = {},
}) => {
  const fill = (rating / maxRating) * 100;

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={size}
        radius={150}
        width={width}
        fill={fill}
        tintColor={tintColor}
        backgroundColor={backgroundColor}
        rotation={0}
        lineCap="round"
        backgroundWidth={width}
      >
        {(fill) => (
          <View
            style={[
              styles.innerCircle,
              { width: size - width * 2, height: size - width * 2, backgroundColor: fillColor },
            ]}
          >
            <Text style={$ratingStyle}>{rating.toFixed(1)}</Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  )
};

const $ratingStyle: TextStyle = {
  fontFamily: typography.primary.normal,
  color: colors.text,
  fontSize: 32,
  paddingTop: 16,
  paddingVertical: 0,
  paddingHorizontal: 0,
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100, // High value to ensure the View is fully rounded
  },
  ratingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});


