import AsyncStorage from '@react-native-async-storage/async-storage'
import * as mime from 'react-native-mime-types'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
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
    setLoadingSignUInRefresh,
    setCurrentUser,
    setClient
  ): Promise<void> => {
    const userPoolId = process.env.React_App_UserPoolId;
    const clientId = process.env.React_App_AWS_Client_Id;
    var poolData = {
      UserPoolId: userPoolId, // Your user pool id here
      ClientId: clientId, // Your client id here
    };
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
    //todo find all storages that indvidually need to be cleared
    //AsyncStorage.clear();
    sendbird.disconnect();
    PushNotificationIOS.removeAllPendingNotificationRequests();
    setDisplayInput(false);
    client.resetStore();
    setClient(null)
    setCurrentUser(null)
    console.log('Succesful signout');
  };

export {_onPressSignOut}
