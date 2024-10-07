import { StyleSheet, Dimensions, I18nManager } from 'react-native';
import { ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { spacing } from "../../../theme"
const isRTL = I18nManager.isRTL;

const screenWidth = Dimensions.get('window').width;
export const cardMargin = spacing.md;
const cardWidth = (screenWidth - (3 * cardMargin)) / 2;

export const styles = StyleSheet.create({
  screenContentContainer: {
    flex: 1,
  } as ViewStyle,

  listContentContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg + spacing.xl,
    paddingBottom: spacing.lg,
  } as ViewStyle,

  heading: {
    marginBottom: spacing.md,
  } as ViewStyle,

  item: {
    padding: 0,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md / 2,
    height: 200,
    width: cardWidth,
    borderRadius: 10,
  } as ViewStyle,

  itemThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  } as ImageStyle,

  metadata: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  } as ViewStyle,

  metadataText: {
    color: '#FFFFFF',
  } as TextStyle,

  emptyState: {
    marginTop: spacing.xxl,
  } as ViewStyle,

  emptyStateImage: {
    transform: [{ scaleX: isRTL ? -1 : 1 }],
  } as ImageStyle,
});

