// ChatItem.tsx
import {
  GroupChannel,
} from "@sendbird/chat/groupChannel"
import {
  getGroupChannelTitle,
} from "@sendbird/uikit-utils"
import {
  GroupChannelPreview,
} from "@sendbird/uikit-react-native-foundation"
import React from 'react';
import { TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';

interface ChatItemProps {
  item: GroupChannel | null;
  matchedProfileStore: any;
  chatStore: any;
  sdk: any;
  onPress: () => void;
}

export const ChatListItem: React.FC<ChatItemProps> = ({ item, matchedProfileStore, chatStore, sdk, onPress }) => {
  if (!item) {
    return null;
  }

  const matchedUser = matchedProfileStore.findByChannelId(item.url);
  const title = matchedUser ? matchedUser.firstName || 'Unknown User' : getGroupChannelTitle(sdk.currentUser!.userId, item);
  const coverUrl = matchedUser && matchedUser.imageSet?.length > 0
    ? matchedUser.imageSet[0].imageURL
    : item.coverUrl || 'https://static.sendbird.com/sample/cover/cover_11.jpg';

  const lastMessage = item.lastMessage ? item.lastMessage.message : 'No description available';
  const lastMessageTime = item.lastMessage ? dayjs(item.lastMessage.createdAt).format('YYYY-MM-DD') : 'Unavailable';

  const isFileMessage = item.lastMessage && typeof item.lastMessage.isFileMessage === 'function'
    ? item.lastMessage.isFileMessage()
    : false;

  return (
    <TouchableOpacity onPress={onPress}>
      <GroupChannelPreview
        title={title}
        badgeCount={item.unreadMessageCount}
        body={lastMessage}
        bodyIcon={isFileMessage ? 'file-document' : undefined}
        coverUrl={coverUrl}
        titleCaption={lastMessageTime}
        frozen={item.isFrozen}
        notificationOff={item.myPushTriggerOption === 'off'}
      />
    </TouchableOpacity>
  );
};


