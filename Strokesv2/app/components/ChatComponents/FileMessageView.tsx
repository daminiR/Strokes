import {FileMessage} from '@sendbird/chat/message';
import {getFileType, isMyMessage} from '@sendbird/uikit-utils';
import React from 'react';
import {GroupChannel} from '@sendbird/chat/groupChannel';
import {GroupChannelMessage} from '@sendbird/uikit-react-native-foundation';
import { useStores } from "../../models"
import { SendingStatus } from "./"

type Props = {
  channel: GroupChannel;
  message: FileMessage;
};

export const FileMessageView = ({ message, channel }: Props) => {
  const { chatStore } = useStores()
  const { sdk } = chatStore;

  const props = {
    variant: isMyMessage(message, sdk.currentUser?.userId) ? "outgoing" : "incoming",
    message: message,
    channel: channel,
    groupedWithNext: false,
    groupedWithPrev: false,
    sendingStatus: isMyMessage(message, sdk.currentUser?.userId) ? (
      <SendingStatus channel={channel} message={message} />
    ) : null,
  } as const

  if (getFileType(message.type) === "image") {
    return <GroupChannelMessage.ImageFile {...props} />
  } else {
    return <GroupChannelMessage.File {...props} />
  }
}


