import { StyleSheet } from "react-native";
import { ViewStyle, TextStyle } from "react-native";
import { spacing } from "../../../theme"; // Adjust the import path according to your project structure

export const styles = StyleSheet.create({
  screenContentContainer: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  } as ViewStyle,

  signIn: {
    marginBottom: spacing.sm,
  } as TextStyle,

  enterDetails: {
    marginBottom: spacing.lg,
  } as TextStyle,

  textField: {
    marginBottom: spacing.lg,
  } as ViewStyle,

  tapButton: {
    marginTop: spacing.xs,
  } as ViewStyle,
});

