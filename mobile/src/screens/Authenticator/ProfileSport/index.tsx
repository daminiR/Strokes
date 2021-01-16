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

type ProfileSportScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'SPORT'>

type ProfileSportT = {
  navigation: ProfileSportScreenNavigationProp
}

const ProfileSport = ({ navigation }: ProfileSportT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const _onPressProfile = () => {
      onScreen('CHOOSE_SPORTS', navigation)()
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
          Sport: 'Sport',
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
              name="Sport"
              value={values.Sport}
              onChangeText={handleChange('Sport')}
              onBlur={(): void => setFieldTouched('Sport')}
              placeholder="Sport"
              touched={touched}
              errors={errors}
              autoCapitalize="none"
            />
            <Button title="Submit" onPress={_onPressProfile} />
          </>
        )}
      </Formik>
    </AppContainer>
  );
}
export { ProfileSport }
