import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { View, Text, Button } from 'react-native'
import { onScreen, goBack } from '../../../constants'
import { AppContainer } from '../../../components'
import { RootStackParamList } from '../../../AppNavigator'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {Messages} from './Messages'
type MatchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CHAT'>

type ChatT = {
  navigation: MatchScreenNavigationProp
}
const Chat  = ({ navigation }: ChatT ): ReactElement => {
  const [loading, setLoading] = useState(false)
  //<Button title="Profile" onPress={_onPressProfile}/>
  return (
    <>
      <AppContainer title="User" loading={loading}>
        <Messages/>
      </AppContainer>
    </>
  );
}
export { Chat }
