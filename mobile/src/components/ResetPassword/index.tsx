import React, {useState, ReactElement } from 'react'
import {Input, Button, Text} from 'react-native-elements'
import {Alert} from 'react-native'
import {AppContainer, Cancel} from '@components'
import { StackNavigationProp, RouteProp} from '@react-navigation/stack'
import { RootStackSignOutParamList } from '@navigationStack'
import { RootStackSignUpParamList } from '@NavStack'
import { confirmPassword, forgotPassword, setNewKeychain} from '@utils'
import { ProfileFields, SignIn} from '@localModels'
import { useFormikContext} from 'formik';
import  {styles}  from '@styles'
import { View} from 'react-native'
const ResetPassword = ({_resetPassword})  => {
  const { values, handleBlur, handleChange, errors, touched} = useFormikContext<ProfileFields | SignIn | EditFields>();
  return (
    <>
      <AppContainer>
        <Text style={styles.titleFontStyle}>Reset Password</Text>
        <Text style={styles.descriptionFontStyle}>
          Please enter a new password to sign in and the verification code you
          recieved
        </Text>
        <View style={styles.emailContainer}>
          <View style={styles.emailInput}>
            <View style={styles.forgotPasswordContainer1}>
              <Input
                placeholder="Verification Code"
                multiline={false}
                label="Verification Code"
                leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
                onChangeText={handleChange('verificationCode')}
                value={values.verificationCode}
                onBlur={handleBlur('verificationCode')}
              />
              {errors.verificationCode && touched.verificationCode ? (
                <Text style={{alignSelf: 'center'}}>
                  {errors.verificationCode}
                </Text>
              ) : null}
            </View>
            <View style={styles.forgotPasswordContainer1}>
              <Input
                placeholder="New Password"
                multiline={false}
                secureTextEntry={true}
                label="New Password"
                leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
                onChangeText={handleChange('newPassword')}
                value={values.newPasswor}
                onBlur={handleBlur('newPassword')}
              />
              {errors.newPassword && touched.newPassword ? (
                <Text style={{alignSelf: 'center'}}>{errors.newPassword}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.forgotPasswordContainer1}>
            <View style={styles.helloButtons}>
              <Button
                title="Reset Password"
                titleStyle={styles.buttonText}
                onPress={() => _resetPassword()}
                style={styles.buttonIndStyle}
                buttonStyle={styles.buttonStyle}
              />
            </View>
          </View>
        </View>
      </AppContainer>
    </>
  );
}
export { ResetPassword }
