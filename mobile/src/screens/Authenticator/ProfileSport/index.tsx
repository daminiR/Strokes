import React, { useEffect, useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Form, Formik, FormikConfig, FormikValues} from 'formik'
import * as Yup from 'yup'
import { StackNavigationProp } from '@react-navigation/stack'
import { AppContainer, Space, Button, Input, TextError } from '../../../components'
import { onScreen, goBack } from '../../../constants'
import {useFormState, useFormDispatch} from '../../../Contexts/FormContext'
import { useMutation } from '@apollo/client'
import {  RootStackSignInParamList } from '../../../navigation/SignInStack'
import auth from '@react-native-firebase/auth'
import { ADD_PROFILE } from '../../../graphql/mutations/profile'
import { View,  Text, ScrollView, TextInput } from 'react-native'

type ProfileSportScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'SPORT'>
type ProfileSportT = {
  navigation: ProfileSportScreenNavigationProp
}
const ProfileSport = ({ navigation }: ProfileSportT): ReactElement => {
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

  const [createSquash] = useMutation(
    ADD_PROFILE,
    {
      errorPolicy: 'all',
    },
  );

  const _onPressProfile = async (values) => {
    onScreen('IMAGE_SET', navigation)();
  };
  return (
    <AppContainer
      onPress={goBack(navigation)}
      title="Profile Sport"
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
              name="Sport"
              value={values.sports}
              onChangeText={handleChange('Sport')}
              onBlur={(): void => setFieldTouched('Sport')}
              placeholder="Sport"
              touched={touched}
              errors={errors}
              autoCapitalize="none"
            />
            <Input
              name="Game Level"
              value={values.game_level}
              onChangeText={handleChange('Game Level')}
              onBlur={(): void => setFieldTouched('Game Level')}
              placeholder="Game Level"
              touched={touched}
              errors={errors}
              autoCapitalize="none"
            />
            <Button title="Submit" onPress={_onPressProfile} />
            <View>
              <Text>{JSON.stringify(values, null, 2)}</Text>
            </View>
          </>
        )}
      </Formik>
    </AppContainer>
  );
}
export { ProfileSport }
