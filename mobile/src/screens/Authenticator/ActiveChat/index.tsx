import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import {GET_MESSAGES} from '../../../graphql/queries/profile'
import {POST_MESSAGE} from '../../../graphql/mutations/profile'
import { useLazyQuery, useQuery, useMutation } from '@apollo/client'
import _ from 'lodash'

export type ActiveChatTScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'HELLO'>
export type ActiveChatT = {
  navigation: ActiveChatTTScreenNavigationProp
}
const ActiveChat = ({ route, navigation}) => {
  const {currentUserID, matchID} = route.params
  const {data: messagesData, loading: loadingMessages} = useQuery(
    GET_MESSAGES,
    {
    fetchPolicy: "network-only",
    variables: {
        currentUserID: currentUserID,
        matchedUserID: matchID,
      },
    },
  );
  const [postMessage2] = useMutation(POST_MESSAGE)
  const [messages, setMessages] = useState([]);
  const createMessages = (messageObj) =>{
      const message = {
      _id:messageObj._id,
      text: messageObj.text,
      user: {
        _id: messageObj.sender == currentUserID ? 1 : 2,
        name: "Damini",
        avatar: 'https://placeimg.com/140/140/any',
     }
    }
    return message
  }
  useEffect(() => {
    if(!loadingMessages){
      if (messagesData){
        console.log("messageDat",messagesData)
        const messages = messagesData.messages
        const displayUserMessages = _.map(messages, (messageObj) =>
          createMessages(messageObj),
        );
        console.log(displayUserMessages)
    setMessages(displayUserMessages);
      }
    }
  }, [loadingMessages])

  const onSend = (messages = []) => {
    console.log("this is a messgae", messages)
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
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
