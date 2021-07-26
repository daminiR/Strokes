import React, { useContext, useState, ReactElement } from 'react'
import { Formik } from 'formik'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import * as Yup from 'yup'
import { AppContainer, Button, Space, TextError, Input } from '../../../components'
import { onScreen, goBack } from '../../../constants'
import { RootStackParamList } from '../../../AppNavigator'
import {UserContext} from '../../../UserContext'
import  auth  from '@react-native-firebase/auth'
import {Text} from 'react-native'
import {  RootStackSignInParamList, RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import {isProfileCompleteVar} from '../../../cache'
import AsyncStorage from '@react-native-async-storage/async-storage'
// add error checking and validation checking soon??
//type ProfileScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'EMAIL'>
type ProfileScreenNavigationProp = StackNavigationPrep<RootStackSignInParamList, 'PROFILE'>

type AddEmailT = {
  navigation: ProfileScreenNavigationProp
}
const Email = ({ navigation }: AddEmailT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const {currentUser, setCurrentUser} = useContext(UserContext)

  const update = value => {
      isProfileCompleteVar(value)
      AsyncStorage.setItem('isProfileComplete', JSON.stringify(value))
  }

  //const _onPress = async (values: { email: string }): Promise<void> => {
      ////navigation.navigate('EMAIL', {screen: 'PROFILE'})
      //onScreen('PROFILE', navigation )()
  //}
  const _onPress = async (values: { email: string }): Promise<void> => {
    setLoading(true)
    setError('')
    const { email } = values
    await currentUser.updateEmail(email)
    .then(() => {
      //update(confirmResult.additionalUserInfo.isNewUser)
      setLoading(false);
      //onScreen('USER', navigation)()

      console.log(currentUser)
      setCurrentUser(currentUser)
      console.log(confirmResult)
      console.log("email Updated")

      //navigation.navigate('EMAIL', {screen: 'PROFILE'})
      //onScreen('PROFILE', navigation )()
    }
    )
    .catch((err) => {
      setLoading(false);
      setError(err.message);
      })
    }
  return (
    <>
      <AppContainer title="Add Email" onPress={goBack(navigation)} loading={loading}>
        <Formik
          initialValues={{ email: 'daminirijhwani@gmail.com' }}
          onSubmit={(values): Promise<void> => _onPress(values)}
          validationSchema={Yup.object().shape({
            email: Yup.string().email()
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, handleSubmit }): ReactElement => (
            <>
              <Space height={180} />
              <Input
                name="email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={(): void => setFieldTouched('email')}
                placeholder="Insert email"
                touched={touched}
                errors={errors}
              />
              {error !== 'Forgot Password?' && <TextError title={error} />}
              <Button title="Continue" onPress={handleSubmit} />
              <Text>
                {JSON.stringify(currentUser)}
                </Text>
              <Space height={50} />
            </>
          )}
        </Formik>
      </AppContainer>
    </>
  )
}
export { Email }
