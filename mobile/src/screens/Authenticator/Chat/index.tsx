import React, {  useState, ReactElement } from 'react'
import {  StackNavigationProp } from '@react-navigation/stack'
import { AppContainer } from '../../../components'
import { RootStackParamList } from '../../../AppNavigator'
import {Messages} from './Messages'
type MatchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CHAT'>

type ChatT = {
  navigation: MatchScreenNavigationProp
}
const Chat  = ({ navigation }: ChatT ): ReactElement => {
  return (
    <>
      <Messages/>
    </>
  );
}
export { Chat }
