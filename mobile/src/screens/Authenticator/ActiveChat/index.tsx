import React, { useState, useEffect } from 'react'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { RootStackSignInParamList } from '@NavStack'
import {DELETE_CHAT_USER,GET_MESSAGES, MESSAGE_POSTED, POST_MESSAGE} from '@graphQL'
import { useQuery, useMutation, useSubscription} from '@apollo/client'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import {View, StyleSheet} from 'react-native'
import {Icon, BottomSheet, ListItem, Text, Button, Avatar} from 'react-native-elements'
import _ from 'lodash'
import {styles} from '@styles'
import {ActiveChatView} from '@NavStack'
import {LIGHT_GRAY, CHAT_TEXT_COLOR_USER} from '@styles'
import {createMessageObject} from '@utils'
import {ChatUserSettingsList} from '@constants'
import {AppContainer, ActiveChatScreen} from '@components'
import { HeaderBackButton } from '@react-navigation/elements'
import { ChatUserSettings } from '@components'
export type ActiveChatTScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'ACTIVE_CHAT'>
export type ActiveChatScreenRouteProp = RouteProp<RootStackSignInParamList, 'ACTIVE_CHAT'>;
export type ActiveChatT = {
  navigation: ActiveChatTScreenNavigationProp
  route: ActiveChatTScreenNavigationProp
}
const ActiveChat = ({ route, navigation}) => {
  const [displayInput, setDisplayInput] = useState(false);
  const {currentUserID, matchID, matchedUserProfileImage, matchedUserName} = route.params
  const [loadingDeleteChat, setLoadinDeleteChat] = useState(false);
  const [deleteChatUser] = useMutation(DELETE_CHAT_USER, {
    onCompleted: () => {
    },
  })
  useEffect(() => {
    navigation.setOptions({
      //title: matchedUserName,
      headerRight: (props) => (
        <View style={{flex: 1, justifyContent:'center', paddingHorizontal: 20}}>
        <Icon
          name="more-horiz"
          type="material"
          onPress={() => setDisplayInput(true)}
        />
        </View>
      ),
    });
  }, [])
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
      headerShown: true,
      title: matchedUserName,
      headerLeft: (props) => (
        <View
          style={{
            flexDirection: 'row',
          }}>
          <HeaderBackButton
            {...props}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Avatar
            avatarStyle={styles.avatarActiveChat}
            size={'medium'}
            rounded
            source={{uri: matchedUserProfileImage}}
          />
        </View>
      ),
    });
  }, [])
  return (
    <>
      <AppContainer loading={loadingDeleteChat}>
        <ActiveChatView />
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
