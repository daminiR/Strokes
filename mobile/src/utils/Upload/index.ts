import AsyncStorage from '@react-native-async-storage/async-storage'
import * as mime from 'react-native-mime-types'
import { ReactNativeFile, File } from 'apollo-upload-client'
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';


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
  const _onPressSignOut = async (
    setDisplayInput,
    client,
    sendbird,
  ): Promise<void> => {
    const savedUserKey = 'savedUser';
    const userPoolId = process.env.React_App_UserPoolId;
    const clientId = process.env.React_App_AWS_Client_Id;
    var poolData = {
      UserPoolId: userPoolId, // Your user pool id here
      ClientId: clientId, // Your client id here
    };
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
    AsyncStorage.clear();
    sendbird.disconnect();
    setDisplayInput(false);
    client.resetStore();
    console.log('Succesful signout');
  };

export {_onPressSignOut}
