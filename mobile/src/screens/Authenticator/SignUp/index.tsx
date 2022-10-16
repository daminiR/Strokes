import React, { useReducer, useEffect, useContext, useState, ReactElement } from 'react'
import {useLazyQuery, useMutation} from '@apollo/client'
import { useFormikContext, Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import {ApolloClient, ApolloProvider} from '@apollo/client'
import {signUpSlides, intitialFormikSignUp, TOTAL_SIGNUP_SLIDES} from '@constants'
import {  RootStackSignOutParamList } from 'src/navigation'
import AppIntroSlider from 'react-native-app-intro-slider'
import {ADD_PROFILE2 } from '@graphQL2'
import  { createUploadLink } from 'apollo-upload-client';
import {ProfileFields} from '@localModels';
import { loginReducer } from '../../../reducers/Login';
import * as Keychain from 'react-native-keychain';

import {
  CityInput,
  ConfirmationCode,
  PasswordInput,
  PhoneInput,
  GenderInput,
  EmailInput,
  BirthdayInput,
  NameInput,
  DescriptionInput,
  ImageInput,
  SportsInput,
  Cancel,
  NextButton,
  PrevButton,
  AppContainer,
} from '@components';
import {connect} from '../../../utils/SendBird'
import {registerOnMongoDb, authenticateAWS, initializeClient} from '@utils'
import { UserContext} from '@UserContext'
import {Keyboard, View, KeyboardAvoidingView, Platform} from 'react-native'
import  _ from 'lodash'
import { styles } from '@styles'
import  { signUpSchema} from '@validation'
import {RootRefreshContext} from '../../../index.js'
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'SIGNUP'>
type SignUpT = {
  navigation: SignUpScreenNavigationProp
}
const fullValidatorForSchema = (schema) => (values) => schema.validate(values, {
  abortEarly: false,
  strict: false,
}).then(() => ({})).catch(({inner}) => inner.reduce((memo, {path, message}) => ({
  ...memo,
  [path]: (memo[path] || []).concat(message),
}), {}))
const SignUp = ({ navigation }: SignUpT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error2, setError] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(0)
  return (
    <Formik
      validationSchema={signUpSchema}
      //validate={fullValidatorForSchema(signUpSchema)}
      initialValues={intitialFormikSignUp}
      onSubmit={(values) =>
      console.log()}>
      <Slider/>
    </Formik>
  );
}
const Slider =  () => {
  const [state, dispatch] = useReducer(loginReducer, {
    userId: '',
    nickname: '',
    error: '',
    connecting: false,
  });
  const {values, errors, setFieldValue, setFieldTouched, touched} = useFormikContext<ProfileFields>();
  const {setIsUseOnMongoDb, sendbird, onLogin, setSendbird} = useContext(UserContext)
  const [lastSlide, setLastSlide] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [AWSCognitoUser, setAWSCogUserUser] = useState(null)
  const [newAuthClient, setAuthClient] = useState(null)
  const [newUserToken, setNewUserToken] = useState(null)
  const [index, setIndex] = useState(0)
  const [showNextButton, setShowNextButton] = useState(true)
  const [canSignUp, setCanSignUp] = useState(true)
  const [noUserFoundMessage, setNoUserFoundMessage] = useState(null)
  const navigation = useNavigation()
  const {setLoadingSignUInRefresh} = useContext(RootRefreshContext)
  //const [createSquash2, {client, data}] = useMutation(ADD_PROFILE2, {
  const [createSquash2] = useMutation(ADD_PROFILE2, {
    ignoreResults: false,
    //client: newAuthClient,
    context:  {
              headers: {
                //"authorization": newUserToken ? `Bearer ${newUserToken}` : 'nothin',
                //"authorization": newUserToken ? `Bearer ${newUserToken}` : 'nothin',
                //authorization: newUserToken ? `Bearer ${newUserToken}` : '',
                authorization: 'sdfalfdajlfas',
              },
    },
    onCompleted: (data) => {
      console.log('createSquash2 no err', data);
    },
    onError: (err) => {
      console.log('createSquash2 err', err);
    },
  });
  const [isKeyboardShown, setIsKeyboardShown] = useState(undefined);
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
    setIndex(index)
    if (index == TOTAL_SIGNUP_SLIDES - 1){
      setLastSlide(true)
      setShowNextButton(false)
    }
    //else if (index == TOTAL_SIGNUP_SLIDES - 2){
      //setShowNextButton(false)
    //}
    else {
      setShowNextButton(true)
    }
  }
  const renderNext = () => {
    return <NextButton />;
  };
  const renderPrev = () => {
    return <PrevButton />;
  };
  const [authMessage, setAuthMessage] = useState(null);
  const _checkSignIn = () => {
    // TODO: need to disable user in aws and prevent signup as well
  !errors['password'] &&
    _confirmSignInGC();
  };
  const start = user => {
    if (onLogin) {
      onLogin(user);
    }
  };

