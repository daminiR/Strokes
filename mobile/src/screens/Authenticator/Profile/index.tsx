import React, { useContext, useState, ReactElement } from 'react'
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
import { PictureWall } from './picturesWall'
import * as mime from 'react-native-mime-types'
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PROFILE'>
type ProfileT = {
  navigation: ProfileScreenNavigationProp
}
const Profile = ({ navigation }: ProfileT ): ReactElement => {
  const [loading, setLoading] = useState(false)
  const _onPressProfile = () => {
      onScreen('PROFILE', navigation)()
  }
  const _onPressSignOut = async () : Promise<void> => {
      console.log("try")
  }
  //<Button title="signout" onPress={_onPressSignOut} />
  return (
    <>
            <ScrollView contentContainerStyle = {{flexGrow: 1, justifyContent: 'space-between'}} >
              <PictureWall/>
          </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
export { Profile }
