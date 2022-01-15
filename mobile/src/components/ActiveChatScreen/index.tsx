import React, { useState, useEffect } from 'react'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { RootStackSignInParamList } from '@NavStack'
import {DELETE_CHAT_USER,GET_MESSAGES, MESSAGE_POSTED, POST_MESSAGE} from '@graphQL2'
import { useQuery, useMutation, useSubscription} from '@apollo/client'
import { StackNavigationProp } from '@react-navigation/stack'
import {View, StyleSheet} from 'react-native'
import {Icon, BottomSheet, ListItem, Text, Button, Avatar} from 'react-native-elements'
import _ from 'lodash'
import {styles} from '@styles'
import {LIGHT_GRAY, CHAT_TEXT_COLOR_USER} from '@styles'
import {createMessageObject} from '@utils'
import {ChatUserSettingsList} from '@constants'
import {AppContainer} from '@components'

const ActiveChatScreen = ({route}) => {
  const [postMessage2] = useMutation(POST_MESSAGE)
  const [loadingDeleteChat, setLoadinDeleteChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [displayInput, setDisplayInput] = useState(false);
  const {currentUserID, matchID, matchedUserProfileImage, matchedUserName} = route.params
  const {data: postedMessages, loading: loadingMessagePosted} = useSubscription(MESSAGE_POSTED)
  const [deleteChatUser] = useMutation(DELETE_CHAT_USER, {
    onCompleted: () => {
    },
  })
  const {data: messagesData, loading: loadingMessages, fetchMore} = useQuery(GET_MESSAGES,
  {
    fetchPolicy: "network-only",
    variables: {
        currentUserID: currentUserID,
        matchedUserID: matchID,
        offset: 0,
        limit: 10
      },
    },
  );
  useEffect(() => {
  if (postedMessages){
    if (!loadingMessagePosted) {
      const m2 = postedMessages.messagePosted;
      const msgObj = createMessageObject(m2, currentUserID, matchedUserProfileImage);
      setMessages(previousMessages => GiftedChat.append(previousMessages, [msgObj]))
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
    <>
      <AppContainer loading={loadingDeleteChat}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          renderBubble={(props) => renderBubble(props)}
          user={{
            _id: 1,
          }}
        />
      </AppContainer>
    </>
  );
}
export {ActiveChatScreen}
