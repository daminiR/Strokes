import { StyleSheet } from "react-native";
import { ViewStyle, TextStyle } from "react-native";
import { spacing, colors } from "../../../theme";

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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    backgroundColor: colors.palette.neutral200,
    overflow: "hidden",
  } as ViewStyle,
});

