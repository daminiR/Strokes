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
import * as mime from 'react-native-mime-types'
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PROFILE'>
type ProfileT = {
  navigation: ProfileScreenNavigationProp
}
const Profile = ({ navigation }: ProfileT ): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const {data} = useQuery(GET_PROFILE_STATUS);
  const {currentUser} = useContext(UserContext)
  console.log(currentUser);
  const [response, setResponse] = React.useState(null)
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [images, setImage] = useState(null);
  const _onPressProfile = () => {
      onScreen('PROFILE', navigation)()
  }
  const generateRNFile =  (uri, name) => {
      console.log(uri)
    return uri
      ? new ReactNativeFile({
          uri,
          type: mime.lookup(uri) || 'image',
          name: name,
        })
      : null;
}
 const _check_single = async (): Promise<void> => {
     //const sanitizedFilename = sanitizeFile(response.assets[0].fileName, "1234")
     //console.log(sanitizedFilename)
     const RNFile = generateRNFile(response.assets[0].uri.replace('file://', ''), "wkahd")
     console.log(RNFile)
     uploadFile({variables: {file: RNFile}})
     setLoading(false)
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
        //onScreen('HELLO', navigation)()
      })
      .catch((err) => {
        console.log(err.code);
        setError(err.code)
      });
  }
  const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
    },
    tinyLogo: {
      width: 50,
      height: 50,
    },
    logo: {

      width: 66,
      height: 58,
    },
  });
  return (
    <>
      <AppContainer title="User" loading={loading}>
        <SafeAreaView>
          <ScrollView>
            <Image
              style={styles.tinyLogo}
            />
            <Image
              //style={styles.tinyLogo}
              style={{width: 250, height: 250}}
              source={{
                uri: 'https://storage.googleapis.com/acsport1/picture-1620964987661?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=firebase-adminsdk-aanef%40activitybook-a598b.iam.gserviceaccount.com%2F20210628%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20210628T020813Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=host&X-Goog-Signature=c8e16351f8b0e477fbfb5f8f59bedb0a99ddd270c01d9b6f3587670c21aef074706ac120a071e61b0eb40b234023f68d8535132528a53dec4c245691fbc76f2d9dbaecddd6937904cae13f24f4fd70a09be20f71be8ec11c7a58c7d2c4930484203a9b02d06d731fbaba07158a516f27ba9ea7525e0720a4e25aacc3616a80a85318ac513647b732b325584672cc5e963305d11b08dbd981fec1a98d5b0eadfac63eeffc3615a552b43c741fd4e2ba4d10f50d8cf9ab3c56630e0d6e6f3abaa0609d6d648b48d921fdd35fa8e74090cae12a9f6563afcb77bba60e9445407ecd0a0482885e37ea90cdaa1a40e979864de6129c69567f509477f2d955a872bab8',
              }}
            />
            <Button title="Select Single Image" onPress={_singleUpload} />
            <Button title="signout" onPress={_onPressSignOut} />
            <Button title="check single" onPress={_check_single} />
          </ScrollView>
        </SafeAreaView>
      </AppContainer>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    marginVertical: 24,
    marginHorizontal: 24,
  },
  image: {
    marginVertical: 24,
    alignItems: 'center',
  },
  response: {
    marginVertical: 16,
    marginHorizontal: 8,
  },
});
export { Profile }
