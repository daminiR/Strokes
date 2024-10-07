import {StyleSheet, ViewStyle} from "react-native"
import {spacing} from "../../../theme"
import {ContentStyle} from "@shopify/flash-list"

export const styles = StyleSheet.create({
  listContentContainer: {
    paddingHorizontal: spacing.md, // Adjust if necessary to align with the card's horizontal margin
    paddingTop: spacing.lg + spacing.xl,
    paddingBottom: spacing.lg,
  } as ContentStyle,

  listItem: {
    paddingHorizontal: spacing.lg,
  } as ViewStyle,

  tapButton: {
    marginTop: spacing.xs,
  } as ViewStyle,

  screenContentContainer: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  } as ViewStyle,
})

