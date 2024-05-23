import {GroupChannel, GroupChannelHandler} from '@sendbird/chat/groupChannel';
import {useHeaderHeight} from '@react-navigation/elements';
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  Icon,
  Text,
  TextInput,
  useBottomSheet,
  useUIKitTheme,
} from "@sendbird/uikit-react-native-foundation"
import React, {useEffect, useId, useState} from 'react';
import * as ImagePicker from 'react-native-image-picker';
import {Alert, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CONNECTION_STATE_HEIGHT} from './ConnectionStateView';
import {setNextLayoutAnimation} from '../../utils/senbird';
import { useStores } from "../../models"

export const INPUT_MAX_HEIGHT = 80;
const KEYBOARD_AVOID_BEHAVIOR = Platform.select({ios: 'padding' as const, default: undefined});
export const SendInput = ({channel}: {channel: GroupChannel}) => {
  const handlerId = useId()
  const { chatStore } = useStores()
  const { sdk } = chatStore;
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(channel.isTyping);

  const height = useHeaderHeight();
  const {bottom} = useSafeAreaInsets();

  useEffect(() => {
    const handler = new GroupChannelHandler({
      onTypingStatusUpdated: eventChannel => {
        if (eventChannel.url === channel.url) {
          setNextLayoutAnimation();
          setIsTyping(eventChannel.isTyping);
        }
      },
    });

    sdk.groupChannel.addGroupChannelHandler(handlerId, handler);
    return () => {
      sdk.groupChannel.removeGroupChannelHandler(handlerId);
      channel.endTyping();
    };
  }, []);

  const onChangeText = (value: string) => {
    setText(value);

    if (value.trim().length > 0) {
      channel.startTyping();
    } else {
      channel.endTyping();
    }
  };

  const onPressSend = () => {
    setText(() => '');

    channel
      .sendUserMessage({message: text})
      .onPending(() => {
        console.log('Sending a message, but this message will be handled by collection handler.');
      })
      .onSucceeded(() => {
        console.log('Message sent successfully, but this message will be handled by collection handler.');
      })
      .onFailed(err => {
        Alert.alert('Failed to send message', `Please try again later (${err.message})`);
        console.log('Failed to send message, but this message will be handled by collection handler.');
      });
  };


  return (
    <KeyboardAvoidingView keyboardVerticalOffset={-bottom + height + CONNECTION_STATE_HEIGHT} behavior={KEYBOARD_AVOID_BEHAVIOR}>
      {isTyping && <TypingIndicator channel={channel} />}
      <View style={styles.inputContainer}>
        <TextInput multiline placeholder={'Enter message'} value={text} onChangeText={onChangeText} style={styles.input} />
        <SendButton visible={text.trim().length > 0} onPress={onPressSend} />
      </View>
      <View style={{height: bottom}} />
    </KeyboardAvoidingView>
  );
};

const TypingIndicator = ({channel}: {channel: GroupChannel}) => {
  const {colors} = useUIKitTheme();
  const typingUsers = channel
    .getTypingUsers()
    .map(user => user.nickname)
    .join(', ');

  return (
    <View style={styles.typingIndicator}>
      <Text numberOfLines={1} ellipsizeMode={'middle'} style={{color: colors.onBackground03}}>
        {`${typingUsers.length} users typing...`}
      </Text>
    </View>
  );
};

const AttachmentsButton = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.attachmentsButton}>
      <Icon icon={'add'} size={20} />
    </TouchableOpacity>
  );
};

const SendButton = ({visible, onPress}: {visible: boolean; onPress: () => void}) => {
  if (!visible) return null;
  return (
    <TouchableOpacity style={styles.sendButton} onPress={onPress}>
      <Icon icon={'send'} size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#000', // You can change this to any color you prefer
    flex: 1,
    maxHeight: INPUT_MAX_HEIGHT,
    borderRadius: 5,
  },
  attachmentsButton: {
    marginRight: 8,
  },
  sendButton: {
    marginLeft: 8,
  },
  typingIndicator: {
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});


