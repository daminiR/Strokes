import React, { useEffect, useContext, useState, ReactElement } from 'react'
import { Formik } from 'formik'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import * as Yup from 'yup'
import { AppContainer, Button, Space, TextError, Input } from '../../../components'
//import AppContainer from '@components2'
import { goBack } from '../../../constants'
import {  RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import { UserContext } from '../../../UserContext'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CONFIRM_SIGN_UP'>
type ProfileScreenRouteProp = RouteProp<RootStackSignOutParamList, 'CONFIRM_SIGN_UP'>

type ConfirmSignUpT = {
  navigation: ProfileScreenNavigationProp
}

const ConfirmSignUp = ({navigation }: ConfirmSignUpT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {confirmResult} = useContext(UserContext)
  const [delayed, setDelayed] = useState(false)
  useEffect (() => {
        const timeoutID = setTimeout(() => {setDelayed(true)}, 3000)
    return () => {
        clearTimeout(timeoutID)
        setDelayed(false)
    }
  }, [])

  const _onPress = async (values: { code: string }): Promise<void> => {
    setLoading(true)
    setError('')
    const { code } = values
    await confirmResult.confirm(code)
    .then((userCredential) => {
      console.log(userCredential)
      console.log("signup confirmed on gc")
      // add data to mongo db
      //registerOnMongoDb(first_name, birthday, gender, sports, game_level, image_set)
      setLoading(false);
    }
    )
    .catch((err) => {
      setLoading(false);
      //TODO: remeber to remove from screen once deployed
      console.log(err.code)
      console.log("error in email")
    }
           )
    }

  return (
    <>
      <AppContainer title="Confirmation" onPress={goBack(navigation)} loading={loading}>
        <Formik
          initialValues={{ code: '846081' }}
          onSubmit={(values): Promise<void> => _onPress(values)}
          validationSchema={Yup.object().shape({
            code: Yup.string().min(6).required()
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, handleSubmit }): ReactElement => (
            <>
              <Space height={180} />
              <Input
                name="code"
                value={values.code}
                onChangeText={handleChange('code')}
                onBlur={(): void => setFieldTouched('code')}
                placeholder="Insert code"
                touched={touched}
                errors={errors}
              />
              {error !== 'Forgot Password?' && <TextError title={error} />}
              <Button title="Confirm" onPress={handleSubmit} />
              {delayed && <Button title="Resend" onPress={handleSubmit} />}
              <Space height={50} />
            </>
          )}
        </Formik>
      </AppContainer>
    </>
  )
}
export { ConfirmSignUp }
