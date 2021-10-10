import React, { useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Button, Overlay } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack'
import styles from '../../../assets/styles'
import { AppContainer,Space, Txt} from '../../../components'
import { onScreen, goBack } from '../../../constants'
import {View} from 'react-native'
import { RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import  auth  from '@react-native-firebase/auth'
import { UserContext } from '../../../UserContext'
import {isProfileCompleteVar} from '../../../cache'
import { Text } from 'react-native'
import Emoji from 'react-native-emoji'
export type HelloTScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'HELLO'>

export type HelloT = {
  navigation: HelloTScreenNavigationProp
}
const Hello = ({ navigation }: HelloT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const {currentUser} = useContext(UserContext)
  const isProfileComplete = isProfileCompleteVar()
  const _onPressSignIn = () => {
    navigation.navigate('SIGN_IN');
  };
  const _onPressSignUp = () => {
    navigation.navigate('SIGNUP');
  };
  return (
    <AppContainer loading={loading}>
      <Space height={80} />
      <Button title="Sign In" onPress={() => _onPressSignIn()} />
      <Button title="Sign Up" onPress={() => _onPressSignUp()} />
      <Text>{JSON.stringify(currentUser)}</Text>
      <Space height={10} />
    </AppContainer>
  );
}
export { Hello }
