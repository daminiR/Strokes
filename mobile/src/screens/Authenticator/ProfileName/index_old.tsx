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

  const _onPressAddProfileData = async (values :{
    first_name: string;
    birthday: string;
    gender: string;
    sports: string;
    photos: string;
  }) : Promise<void> => {
      setLoading(true)
      setError('')
      console.log("yayayayayay")
  }
  return (
    <>
      <AppContainer
        onPress={goBack(navigation)}
        title="Profile"
        loading={loading}>
        <Formik
          initialValues={{
            first_name: 'First Name',
            birthday: 'Birthday',
            gender: 'Female',
            sports: 'list  of sports you like',
            photos: 'photos',
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
              <View>
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
              </View>
              <View>
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
              </View>
              <View>
              <Input
                name="gender"
                value={values.gender}
                onChangeText={handleChange('gender')}
                onBlur={(): void => setFieldTouched('gender')}
                placeholder="Gender"
                touched={touched}
                errors={errors}
                autoCapitalize="none"
              />
              </View>
              <View>
              <Input
                name="sports"
                value={values.sports}
                onChangeText={handleChange('sports')}
                onBlur={(): void => setFieldTouched('sports')}
                placeholder="Sports"
                touched={touched}
                errors={errors}
                autoCapitalize="none"
              />
              </View>
              <View>
              <Input
                name="photos"
                value={values.photos}
                onChangeText={handleChange('photos')}
                onBlur={(): void => setFieldTouched('photos')}
                placeholder="Photos"
                touched={touched}
                errors={errors}
                autoCapitalize="none"
              />
              </View>
            </>
          )}
        </Formik>
      </AppContainer>
    </>
  );
}

export const FormikStepper = ({children, ...props}: FormikConfig<FormikValues>) => {
    return(
      <Formik {...props}>
        <form autoComplete="off">{children}</form>
        </Formik>
    )
}
export { Profile }
