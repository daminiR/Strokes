import React, { useContext, useState, ReactElement } from 'react'
import { Formik } from 'formik'
import { StackNavigationProp } from '@react-navigation/stack'
import * as Yup from 'yup'
import { AppContainer, Button, Space, TextError, Input } from '@components'
import { onScreen, goBack } from '@constants'
import {UserContext} from '@UserContext'
import {Text} from 'react-native'
import {RootStackSignOutParamList } from '@navigationStack'
// add error checking and validation checking soon??
//type ProfileScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'EMAIL'>
type EmailScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'EMAIL'>

type AddEmailT = {
  navigation: EmailScreenNavigationProp
}
const Email = ({ navigation }: AddEmailT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {currentUser} = useContext(UserContext)

  const _onPress = async (values: { email: string }): Promise<void> => {
    setLoading(true)
    setError('')
    onScreen('PROFILE_NAME', navigation )()
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
