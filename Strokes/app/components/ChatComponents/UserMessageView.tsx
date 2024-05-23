import React from 'react';
import {GroupChannelMessage} from '@sendbird/uikit-react-native-foundation';
import { Linking } from "react-native"
import {UserMessage} from '@sendbird/chat/message';
import {GroupChannel} from '@sendbird/chat/groupChannel';
import { isMyMessage } from "@sendbird/uikit-utils"
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ImageStyle,
  TextStyle,
  StyleSheet,
  View,
  ViewStyle,
  Dimensions,
} from "react-native"
import { SendingStatus } from ".."
import { useStores } from '../../models';

// Define props for this component
interface UserMessageViewProps {
  channel: GroupChannel;
  message: UserMessage;
}

export const UserMessageView = ({message, channel}: UserMessageViewProps) => {

  const { chatStore } = useStores()
  const { sdk } = chatStore;

  const isOutgoing = isMyMessage(message, sdk.currentUser?.userId);

  // Function to handle URL pressing
  const onPressURL = (url: string) => {
    const prefixedUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    Linking.openURL(prefixedUrl).catch(err => console.error("An error occurred opening URL:", err));
  };

    const props = {
    variant: isMyMessage(message, sdk.currentUser?.userId) ? 'outgoing' : 'incoming',
    message: message,
    channel: channel,
    groupedWithNext: false,
    groupedWithPrev: false,
    onPressURL: (url: string) => (url.startsWith('http://') ? Linking.openURL(url) : Linking.openURL(`https://${url}`)),
    sendingStatus: isMyMessage(message, sdk.currentUser?.userId) ? <SendingStatus channel={channel} message={message} /> : null,
    containerStyle: isOutgoing ? styles.outgoingMessage : styles.incomingMessage,
  } as const;

  // Conditional rendering based on the presence of Open Graph data
  if (message.ogMetaData) {
    // Ensure the OpenGraphUser component is correctly typed
    return <GroupChannelMessage.OpenGraphUser {...props} />
  } else {
    return <GroupChannelMessage.User {...props} />;
  }
};
const styles = StyleSheet.create({
  outgoingMessage: {
    backgroundColor: '#ADD8E6', // Light blue color
    padding: 10,
    borderRadius: 8,
  },
  incomingMessage: {
    backgroundColor: '#E0E0E0', // Grey color for incoming messages (optional)
    padding: 10,
    borderRadius: 8,
  },
});
