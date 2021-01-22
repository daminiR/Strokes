import React, {useEffect, useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Form, Formik, FormikConfig, FormikValues} from 'formik'
import * as Yup from 'yup'
import { StackNavigationProp } from '@react-navigation/stack'
import { AppContainer, Space, Button, Input, TextError } from '../../../components'
import { onScreen, goBack } from '../../../constants'
import {  RootStackSignInParamList } from '../../../navigation/SignInStack'
import auth from '@react-native-firebase/auth'
import { View,  Text, ScrollView, TextInput } from 'react-native'
import {useFormState, useFormDispatch} from '../../../Contexts/FormContext'

type ProfileBirthdayScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'BIRTHDAY'>
type ProfileBirthdayT = {
  navigation: ProfileBirthdayScreenNavigationProp
}

const ProfileBirthday = ({ navigation }: ProfileBirthdayT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const form = React.useRef()
  const dispatch = useFormDispatch()
  const {values: formValues, errors: formErrors } = useFormState("user")
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (form.current) {
        const {values, errors} = form.current;
        dispatch({
          type: 'UPDATE_FORM',
          payload: {
            id: 'user',
            data: {values, errors},
          }
       })
      }
    })
    return unsubscribe
  }, [navigation])

  const _onPressProfile = () => {
      onScreen('GENDER', navigation)()
  }

  return (
    <AppContainer
      onPress={goBack(navigation)}
      title="Profile Birthday"
      loading={loading}>
      <Formik
        initialValues={formValues}
        initialErrors={formErrors}>
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
              name="Birthday"
              value={values.birthday}
              onChangeText={handleChange('Birthday')}
              onBlur={(): void => setFieldTouched('Birthday')}
              placeholder="Birthday"
              touched={touched}
              errors={errors}
              autoCapitalize="none"
            />
            <Button title="Continue" onPress={_onPressProfile} />
            <View>
              <Text>{JSON.stringify(values, null, 2)}</Text>
            </View>
          </>
        )}
      </Formik>
    </AppContainer>
  );
}

export { ProfileBirthday }
