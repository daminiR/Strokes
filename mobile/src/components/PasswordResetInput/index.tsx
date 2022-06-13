import React from 'react'
import {styles} from '@styles'
import {View} from 'react-native';
import {Input, Button} from 'react-native-elements'
import { useFormikContext} from 'formik';
import { PasswordResetFields} from '@localModels'
import {
  CognitoUserPool,
  CognitoUser,
} from 'amazon-cognito-identity-js';

const PasswordResetInput = ({passwordReset, setPasswordReset, phoneNumber}) => {
  const {
    values,
    handleChange,
    resetForm
  } = useFormikContext<PasswordResetFields>();
const _verfiyPassword = () => {
const userPoolId = process.env.React_App_UserPoolId
const clientId = process.env.React_App_AWS_Client_Id
  var poolData = {
    UserPoolId: userPoolId, // Your user pool id here
    ClientId: clientId, // Your client id here
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
              value={values.newPassword}
            />
            <Input
              placeholder="Reset COde"
              label="Password Reset Code"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={handleChange('passwordResetCode')}
              value={values.passwordResetCode}
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
