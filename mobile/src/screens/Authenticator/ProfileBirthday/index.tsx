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

type ProfileBirthdayScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'BIRTHDAY'>

type ProfileBirthdayT = {
  navigation: ProfileBirthdayScreenNavigationProp
}

const ProfileBirthday = ({ navigation }: ProfileBirthdayT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const _onPressProfile = () => {
      onScreen('GENDER', navigation)()
  }

  const _onPressAddProfileData = async (values) : Promise<void> => {
      setLoading(true)
      setError('')
      console.log("yayayayayay")
  }
  return (
    <AppContainer
      onPress={goBack(navigation)}
      title="Profile Birthday"
      loading={loading}>
      <Formik
        initialValues={{
          birthday: 'Birthday',
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
              name="birthday"
              value={values.birthday}
              onChangeText={handleChange('Birthday')}
              onBlur={(): void => setFieldTouched('Birthday')}
              placeholder="Birthday"
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

export { ProfileBirthday }
