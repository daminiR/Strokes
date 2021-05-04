import React, { useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { StackNavigationProp } from '@react-navigation/stack'
import { AppContainer, Space, Button, Input, TextError } from '../../../components'
import { onScreen, goBack } from '../../../constants'
import {  RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import auth from '@react-native-firebase/auth'
import { Text, ScrollView, TextInput } from 'react-native'
import { UserContext } from '../../../UserContext'
type ProfileScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'SIGN_IN'>

type SignInT = {
  navigation: ProfileScreenNavigationProp
}

const SignIn = ({ navigation }: SignInT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const {currentUser} = useContext(UserContext)
  const _onPressSignUp = async (values: {
    phone_number: string;
    email: string;
  }): Promise<void> => {
    const {phone_number, email} = values
    setLoading(true)
    setError('')

    await auth().signInWithPhoneNumber(phone_number).then((confirmation) => {
      console.log("pending confirmation")
      setConfirmResult(confirmation)
      //TODO: huge problem with go back if before confirmation there is a go back button then this needs to be redone add logic to goback!!!
      //await Keychain.setInternetCredentials('auth', email, phone_number);
      // TODO: if user exists but has not been confirmed and closes the page, make sure he is back on the confirm code page with a back button to phone number.
      console.log(confirmation)
      console.log(currentUser)
      confirmation && onScreen('CONFIRM_SIGN_UP', navigation )()
      setLoading(false);
      setError('')
    })
    .catch(
      (err) => {
      //TODO come back and add all possible errors
      setLoading(false)
      setError(err.code)
      }
    )
  }
  return (
    <>
      <AppContainer
        onPress={goBack(navigation)}
        title="Sign In"
        loading={loading}>
        <Formik
          initialValues={{
            phone_number: '+18008799999',
            email: 'daminirijhwani@gmail.com',
          }}
          onSubmit={(values): Promise<void> => _onPressSignUp(values)}>
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            handleSubmit,
          }): ReactElement => (
            <>
              <Input
                name="phone_number"
                value={values.phone_number}
                onChangeText={handleChange('phone_number')}
                onBlur={(): void => setFieldTouched('phone_number')}
                placeholder="Phone Number"
                touched={touched}
                errors={errors}
                autoCapitalize="none"
              />
              <Space height={30} />
              {error !== '' && (
                <TextError title={error} textStyle={{alignSelf: 'center'}} />
              )}
              <Button title="Sign Up" onPress={handleSubmit} />
            </>
          )}
        </Formik>
      </AppContainer>
    </>
  );
}
export { SignIn }
