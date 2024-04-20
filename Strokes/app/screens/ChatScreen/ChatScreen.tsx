import { observer } from "mobx-react-lite";
import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useStores } from "../../models";
import { Screen } from "../../components";
import { ViewStyle } from "react-native";
import { AppStackScreenProps } from "../../navigators";
import { spacing } from "../../theme";

// Define the types for the navigation props specific to this screen.
interface ChatScreenProps extends AppStackScreenProps<"Chat"> {}

const ChatScreen: React.FC<ChatScreenProps> = observer((_props) => {
  const { userStore } = useStores();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = [] as IMessage[]) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  }, []);

  return (
    <Screen
      preset="auto"
      contentContainerStyle={screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: userStore._id, // Assuming userStore has a 'user' object with an 'id' attribute
        }}
      />
    </Screen>
  );
});

// Styling for the screen content container
const screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
};

export { ChatScreen };

