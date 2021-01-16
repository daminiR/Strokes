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

type ProfileScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'PROFILE'>

type ProfileT = {
  navigation: ProfileScreenNavigationProp
}

const Profile = ({ navigation }: ProfileT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const _onPressProfile = () => {
      onScreen('BIRTHDAY', navigation)()
  }
  const _onPressAddProfileData = async (values) : Promise<void> => {
      setLoading(true)
      setError('')
      console.log("yayayayayay")
  }
  return (
    <AppContainer
      onPress={goBack(navigation)}
      title="Profile"
      loading={loading}>
      <Formik
        initialValues={{
          first_name: 'First Name',
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
              name="first_name"
              value={values.first_name}
              onChangeText={handleChange('first_name')}
              onBlur={(): void => setFieldTouched('first_name')}
              placeholder="First Name"
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

export { Profile }
