import {ActivityIndicator, FlatList, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useId, useLayoutEffect, useState} from 'react';
import {DarkUIKitTheme, DialogProvider, LightUIKitTheme, ToastProvider, UIKitThemeProvider} from '@sendbird/uikit-react-native-foundation';
import {GroupChannel, GroupChannelHandler, MessageCollection, MessageCollectionInitPolicy} from '@sendbird/chat/groupChannel';
import { BaseMessage } from "@sendbird/chat/message"
import {
  UserMessageView,
  FileMessageView,
  AdminMessageView,
  SendInput,
  INPUT_MAX_HEIGHT,
} from "../../components"
import {Icon} from '@sendbird/uikit-react-native-foundation';
import {isSendableMessage} from '../../utils/senbird';
import {CollectionEventSource} from '@sendbird/chat';
import {useForceUpdate} from '@sendbird/uikit-utils';
import { useStores } from "../../models"
import { observer } from "mobx-react-lite"

const userID = "0c951930-a533-4430-a582-5ce7ec6c61bc"
const accessToken = "6572603456b4d9f1b6adec6c283ef5adc6099418"

export const ChatScreen = observer(() => {
  const handlerId = useId()
  const { chatStore } = useStores()
  const { sdk } = chatStore
  const rerender = useForceUpdate()
  const [state, setState] = useState<{ channel: GroupChannel; collection: MessageCollection }>()


  const initializeCollection = async (channelUrl: string) => {
    try {
      await chatStore.initializeSDK()
      await chatStore.connect(userID, "Damini Rijhwani Andnroid", accessToken)
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

  if (!state) return <ActivityIndicator style={StyleSheet.absoluteFill} size={"large"} />

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
      <UIKitThemeProvider theme={DarkUIKitTheme}>
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
      </UIKitThemeProvider>
    </>
  )
});

const ItemSeparator = () => <View style={styles.separator} />;
//const useHeaderButtons = (channel?: GroupChannel) => {
  //const {navigation} = useAppNavigation();

  //useLayoutEffect(() => {
    //if (channel) {
      //const onPressInvite = () => navigation.navigate(Routes.GroupChannelInvite, {channelUrl: channel.url});
      //const onPressLeave = async () => {
        //try {
          //await channel.leave();
          //console.info('leave channel, go back');
          //navigation.goBack();
        //} catch {
          //console.info('leave channel failure');
        //}
      //};

      //navigation.setOptions({
        //headerRight: () => {
          //return (
            //<View style={styles.headerButtonContainer}>
              //<TouchableOpacity onPress={onPressInvite}>
                //<Icon icon={'members'} size={20} />
              //</TouchableOpacity>
              //<View style={styles.headerButtonSeparator} />
              //<TouchableOpacity onPress={onPressLeave}>
                //<Icon icon={'leave'} size={20} />
              //</TouchableOpacity>
            //</View>
          //);
        //},
      //});
    //}
  //}, [channel]);
//};

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonSeparator: {
    width: 8,
  },
});


