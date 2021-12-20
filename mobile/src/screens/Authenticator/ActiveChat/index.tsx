import React, { useState, useEffect } from 'react'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import {GET_MESSAGES, MESSAGE_POSTED} from '../../../graphql/queries/profile'
import {POST_MESSAGE} from '../../../graphql/mutations/profile'
import { useQuery, useMutation, useSubscription} from '@apollo/client'
import _ from 'lodash'
import {LIGHT_GRAY, CHAT_TEXT_COLOR_USER, CHAT_TEXT_COLOR_MACTHED_USER} from '../../../assets/styles'
import {createMessageObject} from '../../../utils/Chat'

export type ActiveChatTScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'HELLO'>
export type ActiveChatT = {
  navigation: ActiveChatTTScreenNavigationProp
}
const ActiveChat = ({ route, navigation}) => {
  const [postMessage2] = useMutation(POST_MESSAGE)
  const [messages, setMessages] = useState([]);
  const {currentUserID, matchID, matchedUserProfileImage, matchedUserName} = route.params
  const {data: postedMessages, loading: loadingMessagePosted} = useSubscription(MESSAGE_POSTED)
  const {data: messagesData, loading: loadingMessages} = useQuery(GET_MESSAGES,
  {
    fetchPolicy: "network-only",
    variables: {
        currentUserID: currentUserID,
        matchedUserID: matchID,
      },
    },
  );
  useEffect(() => {
    navigation.setOptions({title: matchedUserName})
  }, [])
  useEffect(() => {
  if (postedMessages){
      console.log(loadingMessagePosted);
    if (!loadingMessagePosted) {
      const m2 = postedMessages.messagePosted;
      const what = createMessageObject(m2, currentUserID, matchedUserProfileImage);
      setMessages(previousMessages => GiftedChat.append(previousMessages, [what]))
    }
  }
  }, [postedMessages])
  useEffect(() => {
    if(!loadingMessages){
      if (messagesData){
        const messages = messagesData.messages
        const displayUserMessages = _.map(messages, (messageObj) =>
          createMessageObject(messageObj, currentUserID, matchedUserProfileImage),
        );
        console.log(displayUserMessages)
    setMessages(displayUserMessages);
      }
    }
  }, [loadingMessages])

  const onSend = (messages = []) => {
    //console.log("this is a messgae", messages)
    // TODO: hacky fix for now for messages
    postMessage2({
      variables: {
        sender: currentUserID,
        receiver: matchID,
        text: messages[0].text,
      },
    });
  }
  const renderBubble =(props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'white',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: LIGHT_GRAY},
          right: {
            backgroundColor: CHAT_TEXT_COLOR_USER,
          },
        }}
      />
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      renderBubble={(props) => renderBubble(props)}
      user={{
        _id: 1,
      }}
    />
  )
}
export {ActiveChat}
