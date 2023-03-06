import React from "react";
import {initializeClient} from '@utils'
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

const _confirmSignInGC = (
  setLoadingSubmit,
  values,
  setNewUserToken,
  registerOnMongoDb,
  initializeClient,
  setLoadingSignUInRefresh,
  createSquash2,
  setAuthMessage
) => {
  setLoadingSubmit(true);
  const userPoolId = process.env.React_App_UserPoolId;
  const clientId = process.env.React_App_AWS_Client_Id;
  var poolData = {
    UserPoolId: userPoolId, // Your user pool id here
    ClientId: clientId, // Your client id here
  };
  var userPool = new CognitoUserPool(poolData);
  var dataEmail = {
    Name: "email",
    Value: values.email,
  };
  var dataPhoneNumber = {
    Name: "phone_number",
    Value: values.phoneNumber,
  };
  var attributeEmail = new CognitoUserAttribute(dataEmail);
  var attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
  var attributeList = [];
  attributeList.push(attributeEmail);
  attributeList.push(attributePhoneNumber);
  userPool.signUp(
    values.phoneNumber,
    values.password,
    attributeList,
    null,
    (err, result) => {
      if (err) {
        //alert(err.message || JSON.stringify(err));
        alert("sign in error");
        setLoadingSubmit(true);
        return;
      }
      var cognitoUser = result.user;
      authenticateAWS(values.phoneNumber, values.password).then(
        (userDetails) => {
          userDetails.confirmedUser.getUserAttributes((err, attributes) => {
            if (err) {
              console.log("Attribute Error in signup", err);
              return;
            } else {
              setNewUserToken(userDetails.session);
              attributes = attributes;
              const _id = _.find(attributes, { Name: "sub" }).Value;
              setLoadingSignUInRefresh(true);
              setLoadingSubmit(true);
              initializeClient().then((newClient) => {
                registerOnMongoDb(
                  values,
                  _id,
                  createSquash2,
                  userDetails.session,
                  newClient
                )
                  .then(async () => {
                    connect(
                      _id,
                      values.first_name,
                      dispatch,
                      sendbird,
                      start,
                      setSendbird
                    );
                    Keychain.setGenericPassword(
                      values.phoneNumber,
                      values.password,
                      {
                        service:
                          "org.reactjs.native.example.sports-app-keychain-password",
                        accessControl:
                          Keychain.ACCESS_CONTROL
                            .BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
                        accessible:
                          Keychain.ACCESSIBLE
                            .WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
                        authenticationType:
                          Keychain.AUTHENTICATION_TYPE
                            .DEVICE_PASSCODE_OR_BIOMETRICS,
                      }
                    )
                      .then((data) => {
                        //setIsUseOnMongoDb(true);
                        setLoadingSubmit(false);
                        setLoadingSignUInRefresh(false);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  })
                  //})
                  .catch(async (err) => {
                    console.log(err);
                    // this error reallu shoudnt happen
                    setAuthMessage("unable to upload information to the cloud");
                    setLoadingSignUInRefresh(false);
                    setLoadingSubmit(false);
                  });
              });
            }
          });
        }
      );
      // authenticate
      //this.slider.goToSlide(index + 1, true);
    }
  );
};

import {connect} from '@utils'
import * as Keychain from 'react-native-keychain';
const getCognitoUser = (values) => {
  const userPoolId = process.env.React_App_UserPoolId;
  const clientId = process.env.React_App_AWS_Client_Id;
  var poolData = {
    UserPoolId: userPoolId, // Your user pool id here
    ClientId: clientId, // Your client id here
  };
  var userPool = new CognitoUserPool(poolData);
  var userData = {
    Username: values.phoneNumber,
    Pool: userPool,
  };
  var cognitoUser = new CognitoUser(userData);
  return cognitoUser
}
const authAndMongo = (
  values,
  setNewUserToken,
  setLoadingSignUInRefresh,
  setLoadingSubmit,
  registerOnMongoDb,
  createSquash2,
  dispatch,
  sendbird,
  start,
  setSendbird,
  setAuthMessage
) => {
  authenticateAWS(values.phoneNumber, values.password).then((userDetails) => {
    userDetails.confirmedUser.getUserAttributes((err, attributes) => {
      if (err) {
        console.log("Attribute Error in signup", err);
        return;
      } else {
        setNewUserToken(userDetails.session);
        attributes = attributes;
        const _id = _.find(attributes, { Name: "sub" }).Value;
        setLoadingSignUInRefresh(true);
        setLoadingSubmit(true);
        initializeClient().then((newClient) => {
          registerOnMongoDb(
            values,
            _id,
            createSquash2,
            userDetails.session,
            newClient
          )
            .then(async () => {
              connect(
                _id,
                values.first_name,
                dispatch,
                sendbird,
                start,
                setSendbird
              );
              Keychain.setGenericPassword(values.phoneNumber, values.password, {
                service:
                  "org.reactjs.native.example.sports-app-keychain-password",
                accessControl:
                  Keychain.ACCESS_CONTROL
                    .BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
                accessible:
                  Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
                authenticationType:
                  Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
              })
                .then((data) => {
                  //setIsUseOnMongoDb(true);
                  setLoadingSubmit(false);
                  setLoadingSignUInRefresh(false);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((err) => {
              console.log(err);
            })
            //})
            .catch(async (err) => {
              console.log(err);
              // this error reallu shoudnt happen
              setAuthMessage("unable to upload information to the cloud");
              setLoadingSignUInRefresh(false);
              setLoadingSubmit(false);
            });
        });
      }
    });
  });
  //authenticate;
  //this.slider.goToSlide(index + 1, true);
};

const authenticateAWS = async (username, password)  => {
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
      var accessToken = result.getAccessToken().getJwtToken();
      var idToken = result.getIdToken().getJwtToken();
          cognitoUser.getCachedDeviceKeyAndPassword();
          cognitoUser.setDeviceStatusRemembered({
            onSuccess: function (result) {
              console.log('call result: ' + result);
              resolve({session: accessToken, confirmedUser: cognitoUser});
            },
            onFailure: function (err) {
              //alert(err.message || JSON.stringify(err));
              alert("oops we ran into some error!");
              reject(err);
              return;
            },
          });
    },
    onFailure: function (err) {
      //alert(err.message || JSON.stringify(err));
      alert("oops we ran into some error!");
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
            //alert(err.message || JSON.stringify(err));
            alert("oops we ran into some error!");
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
              //console.log(
                //'whate are the attributes',
                //_.find(attributes, {Name: 'sub'}).Value,
              //);
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
        resolve(null);
      }
    }
  });
  })
};

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
const forgotPassword = (username) => {
  // const poolData = { UserPoolId: xxxx, ClientId: xxxx };
  // userPool is const userPool = new AWSCognito.CognitoUserPool(poolData);

  // setup cognitoUser first
  const userPoolId = process.env.React_App_UserPoolId;
  const clientId = process.env.React_App_AWS_Client_Id;
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
    onSuccess: function (result) {
      console.log("call result: " + result);
    },
    onFailure: function (err) {
      alert(err);
    },
  });
};
export {
  getCognitoUser,
  authAndMongo,
  confirmPassword,
  getAWSUser,
  authenticateAWS,
  forgotPassword,
};
