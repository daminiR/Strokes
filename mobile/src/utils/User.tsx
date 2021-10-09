import React, { useEffect, useContext, useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { Form, Formik, FormikConfig, FormikValues} from 'formik'
import {UPLOAD_FILE} from '../../../graphql/mutations/profile'
import * as Yup from 'yup'
import {generateRNFile} from '../utils/Upload'
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
export const registerOnFirebase = async (phoneNumber, email) => {
const authorize = new Promise(async (resolve, reject) => {
    await auth()
      .signInWithPhoneNumber(phoneNumber)
      .then((confirmation: any) => {
        resolve(confirmation);
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      });
})
return authorize
  }


  const convertImagesToFormat = (images, currentUser) => {
    console.log(images)
    const RNFiles = images.map(imageObj => {
       const RNFile = generateRNFile(imageObj.image, '123')
       return {file: RNFile, _id: '123', img_idx: imageObj.img_idx}
    })
    return RNFiles
  }
export const registerOnMongoDb = async (values, currentUser) => {
  //const [createSquash, {client, data}] = useMutation(ADD_PROFILE, {
    //ignoreResults: false,
    //onCompleted: (data) => {
    //},
  //});
  const rnfiles = convertImagesToFormat(values.images, currentUser)
    await createSquash({
      variables: {
        _id: currentUser.uid,
        first_name: values.first_name,
        last_name: values.last_name,
        age: values.age,
        gender: values.gender,
        sports: values.sports,
        description: "Hello",
        image_set:
      },
    });
  };

//const createUser  = async ({
  //values,
  //createSquash
//})  => {

  //const {phoneNumber, email, first_name, last_name, age, gender, sports, images, confirmationCode} = values
  //registerOnFirebase(phoneNumber, email, confirmationCode)

  ////const [createSquash, {client, data}] = useMutation(ADD_PROFILE, {
    ////ignoreResults: false,
    ////onCompleted: (data) => {
      //////const squashItems = squashItemsVar()
      //////isProfileCompleteVar(true);
      //////squashItemsVar([...squashItems, data.createSquash._id])
      //////console.log(squashItemsVar());
    ////},
  ////});

//};

const deleteUser = () => {


}

