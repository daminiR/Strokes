import {StyleSheet, ViewStyle, ImageStyle} from "react-native"
import {spacing} from "../../../theme"

export const styles = StyleSheet.create({
  profileImageContainer: {
    position: "relative",
  } as ViewStyle,

  containerWithFAB: {
    flex: 1,
  } as ViewStyle,

  cameraIcon: {
    opacity: 0.5,
  },

  iconContainer: {
    width: '100%', // Match the width of $autoImage
    height: 400, // Match the height of $autoImage
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    borderRadius: 8, // Match the borderRadius of $autoImage
    marginBottom: 16, // Match the marginBottom of $autoImage
    backgroundColor: '#f0f0f0', // Optional: background color for the container
  } as ViewStyle,

  autoImage: {
    width: '100%', // Make the image full width considering the padding of the screen
    height: 400, // Adjust the height as necessary
    resizeMode: 'cover',
    borderRadius: 8, // Optional: if you want rounded corners to match the PlayerDetails card
    marginBottom: 16, // Space between the image and the next component
  } as ImageStyle,

  container: {
    paddingHorizontal: spacing.lg,
  } as ViewStyle,
})
