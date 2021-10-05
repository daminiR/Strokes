import React, { useContext, useEffect, useState, ReactElement } from 'react'
import storage from '@react-native-firebase/storage'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  SafeAreaView,
  View,
  Text,
  Button,
} from 'react-native';
import { Storage } from '@google-cloud/storage'
import { onScreen, goBack } from '../../../constants'
import {sanitizeFile } from './../../../utils/fileNaming'
import { AppContainer } from '../../../components'
import { RootStackParamList } from '../../../AppNavigator'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useQuery, useMutation , HTTPFetchNetworkInterface} from '@apollo/client'
import * as RNFS from 'react-native-fs'
import  RNFetchBlob  from 'rn-fetch-blob'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import {UPLOAD_FILE} from '../../../graphql/mutations/profile'
import { NavigationContainer } from '@react-navigation/native'
import ImagePicker from 'react-native-image-crop-picker'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ReactNativeFile, File } from 'apollo-upload-client'
import { storage as GCP_Storage } from '@react-native-firebase/storage';
import * as mime from 'react-native-mime-types'

export  const generateRNFile =  (uri, name) => {
    console.log(uri)
    return uri
      ? new ReactNativeFile({
          uri,
          type: mime.lookup(uri) || 'image',
          name: name,
        })
      : null;
}

export  const _check_single = async (Image, uploadFile): Promise<void> => {
     const RNFile = generateRNFile(
       Image.assets[0].uri.replace('file://', ''),
       'wkahd',
     );
    //if (Platform.OS == "ios"){
     //const RNFile = generateRNFile(
       //Image.assets[0].uri.replace('file://', ''),
       //'wkahd',
     //);}
     //else if (Platform.OS == "android"){
       //console.log(Image)
     //}
    console.log("filevalue,",RNFile)
    uploadFile({variables: {file: RNFile}});
 }

  const _onPressSignOut = async () : Promise<void> => {
    setLoading(true)
    setError('')
    await auth()
      .signOut()
      .then((res) => {
        console.log('Succesful signout')
        console.log(currentUser)
        setConfirmResult(null)
        setLoading(false)
        setError('')
      })
      .catch((err) => {
        console.log(err.code);
        setError(err.code)
      });
  }
export {_onPressSignOut}
