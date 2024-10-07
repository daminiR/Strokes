import {StyleSheet, TextStyle, ViewStyle} from "react-native"
import {colors, spacing} from "../../../theme"

export const styles = StyleSheet.create({
  listContentContainer: {
    paddingHorizontal: spacing.md, // Adjust if necessary to align with the card's horizontal margin
    paddingTop: spacing.lg + spacing.xl,
    paddingBottom: spacing.lg,
  } as ViewStyle,

  screenContentContainer: {
    marginTop: 0,
    paddingHorizontal: spacing.lg,
  } as ViewStyle,

  signIn: {
    marginBottom: spacing.sm,
  } as TextStyle,

  listItem: {
    paddingHorizontal: spacing.lg,
  } as ViewStyle,

  enterDetails: {
    marginBottom: spacing.lg,
  } as TextStyle,

  hint: {
    color: colors.tint,
    marginBottom: spacing.md,
  } as TextStyle,

  textField: {
    marginBottom: spacing.lg,
  } as ViewStyle,

  tapButton: {
    marginTop: spacing.xs,
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

