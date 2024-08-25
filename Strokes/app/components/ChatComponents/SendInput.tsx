import {GroupChannel, GroupChannelHandler} from '@sendbird/chat/groupChannel';
import {useHeaderHeight} from '@react-navigation/elements';
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Icon,
  Text,
  TextInput,
  useBottomSheet,
  useUIKitTheme,
} from "@sendbird/uikit-react-native-foundation"
import React, {useEffect, useId, useState} from 'react';
import {Alert, KeyboardAvoidingView, StatusBar,Platform , StyleSheet, TouchableOpacity, View} from 'react-native';
import {setNextLayoutAnimation} from '../../utils/senbird';
import { useStores } from "../../models"


export const INPUT_MAX_HEIGHT = 80;
const KEYBOARD_AVOID_BEHAVIOR = Platform.select({ios: 'padding' as const, default: undefined});
// Constants
 const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (StatusBar.currentHeight || 44) : 0;
 const NAVIGATION_BAR_HEIGHT = 44;


export const SendInput = ({ channel }: { channel: GroupChannel }) => {
  const handlerId = useId();
  const { chatStore } = useStores();
  const { sdk } = chatStore;
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(channel.isTyping);

  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    const handler = new GroupChannelHandler({
      onTypingStatusUpdated: (eventChannel) => {
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
      .sendUserMessage({ message: text })
      .onPending(() => {
        console.log(
          'Sending a message, but this message will be handled by collection handler.'
        );
      })
      .onSucceeded(() => {
        console.log(
          'Message sent successfully, but this message will be handled by collection handler.'
        );
      })
      .onFailed((err) => {
        Alert.alert(
          'Failed to send message',
          `Please try again later (${err.message})`
        );
        console.log(
          'Failed to send message, but this message will be handled by collection handler.'
        );
      });
  };

  return (
    <View style={{flexShrink: 0,
      justifyContent: 'flex-end' }}>
      {isTyping && <TypingIndicator channel={channel} />}
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          placeholder={'Enter message'}
          value={text}
          onChangeText={onChangeText}
          style={styles.input}
        />
        <SendButton visible={text.trim().length > 0} onPress={onPressSend} />
      </View>
      <View style={{ height: bottom }} />
    </View>
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
      <Icon icon={'add'} size={25} />
    </TouchableOpacity>
  );
};

const SendButton = ({visible, onPress}: {visible: boolean; onPress: () => void}) => {
  if (!visible) return null;
  return (
    <TouchableOpacity style={styles.sendButton} onPress={onPress}>
      <Icon icon={'send'} size={30} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row', // Set the direction to row
    alignItems: 'center', // Align items in the center vertically
    marginBottom: -20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 0.5, // Optional: Add a top border for better separation
    borderColor: '#ccc', // Optional: Set border color
  },
  input: {
    flex: 1, // Allow the input to take up the remaining space
    borderWidth: 0.5,
    borderColor: '#000', // Customize this color
    maxHeight: INPUT_MAX_HEIGHT,
    borderRadius: 5,
    paddingHorizontal: 10, // Add horizontal padding for better text spacing
  },
  attachmentsButton: {
    marginRight: 8,
  },
  sendButton: {
    marginLeft: 8, // Add some margin between the input and the button
  },
  typingIndicator: {
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});

