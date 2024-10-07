import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../theme"
import { ViewStyle, TextStyle } from "react-native";

export const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  faceIDIcon: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  textFieldPassword: {
    flex: 1,
    marginBottom: spacing.lg,
  } as ViewStyle,

  textField: {
    marginBottom: spacing.lg,
  } as ViewStyle,

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

  forgotPasswordContainer: {
    alignSelf: "center",
    marginBottom: spacing.lg,
  } as ViewStyle,

  forgotPasswordText: {
    color: colors.text, // Assuming this is your primary color for emphasis
    fontSize: 18,
    textDecorationLine: "underline", // Underline for clickable link look
  } as TextStyle,

  hint: {
    color: colors.tint, // Assuming this is a tint color for hints
    marginBottom: spacing.md,
  } as TextStyle,

  tapButton: {
    marginTop: spacing.xs,
  } as ViewStyle,
});

