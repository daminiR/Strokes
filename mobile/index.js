/**
 * @format
 */
import {AppRegistry, LogBox } from 'react-native';
import App from './src';
import {name as appName} from './app.json';
LogBox.ignoreLogs([
  "Warning: AsyncStorage",
  "Warning: componentWillReceiveProps",
  "RCTRootView cancelTouches",
  "not authenticated",
  "Sending `onAnimatedValueUpdate`",
  "Animated: `useNativeDriver`",
]);
AppRegistry.registerComponent(appName, () => App);
