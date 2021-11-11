import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import {GET_MESSAGES} from '../../../graphql/queries/profile.ts'
import { useLazyQuery, useQuery, useMutation } from '@apollo/client'

export type ActiveChatTScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'HELLO'>
export type ActiveChatT = {
  navigation: ActiveChatTTScreenNavigationProp
}
const ActiveChat = ({ navigation }: ActiveChatT): ReactElement => {
  const { data: messagesData, loading: loadingMessages} = useQuery(GET_MESSAGES)
  console.log(messagesData)
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if(!loadingMessages){
      if (messagesData){
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        //createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
      }
    }
  }, [loadingMessages])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

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
