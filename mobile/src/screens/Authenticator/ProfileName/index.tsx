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
  const [error2, setError] = useState('');
  const [createSquash, {data, loading: loading2, error:error}] = useMutation(
    ADD_PROFILE,
    {
      onError: onErrorLink,
      errorPolicy: 'all',
    },
  );

  const onErrorLink = () => {
    console.log(error)
  //{graphQLErrors, networkError} = error
  //if (graphQLErrors)
    //graphQLErrors.map(({ message, locations, path }) =>
      //console.log(
        //`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      //),
    //);

  //if (networkError) {
    //console.log(`[Network error]: ${networkError}`);
  //}
}
  const _onPressProfile = async (values: {first_name: string}) => {
      //setLoading(true)
      //setError('')
      const { first_name } = values
      const result = await createSquash({variables: {first_name: "is it  now"}}).then(
        () => {if (result.data?.createSquash){
            console.log('sucess');
          }}
      )
      //).catch((e) => {
        //console.log(e)
        //console.log(error.networkError)
        //console.log("not working?")
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
