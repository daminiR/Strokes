import React, { useState, useEffect } from 'react'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { RootStackSignInParamList } from '@NavStack'
import {DELETE_CHAT_USER,GET_MESSAGES, MESSAGE_POSTED, POST_MESSAGE} from '@graphQL'
import { useQuery, useMutation, useSubscription} from '@apollo/client'
import { StackNavigationProp } from '@react-navigation/stack'
import { useRoute, useNavigation } from '@react-navigation/native'
import {View, StyleSheet} from 'react-native'
import {Icon, BottomSheet, ListItem, Text, Button, Avatar} from 'react-native-elements'
import _ from 'lodash'
import {styles} from '@styles'
import {LIGHT_GRAY, CHAT_TEXT_COLOR_USER} from '@styles'
import {createMessageObject} from '@utils'
import {ChatUserSettingsList} from '@constants'
import {AppContainer} from '@components'

  const styles2 =  StyleSheet.create({
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
            //titleStyle={styles.buttonText}
            onPress={() => _onPressCancel()}
            //style={styles.buttonIndStyle}
            //buttonStyle={styles.buttonStyle}
          />

    </BottomSheet>
  );
}

export {ChatUserSettings}
