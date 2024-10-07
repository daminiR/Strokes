import {StyleSheet, ViewStyle} from "react-native"
import {spacing, colors} from "../../../theme"

export const styles = StyleSheet.create({
  centeredContent: {
    flex: 1,
    justifyContent: 'center', // Centers children vertically in the container
    paddingHorizontal: spacing.lg, // Add horizontal padding
  } as ViewStyle,

  screenContentContainer: {
    paddingHorizontal: spacing.lg,
  } as ViewStyle,

  tapButton: {
    width: '100%',
    marginTop: spacing.xs,
  } as ViewStyle,

  textField: {
    width: '100%',
    marginBottom: spacing.lg,
  } as ViewStyle,

  inputWrapperStyle: {
    marginBottom: spacing.lg,
    flexDirection: "row", // Aligns children side by side
    justifyContent: "space-around", // Distributes children evenly with space around them
    alignItems: "center", // Centers children vertically in the container
    flexWrap: "wrap", // Allows items to wrap to the next line if the container is too narrow
    backgroundColor: colors.palette.neutral200,
    overflow: "hidden",
  } as ViewStyle,
})
