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
import {  RootStackSignOutParamList } from '../../../navigation/SignOutStack'

// add error checking and validation checking soon??
type ProfileScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'EMAIL'>
type ProfileScreenRouteProp = RouteProp<RootStackSignOutParamList, 'EMAIL'>

type AddEmailT = {
  navigation: ProfileScreenNavigationProp
}
const Email = ({ navigation }: AddEmailT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const {currentUser} = useContext(UserContext)

  const _onPress = async (values: { email: string }): Promise<void> => {
    setLoading(true)
    setError('')
    const { email } = values
    await currentUser.updateEmail(email)
    .then(() => {
      setLoading(false);
      //onScreen('USER', navigation)()
      console.log(currentUser)
      console.log(confirmResult)
      console.log("email Updated")
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
