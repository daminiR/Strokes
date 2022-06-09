import React, {useReducer, useContext, createContext, useRef, useEffect, useState} from "react";
import * as AWS from 'aws-sdk/global';
import _ from 'lodash'
import { Platform } from 'react-native';
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
  var poolData = {
    UserPoolId: 'us-east-1_idvRudgcB', // Your user pool id here
    ClientId: '5db5ndig7d4dei9eiviv06v59f', // Your client id here
  };
var userPool = new CognitoUserPool(poolData);
  var userData = {
    Username: username,
    Pool: userPool,
  };
var cognitoUser = new CognitoUser(userData);
var cognitoUser = new CognitoUser(userData);
return await new Promise((resolve, reject) => {
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accessToken = result.getAccessToken().getJwtToken();
      //POTENTIAL: Region needs to be set if not already set previously elsewhere.
      AWS.config.region = 'us-east-1';
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:5861edfa-f218-44ee-bbd7-34fd89e151f6', // your identity pool id here
        Logins: {
          // Change the key below according to the specific region your user pool is in.
          'cognito-idp.us-east-1.amazonaws.com/us-east-1_idvRudgcB': result
            .getIdToken()
            .getJwtToken(),
        },
      });
      //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
      AWS.config.credentials.refresh((error) => {
        if (error) {
          console.error(error);
          reject(error);
          return;
        } else {
          // Instantiate aws sdk service objects now that the credentials have been updated.
          // example: var s3 = new AWS.S3();
          console.log('Successfully logged!');
          // on success remember device
          cognitoUser.getCachedDeviceKeyAndPassword();
          cognitoUser.setDeviceStatusRemembered({
            onSuccess: function (result) {
              console.log('call result: ' + result);
              resolve({session: accessToken, confirmedUser: cognitoUser});
            },
            onFailure: function (err) {
              alert(err.message || JSON.stringify(err));
              reject(err);
              return;
            },
          });
        }
      });
    },
    onFailure: function (err) {
      alert(err.message || JSON.stringify(err));
      reject(err);
      return;
    },
  });
  })
}
const getAWSUser = async () => {
  var poolData = {
    UserPoolId: 'us-east-1_idvRudgcB', // Your user pool id here
    ClientId: '5db5ndig7d4dei9eiviv06v59f', // Your client id here
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
        //cognitoUser.signOut();
        //AsyncStorage.clear();
        console.log('Succesful signout');
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
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:5861edfa-f218-44ee-bbd7-34fd89e151f6', // your identity pool id here
            Logins: {
              // Change the key below according to the specific region your user pool is in.
              'cognito-idp.us-east-1.amazonaws.com/us-east-1_idvRudgcB': session
                .getIdToken()
                .getJwtToken(),
            },
          });
          // get user profile
          // Instantiate aws sdk service objects now that the credentials have been updated.
          // example: var s3 = new AWS.S3();
          return;
        });
      } else if (cognitoUser == null) {
        // no user loaded from local storage
        resolve(null);
      }
    }
  });
  })
};

export {getAWSUser, authenticateAWS}
