import React, {useRef, useEffect, useState } from 'react'
import {Input, Button, Text} from 'react-native-elements'
import {initialPasswordReset} from '@constants'
import  { passwordResetSchema } from '@validation'
import { View} from 'react-native'
import { useFormikContext, Formik} from 'formik';
import {styles} from '@styles'
import { ProfileFields} from '@localModels'
import { PasswordResetOverlay, DismissKeyboard} from '@components'
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';

const PasswordInput = ({
  authMessage = null,
  isLastSlide,
  _confirmSignInGC,
  noUserFoundMessage = null,
  isSignIn = true
}) => {
  const {values, setFieldValue, errors, touched, handleBlur, handleChange} =
    useFormikContext<ProfileFields>();
  const didMountRef = useRef(false);
  const [delayed, setDelayed] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  useEffect(() => {
    if (didMountRef.current) {
      const timeoutID = setTimeout(() => {
        setDelayed(true);
      }, 3000);
      return () => {
        clearTimeout(timeoutID);
        setDelayed(false);
      };
    } else {
      didMountRef.current = true;
    }
  }, [isLastSlide]);
  const _forgotPassword = () => {
  var poolData = {
    UserPoolId: 'us-east-1_idvRudgcB', // Your user pool id here
    ClientId: '5db5ndig7d4dei9eiviv06v59f', // Your client id here
  };
  var userPool = new CognitoUserPool(poolData);
  var userData = {
    Username: values.phoneNumber,
    Pool: userPool,
  };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.forgotPassword({
	onSuccess: function(data) {
		// successfully initiated reset password request
		console.log('CodeDeliveryData from forgotPassword: ' + data);
	},
	onFailure: function(err) {
		alert(err.message || JSON.stringify(err));
	},
});
setPasswordReset(true)
  }

  return (
    <>
      <DismissKeyboard>
        <View style={styles.confirmationCodeContainer}>
          <Formik
            validationSchema={passwordResetSchema}
            initialValues={initialPasswordReset}
            onSubmit={(values) => console.log(values)}>
            <PasswordResetOverlay
              passwordReset={passwordReset}
              setPasswordReset={setPasswordReset}
              phoneNumber={values.phoneNumber}
            />
          </Formik>
          <View style={styles.emailInput}>
            <Input
              placeholder="Password"
              label="Password"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={handleChange('password')}
              //onEndEditing={() => _onDoneEditing()}
              //onChangeText={(text) => {
              //handleInput(text);
              //}}
              //value={values.confirmationCode}
              //value={inputValue}
              value={values.password}
              //onBlur={handleBlur('confirmationCode')}
              keyboardType={'phone-pad'}
            />
          </View>
          {errors.password && touched.password ? (
            <Text style={{alignSelf: 'center'}}>{errors.password}</Text>
          ) : null}
          {noUserFoundMessage && (
            <Text style={{alignSelf: 'center'}}>{noUserFoundMessage}</Text>
          )}
          {authMessage && (
            <Text style={{alignSelf: 'center'}}>{authMessage}</Text>
          )}
          <View style={styles.helloButtons}>
            <Button
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonText}
              onPress={() => _confirmSignInGC(values.password)}
              title="Confirm"
            />
            <Button
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonText}
              onPress={() =>_forgotPassword()}
              title="Forgot Password"
            />
          </View>
        </View>
      </DismissKeyboard>
    </>
  );
};
export { PasswordInput }
