import {type ContentStyle} from "@shopify/flash-list"
import {TextStyle, ViewStyle, StyleSheet} from "react-native"
import {colors, spacing} from "../../../theme"


export const styles = StyleSheet.create({
  listContentContainer: {
    paddingHorizontal: spacing.md, // Adjust if necessary to align with the card's horizontal margin
    paddingTop: spacing.lg + spacing.xl,
    paddingBottom: spacing.lg,
  } as ContentStyle,
  listItem: {
    paddingHorizontal: spacing.lg,
  } as ViewStyle,
});