const _confirmSignInGC = () => {
  setLoadingSubmit(true);
  const userPoolId = process.env.React_App_UserPoolId;
  const clientId = process.env.React_App_AWS_Client_Id;
  var poolData = {
    UserPoolId: userPoolId, // Your user pool id here
    ClientId: clientId, // Your client id here
    //groupName: 'users_v1',
  };
  var userPool = new CognitoUserPool(poolData);
  var dataEmail = {
    Name: 'email',
    Value: values.email,
  };
  var dataPhoneNumber = {
    Name: 'phone_number',
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
        console.log("in signup")
        alert(err.message || JSON.stringify(err));
        setLoadingSubmit(true);
        return;
      }
      var cognitoUser = result.user;
      authenticateAWS(values.phoneNumber, values.password).then(
         ( userDetails) => {
          userDetails.confirmedUser.getUserAttributes( (err, attributes) => {
            if (err) {
              console.log('Attribute Error in signup', err);
              return;
            } else {
              setNewUserToken(userDetails.session);
              attributes = attributes;
              const _id = _.find(attributes, {Name: 'sub'}).Value;
              setLoadingSignUInRefresh(true);
              setLoadingSubmit(true);
              initializeClient().then((newClient) => {
                registerOnMongoDb(
                  values,
                  _id,
                  createSquash2,
                  userDetails.session,
                  newClient,
                )
                  .then(async () => {
                    connect(
                      _id,
                      values.first_name,
                      dispatch,
                      sendbird,
                      start,
                      setSendbird,
                    );
                    Keychain.setGenericPassword(
                      values.phoneNumber,
                      values.password,
                      {
                        service:
                          'org.reactjs.native.example.sports-app-keychain-password',
                        accessControl:
                          Keychain.ACCESS_CONTROL
                            .BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
                        accessible:
                          Keychain.ACCESSIBLE
                            .WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
                        authenticationType:
                          Keychain.AUTHENTICATION_TYPE
                            .DEVICE_PASSCODE_OR_BIOMETRICS,
                      },
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
                    setAuthMessage('unable to upload information to the cloud');
                    setLoadingSignUInRefresh(false);
                    setLoadingSubmit(false);
                  });
              });
            }
          });
        },
      );
      // authenticate
      //this.slider.goToSlide(index + 1, true);
    },
  );
};
const _awsConfirmOTP =  () => {
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
  setAWSCogUserUser(cognitoUser);
  cognitoUser.confirmRegistration(
    values.confirmationCode,
    true,
    function (err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log('call result: ' + result);
      authenticateAWS(values.phoneNumber, values.password).then(
        (userDetails) => {
          userDetails.confirmedUser.getUserAttributes( (err, attributes) => {
            if (err) {
              console.log('Attribute Error in signup', err);
              return;
            } else {
              setNewUserToken(userDetails.session);
              attributes = attributes;
              const _id = _.find(attributes, {Name: 'sub'}).Value;
              setLoadingSignUInRefresh(true);
              setLoadingSubmit(true);
              initializeClient().then((newClient) => {
                console.log('so we changed the client with token correct?', newClient);
                registerOnMongoDb(
                  values,
                  _id,
                  createSquash2,
                  userDetails.session,
                  newClient
                )
                  .then(() => {
                    connect(
                      _id,
                      values.first_name,
                      dispatch,
                      sendbird,
                      start,
                      setSendbird,
                    );
                    console.log('logged in');
                    setIsUseOnMongoDb(true);
                    setLoadingSubmit(false);
                    setLoadingSignUInRefresh(false);
                  })
                  .catch(async (err) => {
                    console.log(err);
                    // this error reallu shoudnt happen
                    setAuthMessage('unable to upload information to the cloud');
                    setLoadingSignUInRefresh(false);
                    setLoadingSubmit(false);
                  });
              });
            }
          });
        },
      );
    },
  );
};

  const _onPrev = () => {
    const index = this.slider.state.activeIndex
    this.slider.goToSlide(index - 1, true)
  };
  const _onNext = () => {
    const index = this.slider.state.activeIndex;
    console.log(index);
    const field = _.find(signUpSlides, ['key', index.toString()]).inputLabel;
    //console.log(signUpSlides)
    console.log(field);
    console.log(touched);
    //setFieldTouched(field)
    if (field == 'image_set') {
      !errors[field] && this.slider.goToSlide(index + 1, true);
    } else {
      !errors[field] &&
        //touched[field] &&
        this.slider.goToSlide(index + 1, true);
    }
  };
  const resendCode = () => {
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
    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log('call result: ' + result);
    });
  };
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
                    <PhoneInput />
                  </KeyboardAvoidingView>
                </>
              );
              break
            case 'Email Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}>
                    <EmailInput isSignUp={true} />
                  </KeyboardAvoidingView>
                </>
              );
              break
            case 'Name Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}>
                    <NameInput isSignUp={true} />
                  </KeyboardAvoidingView>
                </>
              );
              break
            case 'Birthday Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
                  <BirthdayInput isSignUp={true}/>
        </KeyboardAvoidingView>
                </>
              )
              break
            case 'Gender Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}>
                    <GenderInput isSignUp={true} />
                  </KeyboardAvoidingView>
                </>
              );
              break
            case 'Sports Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <SportsInput isSignUp={true}/>
                </>
              )
              break
            case 'Image Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <View style={{alignSelf:'center'}}>
                    <ImageInput isSignUp={true} />
                  </View>
                </>
              );
              break
            case 'Description Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}>
                    <DescriptionInput isSignUp={true} />
                  </KeyboardAvoidingView>
                </>
              );
              break
            case 'Neighborhood Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <CityInput isSignUp={true}/>
                </>
              )
              break
            case 'Password':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <View style={styles.emailContainer}>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                      style={{flex: 1}}>
                      <PasswordInput
                        authMessage={authMessage}
                        noUserFoundMessage={noUserFoundMessage}
                        isLastSlide={lastSlide}
                        _confirmSignInGC={_checkSignIn}
                        isSignIn={false}
                      />
                    </KeyboardAvoidingView>
                  </View>
                </>
              );
              break
          }
  };
const [visible, setVisible] = useState(false);
  return (
    <>
      <AppContainer loading={loadingSubmit}>
        <AppIntroSlider
          renderItem={renderInputForm}
          data={signUpSlides}
          scrollEnabled={false}
          showPrevButton={true && !isKeyboardShown}
          showDoneButton={false}
          onSlideChange={(index, lastIndex) => _onSlideChange(index, lastIndex)}
          showNextButton={showNextButton && !isKeyboardShown}
          renderNextButton={renderNext}
          renderPrevButton={renderPrev}
          dotClickEnabled={true}
          keyboardShouldPersistTaps="always"
          onNext={() => _onNext()}
          onPrev={() => _onPrev()}
          ref={(ref) => (this.slider = ref!)}
        />
      </AppContainer>
    </>
  );
}
export { SignUp }
