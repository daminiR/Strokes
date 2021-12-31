import React, { useState, useEffect } from 'react'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { RootStackSignInParamList } from '@NavStack'
import {DELETE_CHAT_USER,GET_MESSAGES, MESSAGE_POSTED, POST_MESSAGE} from '@graphQL'
import { useQuery, useMutation, useSubscription} from '@apollo/client'
import { StackNavigationProp } from '@react-navigation/stack'
import {View, StyleSheet} from 'react-native'
import {Icon, BottomSheet, ListItem, Text, Button} from 'react-native-elements'
import _ from 'lodash'
import {LIGHT_GRAY, CHAT_TEXT_COLOR_USER} from '@styles'
import {createMessageObject} from '@utils'
import {ChatUserSettingsList} from '@constants'
import {AppContainer} from '@components'

export type ActiveChatTScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'ACTIVE_CHAT'>
export type ActiveChatT = {
  navigation: ActiveChatTScreenNavigationProp
}

  const styles =  StyleSheet.create({
  modal: {
        height: 100,
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
  })

const ChatUserSettings = ({displayInput, setDisplayInput, deleteButton}) => {
  const _onPressCancel = ()=> {
    setDisplayInput(false)
  }
  return (
    <BottomSheet isVisible={displayInput}>
      <View style={{flex: 1}}>
        {ChatUserSettingsList.map((item, i) => (
          <ListItem
            disabled={deleteButton ? false : true }
            onPress={() => deleteButton && deleteButton()}
            key={i}
            bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </View>
          <Button
            title="Cancel"
            titleStyle={styles.buttonText}
            onPress={() => _onPressCancel()}
            style={styles.buttonIndStyle}
            buttonStyle={styles.buttonStyle}
          />

    </BottomSheet>
  );
}

import { HeaderBackButton } from '@react-navigation/elements'
const ActiveChat = ({ route, navigation}) => {
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
  const {data: messagesData, loading: loadingMessages} = useQuery(GET_MESSAGES,
  {
    fetchPolicy: "network-only",
    variables: {
        currentUserID: currentUserID,
        matchedUserID: matchID,
      },
    },
  );
  const _onPressDelete = ()=> {
    setLoadinDeleteChat(true)
    deleteChatUser({variables: {
      _idUser: currentUserID,
       _idChatUser:matchID
    }})
    setDisplayInput(false)
    navigation.goBack()
    setLoadinDeleteChat(true)
  }
  useEffect(() => {
    navigation.setOptions({
      title: matchedUserName,
      headerRight: () => (
        <View style={{flex: 1, justifyContent:'center', padding: 20}}>
        <Icon
          name="more-horiz"
          type="material"
          onPress={() => setDisplayInput(true)}
        />
        </View>
      ),
    });
  }, [])
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
        <ChatUserSettings
          deleteButton={_onPressDelete}
          setDisplayInput={setDisplayInput}
          displayInput={displayInput}
        />
      </AppContainer>
    </>
  );
}
export {ActiveChat}
