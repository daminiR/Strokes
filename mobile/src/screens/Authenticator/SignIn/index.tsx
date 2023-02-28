import React, { useReducer, useEffect, useContext, useState, ReactElement } from 'react'
import {connect} from '../../../utils/SendBird'
import {getPassword, setNewKeychain, confirmPassword} from '@utils'
import { useFormikContext, Formik} from 'formik';
import * as Keychain from 'react-native-keychain';
import { StackNavigationProp } from '@react-navigation/stack'
import {signInSlides, iniitialSignInForm} from '@constants'
import {  RootStackSignOutParamList } from '@navigationStack'
import AppIntroSlider from 'react-native-app-intro-slider'
import {ProfileFields, SignInFields} from '@localModels';
import {AppContainer, ConfirmationCode, PasswordInput, Cancel, PhoneInput, NextButton, PrevButton, ResetPassword, ForgotPassword} from '@components'
import {useNavigation} from '@react-navigation/native'
import { CHECK_PHONE_INPUT } from '@graphQL2'
import {View, Keyboard, Alert, KeyboardAvoidingView, Platform} from 'react-native'
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
  const {values, errors, touched, setFieldTouched, setFieldValue} = useFormikContext<ProfileFields | SignInFields>();
  const [lastSlide, setLastSlide] = useState(false)
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
          setCanSignIn(true);
      } else {
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
    getPassword(setCredentials, setFieldValue, setIsFaceID).then( () => {
    //this.slider.goToSlide(index + 1, true);
    })
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
  const _resetPassword = () => {
    confirmPassword(
      values.phoneNumber,
      values.verificationCode,
      values.newPassword,
    ).then(() => {
      // ask to change password in keychain
      this.slider.goToSlide(0);
      Alert.alert(
        'Add new password to keychain?',
        'Do you want to replace existing password with new password',
        [
          {
            text: 'yes',
            onPress: () => setNewKeychain(values.phoneNumber, values.newPassword),
          },
          {
            text: 'no',
            onPress: () => {},
          },
        ],
      );
    });
  }
  const _onPresSetNewPassword = () => {
    this.slider.goToSlide(3);
    forgotPassword(values.phoneNumber)
  };
  const _onSlideChange = (index, last_index) => {
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
  }
  const renderNext = () => {
    return <NextButton />;
  };

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
  console.log(index)
  this.slider.goToSlide(1, true)
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
              // this should work when credenital is null and undefined, so also when logingin into a new device
              if (values.password != credentials?.password)
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
              //alert(err.message || JSON.stringify(err));
              alert("unable to remember device");
              setLoadingSignUInRefresh(false);
            },
          });
    },
    onFailure: function (err) {
      //alert(err.message || JSON.stringify(err));
      alert("oops we ran into some error!");
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
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}>
                    <View style={styles.phoneContainer}>
                      <View style={styles.forgotPasswordContainer1}>
                        <PhoneInput faceID={true}/>
                      </View>
                      <View style={styles.forgotPasswordContainer2}>
                        <PasswordInput
                          authMessage={authMessage}
                          noUserFoundMessage={noUserFoundMessage}
                          isLastSlide={lastSlide}
                          _confirmSignInGC={_checkSignIn}
                          _forgotPassword={_forgotPassword}
                        />
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                </>
              );
              break
            case 'Send Verification':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}>
                    <ForgotPassword
                      _onPresSetNewPassword={_onPresSetNewPassword}
                    />
                  </KeyboardAvoidingView>
                </>
              );
              break
            case 'Reset Password':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}>
                    <ResetPassword _resetPassword={_resetPassword} />
                  </KeyboardAvoidingView>
                </>
              );
              break;
          }
  };
  return (
    <AppContainer loading={loadingSubmit}>
      <AppIntroSlider
        renderItem={renderInputForm}
        data={signInSlides}
        scrollEnabled={false}
        onSlideChange={(index, lastIndex) => _onSlideChange(index, lastIndex)}
        dotClickEnabled={true}
        ref={(ref) => (this.slider = ref!)}
      />
    </AppContainer>
  );
}
export { SignIn }
