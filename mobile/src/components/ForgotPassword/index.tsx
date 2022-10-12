import React, {useState, ReactElement } from 'react'
import {Input, Button, Text} from 'react-native-elements'
import {Alert} from 'react-native'
import {AppContainer, PhoneInput} from '@components'
import { StackNavigationProp, RouteProp} from '@react-navigation/stack'
import { RootStackSignOutParamList } from '@navigationStack'
import { RootStackSignUpParamList } from '@NavStack'
import { confirmPassword, forgotPassword, setNewKeychain} from '@utils'
import  {styles}  from '@styles'
import { View} from 'react-native'
const ForgotPassword = ({_onPresSetNewPassword}): ReactElement => {
  return (
    <>
      <Text style={styles.titleFontStyle}>Reset Password</Text>
      <Text style={styles.descriptionFontStyle}>
        Enter the phone number with our account and we'll send you a code to
        reset your password.
      </Text>
      <View style={styles.emailContainer}>
        <View style={styles.forgotPasswordContainer1}>
          <PhoneInput />
        </View>
        <View style={styles.forgotPasswordContainer1}>
          <View style={styles.helloButtons}>
            <Button
              title="Send Reset Code"
              titleStyle={styles.buttonText}
              onPress={() => _onPresSetNewPassword()}
              style={styles.buttonIndStyle}
              buttonStyle={styles.buttonStyle}
            />
          </View>
        </View>
      </View>
    </>
  );
}
export { ForgotPassword }
