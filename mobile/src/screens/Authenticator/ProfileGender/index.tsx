import React, { useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Form, Formik, FormikConfig, FormikValues} from 'formik'
import * as Yup from 'yup'
import { StackNavigationProp } from '@react-navigation/stack'
import { AppContainer, Space, Button, Input, TextError } from '../../../components'
import { onScreen, goBack } from '../../../constants'
import { RootStackParamList } from '../../../AppNavigator'
import {  RootStackSignInParamList } from '../../../navigation/SignInStack'
import auth from '@react-native-firebase/auth'
import { View,  Text, ScrollView, TextInput } from 'react-native'
//import { UserContext } from '../../../UserContext'

type ProfileGenderScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'GENDER'>

type ProfileGenderT = {
  navigation: ProfileGenderScreenNavigationProp
}

const ProfileGender = ({ navigation }: ProfileGenderT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const _onPressProfile = () => {
      onScreen('SPORT', navigation)()
  }

  const _onPressAddProfileData = async (values) : Promise<void> => {
      setLoading(true)
      setError('')
      console.log("yayayayayay")
  }
  return (
    <AppContainer
      onPress={goBack(navigation)}
      title="Profile Gender"
      loading={loading}>
      <Formik
        initialValues={{
          Gender: 'Gender',
        }}
        onSubmit={(values): Promise<void> => _onPressAddProfileData(values)}>
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
              value={values.Gender}
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
