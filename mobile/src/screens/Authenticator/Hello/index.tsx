import React, { useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { StackNavigationProp } from '@react-navigation/stack'
import { AppContainer, Button, Space, Txt } from '../../../components'
import { onScreen } from '../../../constants'
import { RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import  auth  from '@react-native-firebase/auth'
import { UserContext } from '../../../UserContext'
import {isProfileCompleteVar} from '../../../cache'
import { Text } from 'react-native'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'HELLO'>

type HelloT = {
  navigation: ProfileScreenNavigationProp
}

const Hello = ({ navigation }: HelloT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const {currentUser} = useContext(UserContext)
  const isProfileComplete = isProfileCompleteVar()

  return (
    <AppContainer loading={loading}>
      <Space height={80} />
      <Button title="Sign In" onPress={onScreen('SIGN_IN', navigation)} />
      <Text>
        {JSON.stringify(currentUser)}
        </Text>
      <Space height={10} />
    </AppContainer>
  );
}

export { Hello }
