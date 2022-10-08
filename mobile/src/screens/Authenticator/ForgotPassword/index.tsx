import React, {useState, ReactElement } from 'react'
import {Input, Button, Text} from 'react-native-elements'
import {Alert} from 'react-native'
import {AppContainer, Cancel} from '@components'
import { StackNavigationProp, RouteProp} from '@react-navigation/stack'
import { RootStackSignOutParamList } from '@navigationStack'
import { RootStackSignUpParamList } from '@NavStack'
import { confirmPassword, forgotPassword, setNewKeychain} from '@utils'
import  {styles}  from '@styles'
import { View} from 'react-native'
export type ForgotPasswordTScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'FORGOT_PASSWORD'>
export type ForgotPasswordRoute = RouteProp<RootStackSignUpParamList, 'FORGOT_PASSWORD'>;

export type ForgotPasswordT = {
  navigation: ForgotPasswordTScreenNavigationProp
  route: ForgotPasswordRoute
}
const ForgotPassword = ({route, navigation}: ForgotPasswordT): ReactElement => {
  console.log(route.params.phoneNumber)
  const [phoneNumber, setPhonNumber] = useState(route.params.phoneNumber)
  const [newPassword, setNewPassword] = useState("")
  const [verification, setVerification] = useState("")
  const [loadingPassword, setLoadingPassword] = useState(false)
  const goToHello = () => {
      navigation.navigate('HELLO', {phoneNumber: phoneNumber});
  }
  const _onPresSetNewPassword = () => {
    setLoadingPassword(true)
    confirmPassword(phoneNumber, verification, newPassword).then(() => {
      // ask to change password in keychain
              Alert.alert(
                "Add new password to keychain?",
                "Do you want to replace existing password with new password",
                [
                  {
                    text: "yes",
                    onPress: () => setNewKeychain(phoneNumber, newPassword)
                  },
                  {
                    text: "no",
                    onPress: () => {}
                  }
                ]
              )

      setLoadingPassword(false)
      //navigation.navigate('HELLO', {phoneNumber: phoneNumber});
      navigation.navigate('HELLO');
    })
  };
  return (
    <>
      <AppContainer loading={loadingPassword}>
        <View style={styles.top}>
          <Cancel _onPressCancel={() => goToHello()} />
        </View>
      <View style={styles.emailContainer}>
          <View style={styles.emailInput}>
            <Input
              placeholder="Phone Number"
              multiline={false}
              label="Phone Number"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={(text) => setPhonNumber(text)}
              value={phoneNumber}
            />
            <Input
              placeholder="Verification Code"
              multiline={false}
              secureTextEntry={true}
              label="Verification Code"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={(text) => setVerification(text)}
              value={verification}
            />
            <Input
              placeholder="New Password"
              multiline={false}
              secureTextEntry={true}
              label="New Password"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={(text) => setNewPassword(text)}
              value={newPassword}
            />
          </View>
        <View style={styles.helloButtons}>
          <Button
            title="Reset Password"
            titleStyle={styles.buttonText}
            onPress={() => _onPresSetNewPassword()}
            style={styles.buttonIndStyle}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </View>
      </AppContainer>
    </>
  );
}
export { ForgotPassword }
