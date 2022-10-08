import React, { useReducer, useEffect, useContext, useState, ReactElement } from 'react'
import {connect} from '../../../utils/SendBird'
import {getPassword, setNewKeychain} from '@utils'
import { useFormikContext, Formik} from 'formik';
import * as Keychain from 'react-native-keychain';
import { StackNavigationProp } from '@react-navigation/stack'
import {signInSlides, iniitialSignInForm} from '@constants'
import {  RootStackSignOutParamList } from '@navigationStack'
import AppIntroSlider from 'react-native-app-intro-slider'
import {ProfileFields} from '@localModels';
import {AppContainer, ConfirmationCode, PasswordInput, Cancel, PhoneInput, NextButton, PrevButton} from '@components'
import {useNavigation} from '@react-navigation/native'
import { CHECK_PHONE_INPUT } from '@graphQL2'
import {View, Keyboard, Alert} from 'react-native'
import {styles }from '@styles'
import  { signInSchema } from '@validation'
import { UserContext} from '@UserContext'
import { forgotPassword } from '@utils'
import {useLazyQuery, useQuery} from '@apollo/client'
import {RootRefreshContext} from '../../../index.js'
import  _ from 'lodash'
import * as AWS from 'aws-sdk/global';
import { loginReducer } from '../../../reducers/Login';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';

type SignInScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'SIGN_IN'>
type SignInT = {
  navigation: SignInScreenNavigationProp
}
const SignIn = ({ navigation }: SignInT): ReactElement => {
  return (
    <Formik
      validationSchema={signInSchema}
      initialValues={iniitialSignInForm}
      onSubmit={(values) => console.log(values)}>
         { ({errors,touched}) => {
             console.log(errors)
             return (
      <Slider changeEmail={false}/>
         )}}
    </Formik>
  );
}

