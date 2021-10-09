import React, { useEffect, useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Form, Formik, FormikConfig, FormikValues} from 'formik'
import {UPLOAD_FILE} from '../../../graphql/mutations/profile'
import * as Yup from 'yup'
import {generateRNFile} from '../../../utils/Upload'
import { StackNavigationProp } from '@react-navigation/stack'
import ImagePicker from 'react-native-image-crop-picker'
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
import { ReactNativeFile } from 'apollo-upload-client'
import * as mime from 'react-native-mime-types'

type ProfileImageScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'MATCH'>
type ProfileImageT = {
  navigation: ProfileImageScreenNavigationProp
}
const ProfileImages = ({ navigation }: ProfileImageT): ReactElement => {
  const [loading, setLoading] = useState(false);
  const [error2, setError] = useState('');
  const {currentUser} = useContext(UserContext);
  console.log("where is this")
  console.log(currentUser)
  const {setProfileState, profileState, confirmResult, setConfirmResult} = useContext(UserContext);
  const [response, setResponse] = React.useState(null);
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const {values: formValues, errors: formErrors} = useFormState('user');
  const [uploadFile] = useMutation(UPLOAD_FILE);
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

  //useEffect(() => {}, [isProfileComplete]);
  const _onCreateUserRelationError = (error) => {
    console.log(error);
    const {graphQLErrors, networkError} = error;
  };
  const [createSquash, {client, data}] = useMutation(ADD_PROFILE, {
    ignoreResults: false,
    onCompleted: (data) => {
      //const squashItems = squashItemsVar()
      //isProfileCompleteVar(true);
      //squashItemsVar([...squashItems, data.createSquash._id])
      //console.log(squashItemsVar());
    },
  });

  const _multiIMagePicker = async (): Promise<void> => {
    ImagePicker.openPicker({
      cropping: true,
      height: 200,
      width: 200,
      multiple: true,
    })
      .then((res) => {
        setResponse(res);
        console.log(response);
        console.log('Upload succesfull');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const _onGc = async (): Promise<void> => {
    setLoading(true);
    setError('');
    await _multiIMagePicker()
    const files = await response.map(generateRNFile)
    console.log(files);
    uploadFile({variables: {files: files}} );
    setLoading(false);
  };
  const _onPressProfile = async (values) => {
    setLoading(true);
    console.log("here")
    const {
      first_name,
      birthday,
      gender,
      sports,
      game_level,
      image_set,
    } = values;

    //createUser(first_name, birthday, gender, sports, game_level, image_set, phone_number, email, createSquash)
    //IsAuthenticated function is better
    // temp
    const code = '846081';
    //await confirmResult
      //.confirm(code)
      //.then((userCredential) => {
        //console.log(userCredential);
        ////setConfirmResult(userCredential)
        //console.log('signup confirmed');
        //setLoading(false);
        ////onScreen('EMAIL', navigation)()
      //})
      //.catch((err) => {
        //setLoading(false);
        ////TODO: remeber to remove from screen once deployed
        //console.log(err.code);
        //console.log('error in email');
      //});

    console.log("user")
    console.log(currentUser)
    if (currentUser){
    await createSquash({
      variables: {
        _id: currentUser.uid,
        first_name: first_name,
        gender: gender,
        image_set: ['yes.png'],
        game_level: game_level,
        sports: [{sport: sports, isUserSport: true}],
        //<Button title="GC" onPress={_onGc} />
        //<Button title="Select Image" onPress={_multiIMagePicker} />
        birthday: birthday,
      },
    })
      .then(
        (result) => {
          //console.log(result)
          if (result.data?.createSquash) {
            //TODO: best to create onSuccess and reset() for form
            //const squashItems = squashItemsVar()
            //squashItemsVar([...squashItems, result.data.createSquash._id])
            console.log('Successful submission of form');
            setLoading(false);
            //setProfileState(true)
            //isProfileCompleteVar(true)
            //console.log(result.data.createSquash._id)
            //onScreen('PROFILE', navigation)();
          }
        },
        (error_check) => {
          console.log(error_check);
        },
      )
      .catch((e) => {
        console.log(e);
      });
    }
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
            //<Button title="Submiit" onPress={handleSubmit} />
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
