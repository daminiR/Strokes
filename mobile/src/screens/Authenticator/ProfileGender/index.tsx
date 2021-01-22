import React, { useEffect, useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Form, Formik, FormikConfig, FormikValues} from 'formik'
import * as Yup from 'yup'
import { StackNavigationProp } from '@react-navigation/stack'
import { AppContainer, Space, Button, Input, TextError } from '../../../components'
import { onScreen, goBack } from '../../../constants'
import {  RootStackSignInParamList } from '../../../navigation/SignInStack'
import auth from '@react-native-firebase/auth'
import {useFormState, useFormDispatch} from '../../../Contexts/FormContext'
import { View,  Text, ScrollView, TextInput } from 'react-native'

type ProfileGenderScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'GENDER'>

type ProfileGenderT = {
  navigation: ProfileGenderScreenNavigationProp
}

const ProfileGender = ({ navigation }: ProfileGenderT): ReactElement => {
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
      onScreen('SPORT', navigation)()
  }

  return (
    <AppContainer
      onPress={goBack(navigation)}
      title="Profile Gender"
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
              name="Gender"
              value={values.gender}
              onChangeText={handleChange('Gender')}
              onBlur={(): void => setFieldTouched('Gender')}
              placeholder="Gender"
              touched={touched}
              errors={errors}
              autoCapitalize="none"
            />
            <Button title="Continue" onPress={_onPressProfile} />
          </>
        )}
      </Formik>
    </AppContainer>
  );
}
export { ProfileGender }
