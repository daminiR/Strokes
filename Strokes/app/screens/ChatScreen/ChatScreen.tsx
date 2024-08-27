import {ActivityIndicator, FlatList, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useId, useLayoutEffect, useState} from 'react';
import { Dimensions } from 'react-native';
import { customTheme } from "./../../theme/sendbirdUIkitColors"
import {DarkUIKitTheme, DialogProvider, LightUIKitTheme, ToastProvider, UIKitThemeProvider} from '@sendbird/uikit-react-native-foundation';
import {GroupChannel, GroupChannelHandler, MessageCollection, MessageCollectionInitPolicy} from '@sendbird/chat/groupChannel';
import { BaseMessage } from "@sendbird/chat/message"
import {
  UserMessageView,
  FileMessageView,
  AdminMessageView,
  SendInput,
  INPUT_MAX_HEIGHT,
  LoadingActivity,
} from "../../components"
import {isSendableMessage} from '../../utils/senbird';
import {useForceUpdate} from '@sendbird/uikit-utils';
import { useStores } from "../../models"
import { observer } from "mobx-react-lite"
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { Animated } from 'react-native';
// Set the update interval
import { useFocusEffect } from '@react-navigation/native'; // Added to handle screen focus
import { useCallback } from 'react';

setUpdateIntervalForType(SensorTypes.accelerometer, 100); // updates every 100ms
const windowDimensions = Dimensions.get('window');

export const ChatScreen = observer(() => {
  const [backgroundPosition, setBackgroundPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const { chatStore, authenticationStore } = useStores();
  const rerender = useForceUpdate();
  const [state, setState] = useState<{ channel: GroupChannel; collection: MessageCollection }>();

  // Function to initialize the message collection
  const initializeCollection = async (channelUrl: string) => {
    try {
      await chatStore.initializeCollection(channelUrl, setState, rerender);
    } catch (error) {
      console.error('Failed to initialize collection', error);
    }
  };

  // Reinitialize the collection when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (authenticationStore.isSDKConnected) { // Check if SDK is connected
        initializeCollection(chatStore.channelUrl); // Reinitialize collection when the app comes into the foreground
      }
    }, [authenticationStore.isSDKConnected, chatStore.channelUrl]) // Dependencies include SDK connection state and channel URL
  );

  useEffect(() => {
    const subscription = accelerometer.subscribe(({ x, y }) => {
      Animated.spring(backgroundPosition, {
        toValue: { x: x * 10, y: y * 10 },
        useNativeDriver: true,
      }).start();
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      state?.collection.dispose();
    };
  }, [state?.collection]);

  if (!authenticationStore.isSDKConnected || !state) { // Ensure SDK is connected and state is initialized before rendering
    return <LoadingActivity />;
  }

  const keyExtractor = (item: BaseMessage) =>
    isSendableMessage(item) && item.reqId ? item.reqId : String(item.messageId);

  const onStartReached = async () => {
    if (state.collection.hasNext) {
      const nextMessages = await state.collection.loadNext();
      console.info('onStartReached', nextMessages.length);
      rerender();
    }
  };

  const onEndReached = async () => {
    if (state.collection.hasPrevious) {
      const prevMessages = await state.collection.loadPrevious();
      console.info('onEndReached', prevMessages.length);
      rerender();
    }
  };

  const renderItem = ({ item }: { item: BaseMessage }) => (
    <View style={styles.item}>
      {item.isAdminMessage() && <AdminMessageView channel={state.channel} message={item} />}
      {item.isFileMessage() && <FileMessageView channel={state.channel} message={item} />}
      {item.isUserMessage() && <UserMessageView channel={state.channel} message={item} />}
    </View>
  );

  return (
    <UIKitThemeProvider theme={customTheme}>
      <View style={styles.backgroundContainer}>
        <Animated.Image
          source={require('./../../theme/assets/chatBackgroundImage.png')}
          style={[
            styles.backgroundImage,
            {
              opacity: 0.1,
              transform: [
                {
                  translateX: backgroundPosition.x.interpolate({
                    inputRange: [-50, 50],
                    outputRange: [-50, 50],
                    extrapolate: 'clamp',
                  }),
                },
                {
                  translateY: backgroundPosition.y.interpolate({
                    inputRange: [-50, 50],
                    outputRange: [-50, 50],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
          resizeMode="cover"
        />
        <FlatList
          inverted
          data={[
            ...state.collection.failedMessages.reverse(),
            ...state.collection.pendingMessages.reverse(),
            ...state.collection.succeededMessages.reverse(),
          ]}
          contentContainerStyle={styles.container}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={keyExtractor}
          onStartReached={onStartReached}
          onEndReached={onEndReached}
          renderItem={renderItem}
          maintainVisibleContentPosition={{
            minIndexForVisible: 1,
            autoscrollToTopThreshold: Platform.select({
              android: 20 + INPUT_MAX_HEIGHT,
              default: 20,
            }),
          }}
        />
      </View>
      <SendInput channel={state.channel} />
    </UIKitThemeProvider>
  );
});
const ItemSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
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
