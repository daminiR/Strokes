import React, {useRef, useEffect, useState } from 'react'
import {Input, Button, Text} from 'react-native-elements'
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import { useFormikContext} from 'formik';
import { View} from 'react-native'
import {styles} from '@styles'
import { ProfileFields} from '@localModels'
import { DismissKeyboard} from '@components'
import { formatCode} from '@validation'

const PasswordInput = ({
  authMessage = null,
  isLastSlide,
  _confirmSignInGC,
  noUserFoundMessage = null,
}) => {
  const {values, setFieldValue, errors, touched, handleBlur, handleChange} =
    useFormikContext<ProfileFields>();
  const didMountRef = useRef(false);
  const [delayed, setDelayed] = useState(false);
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
  return (
    <>
      <DismissKeyboard>
        <View style={styles.confirmationCodeContainer}>
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
          </View>
        </View>
      </DismissKeyboard>
    </>
  );
};
export { PasswordInput }
