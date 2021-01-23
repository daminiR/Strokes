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

type ProfileImageScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'IMAGE_SET'>
type ProfileImageT = {
  navigation: ProfileImageScreenNavigationProp
}

const ProfileImages = ({ navigation }: ProfileImageT): ReactElement => {
  const [loading, setLoading] = useState(false);
  const [error2, setError] = useState('');
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const {values: formValues, errors: formErrors} = useFormState('user');
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (form.current) {
        const {values, errors} = form.current;
        dispatch({
          type: 'UPDATE_FORM',
          payload: {
            id: 'user',
            data: {values, errors},
          },
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  const _onCreateUserRelationError = (error) => {
    console.log(error)
    const {graphQLErrors, networkError} = error;
    //if (graphQLErrors)
      //graphQLErrors.map(({message, locations, path}) =>
        //console.log(
          //`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        //),
      //);

    //if (networkError) {
      //console.log(`[Network error]: ${networkError}`);
    //}
    //console.log('All Apollo Errors handles globally for now');
  };


  const [createSquash] = useMutation(ADD_PROFILE, {
    //onError: _onCreateUserRelationError,
    errorPolicy: 'ignore',
  });

  const _onPressProfile = async (values) => {
    const {
      first_name,
      birthday,
      gender,
      sports,
      game_level,
      image_set,
    } = values;
    await createSquash({
      variables: {
        first_name: first_name,
        gender: gender,
        image_set: ['image_2020.png'],
        game_level: game_level,
        sports: [{sport: sports, isUserSport: true}],
        birthday: birthday,
      },
    })
      .then((result) => {
        console.log(result)
        console.log()
        if (result.data?.createSquash) {
          //TODO: best to create onSuccess and reset() for form
          console.log('Successful submission of form');
          onScreen('USER', navigation)();
        }
      }, error_check => {
       console.log(error_check)
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <AppContainer
      onPress={goBack(navigation)}
      title="Profile Image"
      loading={loading}>
      <Formik
        initialValues={formValues}
        initialErrors={formErrors}
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
              name="Image"
              value={values.image_set}
              onChangeText={handleChange('Image')}
              onBlur={(): void => setFieldTouched('Image')}
              placeholder="Image"
              touched={touched}
              errors={errors}
              autoCapitalize="none"
            />
            <Button title="Submit" onPress={handleSubmit} />
            <View>
              <Text>{JSON.stringify(values, null, 2)}</Text>
            </View>
          </>
        )}
      </Formik>
    </AppContainer>
  );
}
export { ProfileImages }
