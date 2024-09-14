import {StyleSheet} from "react-native";
import {Dimensions} from "react-native";

// Get window dimensions for responsive layout
const windowDimensions = Dimensions.get('window');

// Your styles object
export const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  backgroundImage: {
    width: windowDimensions.width, // Set to 100% of screen width
    height: windowDimensions.height, // Set to 100% of screen height
    position: 'absolute',
    top: 0,
    left: 0,
  },
  container: {
    padding: 12,
    flexGrow: 1, // Ensure the FlatList covers the entire screen
  },
  separator: {
    height: 12,
  },
  item: {
    flex: 1,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonSeparator: {
    width: 8,
  },
});

