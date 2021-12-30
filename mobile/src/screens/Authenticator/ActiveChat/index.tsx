import React, { useState, useEffect } from 'react'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { RootStackSignInParamList } from '@NavStack'
import {GET_MESSAGES, MESSAGE_POSTED, POST_MESSAGE} from '@graphQL'
import { useQuery, useMutation, useSubscription} from '@apollo/client'
import { StackNavigationProp } from '@react-navigation/stack'
import {View} from 'react-native'
import _ from 'lodash'
import {LIGHT_GRAY, CHAT_TEXT_COLOR_USER} from '@styles'
import {createMessageObject} from '@utils'

export type ActiveChatTScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'ACTIVE_CHAT'>
export type ActiveChatT = {
  navigation: ActiveChatTScreenNavigationProp
}
import { HeaderBackButton } from '@react-navigation/elements'
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
  //useEffect(() => {
    //navigation.setOptions({title: matchedUserName})
  //}, [])
  useEffect(() => {
    navigation.setOptions({headerShown:true,
        headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => {
                navigation.goBack()
              }}
            />
          ),

    })
  }, [])
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
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderBubble={(props) => renderBubble(props)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}
export {ActiveChat}
