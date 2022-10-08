import React, {useState, ReactElement } from 'react'
import {Input, Button, Text} from 'react-native-elements'
import { StackNavigationProp, RouteProp} from '@react-navigation/stack'
import { RootStackSignOutParamList } from '@navigationStack'
import { RootStackSignUpParamList } from '@NavStack'
import { forgotPassword } from '@utils'
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
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [verification, setVerification] = useState("")
  const _onPresSetNewPassword = () => {
    forgotPassword(phoneNumber, newPassword, setCode, setPassword)
  };
  return (
    <>
      <View style={styles.helloContainer}>
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
              label="New Password"
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
            title="Sign In"
            titleStyle={styles.buttonText}
            onPress={() => _onPresSetNewPassword()}
            style={styles.buttonIndStyle}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </View>
    </>
  );
}
export { ForgotPassword }
