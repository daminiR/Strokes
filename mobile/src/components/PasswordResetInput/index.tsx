import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {styles} from '@styles'
import {View} from 'react-native';
import {Input, Button, Text} from 'react-native-elements'
import { useFormikContext} from 'formik';
import { PasswordResetFields, ProfileFields} from '@localModels'
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';

const PasswordResetInput = ({passwordReset, setPasswordReset, phoneNumber}) => {
  const {
    values,
    setFieldValue,
    errors,
    touched,
    handleBlur,
    handleChange,
    resetForm
  } = useFormikContext<PasswordResetFields>();
  // newPassword2!
const _verfiyPassword = () => {
  var poolData = {
    UserPoolId: 'us-east-1_idvRudgcB', // Your user pool id here
    ClientId: '5db5ndig7d4dei9eiviv06v59f', // Your client id here
  };
  var userPool = new CognitoUserPool(poolData);
  var userData = {
    Username: phoneNumber,
    Pool: userPool,
  };
    var cognitoUser = new CognitoUser(userData);
        var verificationCode = values.passwordResetCode
        var newPassword = values.newPassword
        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess() {
                console.log('Password confirmed!');
                setPasswordReset(false)
                resetForm()
            },
            onFailure(err) {
                console.log('Password not confirmed!');
            },
        });
}
  return (
        <View style={styles.confirmationCodeContainer}>
          <View style={styles.emailInput}>
            <Input
              placeholder="New Password"
              label="Password"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={handleChange('newPassword')}
              //onEndEditing={() => _onDoneEditing()}
              //onChangeText={(text) => {
              //handleInput(text);
              //}}
              //value={values.confirmationCode}
              //value={inputValue}
              value={values.newPassword}
              //onBlur={handleBlur('confirmationCode')}
              //keyboardType={'phone-pad'}
            />
            <Input
              placeholder="Reset COde"
              label="Password Reset Code"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={handleChange('passwordResetCode')}
              //onEndEditing={() => _onDoneEditing()}
              //onChangeText={(text) => {
              //handleInput(text);
              //}}
              //value={values.confirmationCode}
              //value={inputValue}
              value={values.passwordResetCode}
              //onBlur={handleBlur('confirmationCode')}
              //keyboardType={'phone-pad'}
            />
          </View>
          <View style={styles.helloButtons}>
            <Button
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonText}
              onPress={() => _verfiyPassword(values.password)}
              title="Verify"
            />
          </View>
        </View>
  );
};

export {PasswordResetInput}
