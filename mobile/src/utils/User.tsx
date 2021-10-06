import React, { useEffect, useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Form, Formik, FormikConfig, FormikValues} from 'formik'
import {UPLOAD_FILE} from '../../../graphql/mutations/profile'
import * as Yup from 'yup'
import {generateRNFile} from '../../../utils/googleCloud'
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


const registerOnFirebase = async () => {
    await auth()
      .signInWithPhoneNumber(phone_number)
      .then((confirmation) => {
        console.log('pending confirmation');
        //TODO: huge problem with go back if before confirmation there is a go back button then this needs to be redone add logic to goback!!!
        //await Keychain.setInternetCredentials('auth', email, phone_number);
        // TODO: if user exists but has not been confirmed and closes the page, make sure he is back on the confirm code page with a back button to phone number.
        onScreen('CONFIRM_SIGN_UP', navigation)();
        setLoading(false);
      })
      .catch((err) => {
        //TODO come back and add all possible errors
        setLoading(false);
        setError(err.code);
      });
  }


const registerOnMongoDb = async () => {
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
    });
  };

const createUser  = async (
  first_name,
  birthday,
  gender,
  sports,
  game_level,
  image_set,
  phone_number,
  email,
  createSquash
)  => {




};

const deleteUser = () => {


}

export {createUser}
