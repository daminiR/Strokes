import React, { useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Form, Formik, FormikConfig, FormikValues} from 'formik'
import * as Yup from 'yup'
import { StackNavigationProp } from '@react-navigation/stack'
import { AppContainer, Space, Button, Input, TextError } from '../../../components'
import { onScreen, goBack } from '../../../constants'
import {  RootStackSignInParamList } from '../../../navigation/SignInStack'
import auth from '@react-native-firebase/auth'
import { View,  Text, ScrollView, TextInput } from 'react-native'
import { gql, useMutation } from '@apollo/client'
import { ADD_PROFILE } from '../../../graphql/mutations/profile'
//import { UserContext } from '../../../UserContext'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'PROFILE'>
type ProfileT = {
  navigation: ProfileScreenNavigationProp
}
const Profile = ({ navigation }: ProfileT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error2, setError] = useState('')
  const [createSquash, { data, error}] = useMutation(ADD_PROFILE, {onError(err){
console.log(err)
  }})

  const _onPressProfile =  (values: {first_name: string}) => {
      //setLoading(true)
      //setError('')
      const { first_name } = values
      createSquash({variables: {first_name: "is it working now"}})
      //setLoading(false)
        //.then(() => {
          //setLoading(false)
          //setError('')
          //console.log('secussful mutation ');
        //})
        //.catch((err) => {
          //setLoading(false)
          //console.log(data)
          //setError(err.code)
          //console.log(err.code)
          //console.log(error)
          //console.log('didnt work')
        //})
      //onScreen('BIRTHDAY', navigation)()
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
        }}
        onSubmit={(values): Promise<void> => _onPressProfile(values)}>
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
            <Button title="Continue" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </AppContainer>
  );
}
export { Profile }
