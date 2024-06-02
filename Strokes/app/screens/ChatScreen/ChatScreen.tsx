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
setUpdateIntervalForType(SensorTypes.accelerometer, 100); // updates every 100ms
const userID = "0c951930-a533-4430-a582-5ce7ec6c61bc"
const accessToken = "6572603456b4d9f1b6adec6c283ef5adc6099418"

const windowDimensions = Dimensions.get('window');
export const ChatScreen = observer(() => {
  const [backgroundPosition, setBackgroundPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const handlerId = useId()
  const { chatStore } = useStores()
  const { sdk } = chatStore
  const rerender = useForceUpdate()
  const [state, setState] = useState<{ channel: GroupChannel; collection: MessageCollection }>()

  useEffect(() => {
  const subscription = accelerometer.subscribe(({ x, y }) => {
    // Using Animated for smooth transitions
    Animated.spring(backgroundPosition, {
      toValue: { x: x * 10, y: y * 10 }, // Multiplied by 10 for noticeable but smooth effect
      useNativeDriver: true
    }).start();
  });
   return () => subscription.unsubscribe();
}, []);


  const initializeCollection = async (channelUrl: string) => {
    try {
      await chatStore.initializeCollection(channelUrl, setState, rerender)
    } catch {}
  }

  useEffect(() => {
    initializeCollection(chatStore.channelUrl)
  }, [])

  useEffect(() => {
    return () => {
      state?.collection.dispose()
    }
  }, [state?.collection])

  if (!state) return <LoadingActivity/>

  const keyExtractor = (item: BaseMessage) =>
    isSendableMessage(item) && item.reqId ? item.reqId : String(item.messageId)
  const onStartReached = async () => {
    if (state.collection.hasNext) {
      const nextMessages = await state.collection.loadNext()
      console.info("onStartReached", nextMessages.length)
      rerender()
    }
  }
  const onEndReached = async () => {
    if (state.collection.hasPrevious) {
      const prevMessages = await state.collection.loadPrevious()
      console.info("onEndReached", prevMessages.length)
      rerender()
    }
  }
  const renderItem = ({ item }: { item: BaseMessage }) => (
    <View style={styles.item}>
      {item.isAdminMessage() && <AdminMessageView channel={state.channel} message={item} />}
      {item.isFileMessage() && <FileMessageView channel={state.channel} message={item} />}
      {item.isUserMessage() && <UserMessageView channel={state.channel} message={item} />}
    </View>
  )

  return (
    <>
      <UIKitThemeProvider theme={customTheme}>
        <View style={styles.backgournContainer}>
          <Animated.Image
            source={require("./../../theme/assets/chatBackgroundImage.png")}
            style={[
              styles.backgroundImage,
              {
                opacity: 0.15,
                transform: [
                  {
                    translateX: backgroundPosition.x.interpolate({
                      inputRange: [-50, 50], // Limiting translation to 50 pixels in either direction
                      outputRange: [-50, 50],
                      extrapolate: "clamp", // This prevents the image from moving beyond the specified range
                    }),
                  },
                  {
                    translateY: backgroundPosition.y.interpolate({
                      inputRange: [-50, 50],
                      outputRange: [-50, 50],
                      extrapolate: "clamp",
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
          <SendInput channel={state.channel} />
        </View>
      </UIKitThemeProvider>
    </>
  )
});

const ItemSeparator = () => <View style={styles.separator} />;
const styles = StyleSheet.create({
  backgournContainer: {
    flex: 1,
    overflow: "hidden", // Important to hide the moving parts outside the viewable area
  },
  backgroundImage: {
    width: windowDimensions.width * 1.1, // 10% larger than the screen width
    height: windowDimensions.height * 1.1, // 10% larger than the screen height
    position: "absolute",
    top: -50
  },
  container: {
    padding: 12,
  },
  separator: {
    height: 12,
  },
  item: {
    flex: 1,
  },
  headerButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonSeparator: {
    width: 8,
  },
})


