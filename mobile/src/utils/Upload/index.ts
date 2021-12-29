import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import  RNFetchBlob  from 'rn-fetch-blob'
import * as mime from 'react-native-mime-types'
import { ReactNativeFile, File } from 'apollo-upload-client'


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
    console.log("filevalue,",RNFile)
    uploadFile({variables: {file: RNFile}});
 }
  const _onPressSignOut = async (setDisplayInput) : Promise<void> => {
    await auth()
      .signOut()
      .then((res) => {
        AsyncStorage.clear()
        setDisplayInput(false)
        console.log('Succesful signout');


      })
      .catch((err) => {
        console.log(err.code);
      });
  }
export {_onPressSignOut}
