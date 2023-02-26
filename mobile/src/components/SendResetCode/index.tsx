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
const SendVerificationCode = ({_signUp=null})  => {
  const { values, handleBlur, handleChange, errors, touched} = useFormikContext<ProfileFields | SignIn | EditFields>();
  return (
    <>
      <AppContainer>
        <Text style={styles.titleFontStyle}>Verify Phone Number</Text>
        <Text style={styles.descriptionFontStyle}>
          Please enter the code received on your phone to sign up
        </Text>
        <View style={styles.emailContainer}>
          <View style={styles.emailInput}>
            <View style={styles.forgotPasswordContainer1}>
              <Input
                placeholder="Verification Code"
                multiline={false}
                label="Verification Code"
                leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
                onChangeText={handleChange('confirmationCode')}
                value={values.confirmationCode}
                onBlur={handleBlur('confirmationCode')}
              />
              {errors.confirmationCode && touched.confirmationCode ? (
                <Text style={{alignSelf: 'center'}}>
                  {errors.confirmationCode}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.forgotPasswordContainer1}>
            <View style={styles.helloButtons}>
              <Button
                title="Verify"
                titleStyle={styles.buttonText}
                onPress={() => _signUp()}
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
export { SendVerificationCode }
