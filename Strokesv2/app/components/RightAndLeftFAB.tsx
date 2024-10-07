import React from 'react'
import { View } from 'react-native'
import { Button } from './'
import { StyleSheet } from "react-native";
import { ViewStyle } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

interface RightFABProps {
  isSwiping: boolean;
  handleSwipeRight: () => void;
}

export const RightFAB: React.FC<RightFABProps> = ({ isSwiping, handleSwipeRight }) => {
  return (
    <Button
      disabled={isSwiping}
      onPress={handleSwipeRight}
      style={styles.rightFAB}
    >
      <View style={styles.iconStyle}>
        <Icon size={42} name={"thumbs-up"} />
      </View>
    </Button>
  );
};

interface LeftFABProps {
  isSwiping: boolean;
  handleSwipeLeft: () => void;
}

export const LeftFAB: React.FC<LeftFABProps> = ({ isSwiping, handleSwipeLeft }) => {
  return (
    <Button
      disabled={isSwiping}
      onPress={handleSwipeLeft}
      style={styles.leftFAB}
    >
      <View style={styles.iconStyle}>
        <Icon size={42} name={"thumbs-down"} />
      </View>
    </Button>
  );
};

export const styles = StyleSheet.create({
  rightFAB: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    width: 74,    // Increase FAB size to give the icon more space
    height: 74,   // Make it a bit larger
    borderRadius: 40, // Adjust the borderRadius to match the new width/height
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
    borderWidth: 2
  } as ViewStyle,

  leftFAB: {
    position: 'absolute',
    bottom: 16,   // Position at the bottom of the screen
    left: 16,     // Align to the left side
    width: 74,    // Increase FAB size to give the icon more space
    height: 74,   // Make it a bit larger
    borderRadius: 40, // Adjust the borderRadius to match the new width/height
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,  // Shadow for Android
    shadowColor: '#000',  // Shadow for iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
    borderWidth: 2
  } as ViewStyle,

  cardStyle: {
    flex: 1, // Ensure the card expands to fill available space
    marginTop: -60, // Removes margins
    marginLeft: -20, // Removes margins
    padding: 0, // Removes margins
    width: '100%',
    height: '100%',
  } as ViewStyle,

  swiperStyle: {
    flex: 1, // Use flex to ensure it expands to fill all available space
    height: '100%', // Ensures it spans the full height
    paddingHorizontal: 0, // Removes horizontal padding
    paddingVertical: 0, // Removes vertical padding
    marginBottom: 0, // Removes margins
  } as ViewStyle,

  screenContentContainer: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: '100%',
  } as ViewStyle,

  iconStyle: {
    //marginTop: 10, // Adjust this value to lower the icon by the desired amount
  } as ViewStyle,
});

