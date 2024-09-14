import {type ContentStyle} from "@shopify/flash-list"
import {ViewStyle} from "react-native"
import {spacing} from "../../../theme"

export const styles = {
  listContentContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg + spacing.xl,
    paddingBottom: spacing.lg,
  } as ContentStyle,

  listItem: {
    paddingHorizontal: spacing.lg,
  } as ViewStyle,

  screenContentContainer: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  } as ViewStyle,
}

