import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {spacing} from '../../../theme'; // Updated path as per your convention

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
