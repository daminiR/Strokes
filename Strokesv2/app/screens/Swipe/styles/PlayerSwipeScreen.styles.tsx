import { StyleSheet } from "react-native";
import { ViewStyle } from "react-native";

export const styles = StyleSheet.create({
  rightFAB: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
  } as ViewStyle,

  leftFAB: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
  } as ViewStyle,

  cardStyle: {
    flex: 1, // Ensure the card expands to fill available space
    marginTop: -60, // Removes margins
    marginLeft: -20, // Removes margins
    padding: 0, // Removes margins
    width: '100%',
    height: '100%',
  } as ViewStyle,

  swiperStyle: {
    flex: 1, // Use flex to ensure it expands to fill all available space
    height: '100%', // Ensures it spans the full height
    paddingHorizontal: 0, // Removes horizontal padding
    paddingVertical: 0, // Removes vertical padding
    marginBottom: 0, // Removes margins
  } as ViewStyle,

  screenContentContainer: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: '100%',
  } as ViewStyle,

  iconStyle: {
    marginTop: 10, // Adjust this value to lower the icon by the desired amount
  } as ViewStyle,
});

