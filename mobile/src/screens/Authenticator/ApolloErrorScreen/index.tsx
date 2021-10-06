import React, { useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { StackNavigationProp } from '@react-navigation/stack'
import styles from '../../../assets/styles'
import { AppContainer, Space, Txt } from '../../../components'
import { onScreen } from '../../../constants'
import { RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import  auth  from '@react-native-firebase/auth'
import { UserContext } from '../../../UserContext'
import {isProfileCompleteVar} from '../../../cache'
import { Text } from 'react-native'
import { Button, Overlay } from 'react-native-elements';
import Emoji from 'react-native-emoji'
import {View} from 'react-native'


const ApolloErrorScreen = ({isApolloConected}): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(!isApolloConected)
  const [loggedIn, setLoggedIn] = useState(false)
  const _onPressSignIn = () => {
    if (!isApolloConected) {
      setModalVisible(true)
    }
  };
  return (
    <AppContainer loading={loading}>
      <Overlay
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.overlays}>
          <View style={styles.containerErrorMessage}>
            <Text style={styles.name}>
              I promise we aren't lying but our database is on fire!
              <Emoji name="fire" style={{fontSize: 15}} />
              <Emoji name="fire" style={{fontSize: 15}} />
            </Text>
            <Text style={styles.name}>
              We are currently extinguishing the fire. Stand by!
            </Text>
            <Button title="Ok" onPress={() => setModalVisible(false)} />
            <Button title="Ok" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Overlay>
      <Space height={80} />
      <Button title="Sign In" onPress={() => _onPressSignIn()} />
      <Space height={10} />
    </AppContainer>
  )
}

export { ApolloErrorScreen }
