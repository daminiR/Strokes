import {StyleSheet, ImageStyle, ViewStyle} from "react-native"
import {spacing, colors} from "../../../theme"

export const styles = StyleSheet.create({
  profileImageContainer: {
    position: 'relative',
  } as ViewStyle,

  profileImage: {
    height: 120, // Adjust size as needed
    width: 120, // Adjust size as needed
    borderRadius: 60, // Make it circular
  } as ImageStyle,

  editIconContainer: {
    position: 'absolute',
    top: -10, // Adjust if necessary to ensure it's positioned correctly at the top
    right: -10, // Adjust if necessary to move it to the right side
    backgroundColor: '#FFFFFF', // White background for the icon
    borderColor: '#000000', // Black border color
    borderWidth: 2, // Border width
    borderRadius: 20, // Ensure this is half of the height/width to make it circular
    padding: 5, // Padding inside the icon background
    alignItems: 'center', // Center the icon horizontally
    justifyContent: 'center', // Center the icon vertically
    width: 40, // Width of the icon container; adjust as needed
    height: 40, // Height of the icon container; adjust as needed
  } as ViewStyle,

  screenContentContainer: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  } as ViewStyle,

  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: colors.background,
  } as ViewStyle,
})
