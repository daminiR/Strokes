import React, { useContext, useState, ReactElement } from 'react'
import storage from '@react-native-firebase/storage'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import ImagePicker from 'react-native-image-crop-picker'
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
import { onScreen, goBack } from '../../../constants'
import { AppContainer } from '../../../components'
import { RootStackParamList } from '../../../AppNavigator'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import {UPLOAD_FILE} from '../../../graphql/mutations/profile'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
//import * as ImagePicker from 'react-native-image-picker'
import { ReactNativeFile } from 'apollo-upload-client'
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
  const [image, setImage] = useState(null);
  const _onPressProfile = () => {
      onScreen('PROFILE', navigation)()
  }
  const generateRNFile =  (uri, name) => {
    return uri
      ? new ReactNativeFile({
          uri,
          type: mime.lookup(uri) || 'image',
          name,
        })
      : null;
}
const _multiIMagePicker = async (): Promise<void> => {
  ImagePicker.openPicker({
    //cropping: true,
    //height: 200,
    //width: 200,
    multiple: true,
  })
    .then((res) => {
      setResponse(res);
      console.log("Upload succesfull");
    })
    .catch((err) => {
      console.log(err);
    });
};
  const _onGc = async () : Promise<void> => {
    setLoading(true)
    setError('')
    const reference = storage().ref('profile_pic.jpg')
    const file = await generateRNFile(response.uri, `picture-${Date.now()}`)
    console.log(file)
    uploadFile({variables: {file}})
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
  //<View style={styles.response}>
  //<Text>Res: {JSON.stringify(response)}</Text>
  //</View>

  //{response && (
    //<View style={styles.image}>
    //<Image
    //style={{width: 200, height: 200}}
    //source={{uri: response.uri}}
    ///>
      //<Button title="send to gc" onPress={_onGc} />
      //</View>
  //)}
  return (
    <>
      <AppContainer title="User" loading={loading}>
        <SafeAreaView>
          <ScrollView>
            <Button title="Select Image" onPress={_multiIMagePicker} />
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