export const Slider =  ({changeEmail}) => {
  const [state, dispatch] = useReducer(loginReducer, {
    userId: '',
    nickname: '',
    error: '',
    connecting: false,
  });
  const {validateField, setTouched, values, handleChange, errors, touched, setFieldTouched, setFieldValue} = useFormikContext<ProfileFields>();
  const [lastSlide, setLastSlide] = useState(false)
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const [overLayIsNewPassword, setOverLayPassword] = useState(false)
  const navigation = useNavigation()
  const [index, setIndex] = useState(0)
  const [canSignIn, setCanSignIn] = useState(true)
  const [noUserFoundMessage, setNoUserFoundMessage] = useState(null)
  const [credentials, setCredentials] = useState(null)
  const [showNextButton, setShowNextButton] = useState(true)
  const [isFaceID, setIsFaceID] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [isKeyboardShown, setIsKeyboardShown] = useState(undefined);
  const {setLoadingSignUInRefresh} = useContext(RootRefreshContext)
  const [checkPhoneInput, {data: userPhoneInfo}] = useLazyQuery(CHECK_PHONE_INPUT, {
    onCompleted: (data) => {
      console.log("Error gqlsecure: whats data here", data)
      if (
        data.checkPhoneInput.isPhoneExist == true &&
        data.checkPhoneInput.isDeleted == false
      ) {
          this.slider.goToSlide(2);
          setCanSignIn(true);
      } else {
        this.slider.goToSlide(index + 1, true);
        setCanSignIn(false);
      }
    },
    onError: (err) => {
      console.log('phone query', err);
    },
  });
  // show keychain if in values first
  //

  useEffect(() => {
    //setNewKeychain("+17652500332","Wrong123!")
    getPassword(setCredentials, setFieldValue, setIsFaceID)
    this.slider.goToSlide(index + 1, true);
  }, []);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardShown(true);
      console.log("shown")
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardShown(false);
      console.log("not shown")
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const _onSlideChange = (index, last_index) => {
    console.log(index)
    console.log("did we make it:w")
    setIndex(index)
    if (index == 1){
      setLastSlide(true)
      setShowNextButton(false)
    }
    else {
      setShowNextButton(true)
    }
  }
  const _signIn = () => {
    this.slider.goToSlide(2);
    // here see from cognito is user exists if not -> i mean i dont think you need to check anymore!!
    //checkPhoneInput({variables: {phoneNumber: values.phoneNumber}});
  }
  const renderNext = () => {
    return <NextButton />;
  };

  //const _onPrev = () => {
    //errors && touched && this.slider.goToSlide(this.slider.state.activeIndex - 1, true)
  //};
  const _onNext = () => {
    console.log("signin slides", signInSlides)
    const index = this.slider.state.activeIndex;
    const field = _.find(signInSlides, ['key', index.toString()]).inputLabel;
    setFieldTouched(field);
    if (index == 0) {
      !errors[field] && touched[field] && _signIn();
    } else {
      !errors[field] &&
        touched[field] &&
        this.slider.goToSlide(index + 1, true);
    }
  };
const _forgotPassword = () => {
  forgotPassword(values.phoneNumber)
  navigation.navigate('FORGOT_PASSWORD', {phoneNumber: values.phoneNumber});

}
const _confirmSignInGC = () => {
  setLoadingSignUInRefresh(true);
  const userPoolId = process.env.React_App_UserPoolId;
  const clientId = process.env.React_App_AWS_Client_Id;
  var poolData = {
    UserPoolId: userPoolId, // Your user pool id here
    ClientId: clientId, // Your client id here
  };
  var authenticationData = {
    Username: values.phoneNumber,
    Password: values.password,
  };
  var authenticationDetails = new AuthenticationDetails(authenticationData);
  var userPool = new CognitoUserPool(poolData);

  var userData = {
    Username: values.phoneNumber,
    Pool: userPool,
  };
  var cognitoUser = new CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accessToken = result.getAccessToken().getJwtToken();
          cognitoUser.getCachedDeviceKeyAndPassword();
          cognitoUser.setDeviceStatusRemembered({
            onSuccess: function (result) {
              console.log('call result: ' + result);
              setLoadingSignUInRefresh(false);
              if (values.password != credentials.password)
              Alert.alert(
                "Add new password to keychain?",
                "Do you want to replace existing password with new password",
                [
                  {
                    text: "yes",
                    onPress: () => setNewKeychain(values.phoneNumber, values.password)
                  },
                  {
                    text: "no",
                    onPress: () => {}
                  }
                ]
              )
              //setNewKeychain(values.phoneNumber, values.password)
            },
            onFailure: function (err) {
              alert(err.message || JSON.stringify(err));
              setLoadingSignUInRefresh(false);
            },
          });
      //POTENTIAL: Region needs to be set if not already set previously elsewhere.
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
      //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
      //AWS.config.credentials.refresh((error) => {
        //if (error) {
          //console.error(error);
          //setLoadingSignUInRefresh(false);
        //} else {
          //// Instantiate aws sdk service objects now that the credentials have been updated.
          //// example: var s3 = new AWS.S3();
          //console.log('Successfully logged!');
          //// on success remember device
          //cognitoUser.getCachedDeviceKeyAndPassword();
          //cognitoUser.setDeviceStatusRemembered({
            //onSuccess: function (result) {
              //console.log('call result: ' + result);
              //setLoadingSignUInRefresh(false);
            //},
            //onFailure: function (err) {
              //alert(err.message || JSON.stringify(err));
              //setLoadingSignUInRefresh(false);
            //},
          //});
        //}
      //});
      //setLoadingSignUInRefresh(false);
    },
    onFailure: function (err) {
      alert(err.message || JSON.stringify(err));
      setLoadingSignUInRefresh(false);
    },
  });
};
const _checkSignIn = () => {
  canSignIn
    ? _confirmSignInGC()
    : userPhoneInfo.checkPhoneInput.isDeleted
    ? setNoUserFoundMessage(
        'User was deleted in the past few months, cannot sign in yet',
      )
    : /// user doesnt exist  so he CAN NOT sign in(firebase allwos autmatic phon sigin ) again, but msg is left vague to prevent
      setNoUserFoundMessage('invalid code or phone number');
}
const [authMessage, setAuthMessage] = useState(null)
  const _onPressCancel = () => {
    navigation.navigate('HELLO');
  }
  const renderInputForm = ({item}) => {
          switch (item.type) {
            case 'Phone Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <PhoneInput faceID={isFaceID}/>
                </>
              );
              break
            case 'Confirmation Code':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <PasswordInput
                    authMessage={authMessage}
                    noUserFoundMessage={noUserFoundMessage}
                    isLastSlide={lastSlide}
                    _confirmSignInGC={_checkSignIn}
                    _forgotPassword={_forgotPassword}
                  />
                </>
              );
              break;
          }
  };

  const renderPrev = () => {
    return <PrevButton />;
  };
  const _onPrev = () => {
    const index = this.slider.state.activeIndex
    this.slider.goToSlide(index - 1, true)
  };
  return (
    <AppContainer loading={loadingSubmit}>
      <AppIntroSlider
        renderItem={renderInputForm}
        data={signInSlides}
        scrollEnabled={false}
        showPrevButton={true}
        showDoneButton={false}
        onSlideChange={(index, lastIndex) => _onSlideChange(index, lastIndex)}
        showNextButton={showNextButton && !isKeyboardShown}
        dotClickEnabled={false}
        renderNextButton={renderNext}
        renderPrevButton={renderPrev}
        onNext={() => _onNext()}
        onPrev={() => _onPrev()}
        ref={(ref) => (this.slider = ref!)}
      />
    </AppContainer>
  );
}
export { SignIn }
