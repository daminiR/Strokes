import React from "react";
import * as AWS from 'aws-sdk/global';
import _ from 'lodash'
import {
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  View,
  FlatList,
  AppState,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import AsyncStorage from '@react-native-async-storage/async-storage'

const authenticateAWS = async (username, password)  => {
  console.log("do we pass the correct info", username, password)
var authenticationData = {
	Username: username,
	Password: password,
};
var authenticationDetails = new AuthenticationDetails(
	authenticationData
);
const userPoolId = process.env.React_App_UserPoolId
const clientId = process.env.React_App_AWS_Client_Id
  var poolData = {
    UserPoolId: userPoolId, // Your user pool id here
    ClientId: clientId, // Your client id here
  };
var userPool = new CognitoUserPool(poolData);
  var userData = {
    Username: username,
    //preferred_username: username,
    Pool: userPool,
  };
var cognitoUser = new CognitoUser(userData);
return await new Promise((resolve, reject) => {
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      console.log("i dont think we make it here")
      var accessToken = result.getAccessToken().getJwtToken();
      var idToken = result.getIdToken().getJwtToken();
          cognitoUser.getCachedDeviceKeyAndPassword();
          cognitoUser.setDeviceStatusRemembered({
            onSuccess: function (result) {
              console.log('call result: ' + result);
              resolve({session: accessToken, confirmedUser: cognitoUser});
            },
            onFailure: function (err) {
            console.log("on failure")
              alert(err.message || JSON.stringify(err));
              reject(err);
              return;
            },
          });
      ////POTENTIAL: Region needs to be set if not already set previously elsewhere.
      //AWS.config.region = 'us-east-1';
      //AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //IdentityPoolId: 'us-east-1:5861edfa-f218-44ee-bbd7-34fd89e151f6', // your identity pool id here
        //Logins: {
          //// Change the key below according to the specific region your user pool is in.
          //'cognito-idp.us-east-1.amazonaws.com/us-east-1_idvRudgcB': result
            //.getIdToken()
            //.getJwtToken(),
        //},
      //});
      ////refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
      //AWS.config.credentials.refresh((error) => {
        //if (error) {
          //console.error(error);
          //reject(error);
          //return;
        //} else {
          //// Instantiate aws sdk service objects now that the credentials have been updated.
          //// example: var s3 = new AWS.S3();
          //console.log('Successfully logged!');
          //// on success remember device
        //}
      //});
    },
    onFailure: function (err) {
      console.log("on failure 2:w ")
      alert(err.message || JSON.stringify(err));
      reject(err);
      return;
    },
  });
  })
}
const getAWSUser = async () => {
    const userPoolId = process.env.React_App_UserPoolId;
    const clientId = process.env.React_App_AWS_Client_Id;
    var poolData = {
      UserPoolId: userPoolId, // Your user pool id here
      ClientId: clientId, // Your client id here
    };
  var userPool = new CognitoUserPool(poolData);
  var attributes = null as any
  return await new Promise((resolve, reject) => {
  userPool.storage.sync(function (err, result) {
    if (err) {
      console.log("UserPool Error", err)
      reject(err)
      return
    } else if (result === 'SUCCESS') {
      var cognitoUser = userPool.getCurrentUser();
      // Continue with steps in Use case 16
      if (cognitoUser != null) {
        // TODO: signout when user tolen saved but can't be found on device -> dispaly white screen
        //cognitoUser.signOut();
        //AsyncStorage.clear();
        //console.log('Succesful signout');
        cognitoUser.getSession(function (err, session) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            reject(err);
            return;
          }
          console.log('session validity: ' + session.isValid());
          // NOTE: getSession must be called to authenticate user before calling getUserAttributes
          cognitoUser.getUserAttributes(function (err, attributes) {
            if (err) {
              reject(err);
              return;
              // Handle error
            } else {
              attributes = attributes;
              console.log(
                'whate are the attributes',
                _.find(attributes, {Name: 'sub'}).Value,
              );
              // Do something with attributes
              const awsUser =  _.chain(attributes).keyBy('Name').mapValues('Value').value()
              resolve({session: session, attributes: awsUser});
            }
          });
          //AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            //IdentityPoolId: 'us-east-1:5861edfa-f218-44ee-bbd7-34fd89e151f6', // your identity pool id here
            //Logins: {
              //// Change the key below according to the specific region your user pool is in.
              //'cognito-idp.us-east-1.amazonaws.com/us-east-1_idvRudgcB': session
                //.getIdToken()
                //.getJwtToken(),
            //}, }); // get user profile Instantiate aws sdk service objects now that the credentials have been updated.  example: var s3 = new AWS.S3(); return;
        });
      } else if (cognitoUser == null) {
        // no user loaded from local storage
        console.log("no user loaded")
        resolve(null);
      }
    }
  });
  })
};

const VerificationAlert = (phoneNumber, password) => {
        Alert.prompt(
            "Enter Verification Code",
              "Code?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: code =>
            {
            console.log("did weeeeeeeee amke is in cooooooooodddddddd")
            confirmPassword(phoneNumber, code, "Turing123!")
            //.then(() => console.log("correct?"))
            //.catch((err) => console.log(err))
          },
        }
      ],
      "secure-text"
    );

}
// confirmPassword can be separately built out as follows...
const  confirmPassword = (username, verificationCode, newPassword) => {
const userPoolId = process.env.React_App_UserPoolId
const clientId = process.env.React_App_AWS_Client_Id
  var poolData = {
    UserPoolId: userPoolId, // Your user pool id here
    ClientId: clientId, // Your client id here
  };
var userPool = new CognitoUserPool(poolData);
  var userData = {
    Username: username,
    //: username,
    Pool: userPool,
  };
var cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onFailure(err) {
                reject(err);
            },
            onSuccess() {
                resolve();
            },
        });
    });
}
const forgotPassword =(username, newPassword, setPassword, setCode) => {
    // const poolData = { UserPoolId: xxxx, ClientId: xxxx };
    // userPool is const userPool = new AWSCognito.CognitoUserPool(poolData);

    // setup cognitoUser first
const userPoolId = process.env.React_App_UserPoolId
const clientId = process.env.React_App_AWS_Client_Id
  var poolData = {
    UserPoolId: userPoolId, // Your user pool id here
    ClientId: clientId, // Your client id here
  };
var userPool = new CognitoUserPool(poolData);
  var userData = {
    Username: username,
    //: username,
    Pool: userPool,
  };
var cognitoUser = new CognitoUser(userData);
    // call forgotPassword on cognitoUser
    cognitoUser.forgotPassword({
        onSuccess: function(result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        },
      inputVerificationCode: (data) => { // this is optional, and likely won't be implemented as in AWS's example (i.e, prompt to get info)
        console.log("data", data)
        VerificationAlert(username, newPassword)
        //cognitoUser.confirmPassword(code, password, this);
        }
    });
}
export {getAWSUser, authenticateAWS, forgotPassword}
