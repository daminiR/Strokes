import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import {GET_MESSAGES, MESSAGE_POSTED} from '../../../graphql/queries/profile'
import {POST_MESSAGE} from '../../../graphql/mutations/profile'
import { useLazyQuery, useQuery, useMutation, useSubscription} from '@apollo/client'
import _ from 'lodash'

export type ActiveChatTScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'HELLO'>
export type ActiveChatT = {
  navigation: ActiveChatTTScreenNavigationProp
}
export const createMessageObject= (messageObj, currentUserID) => {
  console.log(
    '///////////////////// Posted messages createMessages/////////////',
    messageObj
  );
  const message = {
    _id: messageObj._id,
    text: messageObj.text,
    user: {
      _id: messageObj.sender == currentUserID ? 1 : 2,
      name: 'Damini',
      avatar: 'https://placeimg.com/140/140/any',
    },
  };
  return message;
}
const ActiveChat = ({ route, navigation}) => {
  const {currentUserID, matchID} = route.params
  const { error: subError, data: postedMessages, loading: loadingMessagePosted} = useSubscription(MESSAGE_POSTED)
  if (postedMessages){
  const m2 = postedMessages.messagePosted
  console.log("///////////////////// Posted messages inside/////////////", m2)
  const what = createMessageObject(m2, currentUserID)
  setMessages(previousMessages => GiftedChat.append(what, what))
  }
  const {data: messagesData, loading: loadingMessages} = useQuery(GET_MESSAGES,
  {
    fetchPolicy: "network-only",
    variables: {
        currentUserID: currentUserID,
        matchedUserID: matchID,
      },
    },
  );
  //useEffect(() => {
  //console.log("///////////////////// Posted messages/////////////", postedMessages)
  //setMessages(previousMessages => GiftedChat.append(previousMessages, postedMessages))
  //}, [postedMessages])
  const [postMessage2] = useMutation(POST_MESSAGE)
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if(!loadingMessages){
      if (messagesData){
        const messages = messagesData.messages
        const displayUserMessages = _.map(messages, (messageObj) =>
          createMessageObject(messageObj, currentUserID),
        );
        console.log(displayUserMessages)
    setMessages(displayUserMessages);
      }
    }
  }, [loadingMessages])

  const onSend = (messages = []) => {
    //console.log("this is a messgae", messages)
    //setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    // TODO: hacky fix for now for messages
    postMessage2({variables: {sender: currentUserID, receiver:matchID, text: messages[0].text}})

  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}
export {ActiveChat}
