import React, {useCallback,  useState, ReactElement } from 'react'
import {  StackNavigationProp } from '@react-navigation/stack'
import {  useFocusEffect } from '@react-navigation/native'
import { AppContainer, MessagesList} from '@components'
import { RootStackSignInParamList } from '@NavStack'
type MatchScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'CHAT'>

type ChatT = {
  navigation: MatchScreenNavigationProp
}
const Chat  = ({ navigation }: ChatT ): ReactElement => {
  return (
    <>
      <MessagesList/>
    </>
  );
}

export { Chat }
