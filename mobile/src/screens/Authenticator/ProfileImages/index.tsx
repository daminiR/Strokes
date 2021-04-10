import React, { useEffect, useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Form, Formik, FormikConfig, FormikValues} from 'formik'
import * as Yup from 'yup'
import { StackNavigationProp } from '@react-navigation/stack'
import { AppContainer, Space, Button, Input, TextError } from '../../../components'
import { onScreen, goBack } from '../../../constants'
import {useFormState, useFormDispatch} from '../../../Contexts/FormContext'
import { InMemoryCache, useQuery, useMutation , makeVar} from '@apollo/client'
import {  RootStackSignInParamList } from '../../../navigation/SignInStack'
import auth from '@react-native-firebase/auth'
import { ADD_PROFILE } from '../../../graphql/mutations/profile'
import { READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import { View,  Text, ScrollView, TextInput } from 'react-native'
import { squashItemsVar, isProfileCompleteVar} from '../../../cache'
import {UserContext} from '../../../UserContext'

type ProfileImageScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'IMAGE_SET'>
type ProfileImageT = {
  navigation: ProfileImageScreenNavigationProp
}
const ProfileImages = ({ navigation }: ProfileImageT): ReactElement => {
  const [loading, setLoading] = useState(false);
  const [error2, setError] = useState('');
  const {currentUser} = useContext(UserContext)
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const {values: formValues, errors: formErrors} = useFormState('user');
  const isProfileComplete = isProfileCompleteVar()
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

  useEffect (() => {

  }, [isProfileComplete])

  const _onCreateUserRelationError = (error) => {
    console.log(error)
    const {graphQLErrors, networkError} = error;
  };
  const [createSquash, {client, data}] = useMutation(ADD_PROFILE, {
    ignoreResults: false,
    onCompleted: (data) => {
    //const squashItems = squashItemsVar()
      isProfileCompleteVar(true)
    //squashItemsVar([...squashItems, data.createSquash._id])
      //console.log(squashItemsVar());
    },
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
    //IsAuthenticated function is better
    // temp
    code = '846081'
    await confirmResult.confirm(code)
    .then((userCredential) => {
      console.log(userCredential)
      //setConfirmResult(userCredential)
      console.log("signup confirmed")
      setLoading(false);
      //onScreen('EMAIL', navigation)()
    }
    )
    .catch((err) => {
      setLoading(false);
      //TODO: remeber to remove from screen once deployed
      console.log(err.code)
      console.log("error in email")
    }
           )

    console.log(isProfileComplete)
    console.log("here?")
   //if (currentUser){
    await createSquash({
      variables: {
        _id: currentUser.uid,
        first_name: first_name,
        gender: gender,
        image_set: ['image_2021.png'],
        game_level: game_level,
        sports: [{sport: sports, isUserSport: true}],
        birthday: birthday,
      },
    })
      .then((result) => {
        //console.log(result)
        if (result.data?.createSquash) {
          //TODO: best to create onSuccess and reset() for form
          //const squashItems = squashItemsVar()
          //squashItemsVar([...squashItems, result.data.createSquash._id])
          console.log('Successful submission of form');
          //console.log(result.data.createSquash._id)
          onScreen('MATCH', navigation)();
        }
      }, error_check => {
       console.log(error_check)
      })
      .catch((e) => {
        console.log(e);
      });
   //}
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
              <Text>{JSON.stringify(isProfileComplete, null, 2)}</Text>
            </View>
          </>
        )}
      </Formik>
    </AppContainer>
  );
}
export { ProfileImages }
