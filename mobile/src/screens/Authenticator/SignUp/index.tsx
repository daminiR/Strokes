import React, { useReducer, useEffect, useContext, useState, ReactElement } from 'react'
import {useLazyQuery, useMutation} from '@apollo/client'
import { useFormikContext, Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import {signUpSlides, intitialFormikSignUp, TOTAL_SIGNUP_SLIDES} from '@constants'
import {  RootStackSignOutParamList } from 'src/navigation'
import AppIntroSlider from 'react-native-app-intro-slider'
import {CHECK_PHONE_INPUT, ADD_PROFILE2 } from '@graphQL2'
import {ProfileFields} from '@localModels';
import { loginReducer } from '../../../reducers/Login';
import {
  NeighborhoodSearch,
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
import { registerOnFirebase, registerOnMongoDb, authenticateAWS} from '@utils'
import { UserContext} from '@UserContext'
import {Keyboard, View} from 'react-native'
import  _ from 'lodash'
import { styles } from '@styles'
import  { signUpSchema} from '@validation'
import {RootRefreshContext} from '../../../index.js'
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'SIGNUP'>
type SignUpT = {
  navigation: SignUpScreenNavigationProp
}
const SignUp = ({ navigation }: SignUpT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error2, setError] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(0)
  return (
    <Formik
      validationSchema={signUpSchema}
      initialValues={intitialFormikSignUp}
      onSubmit={(values) =>
      console.log()}>
      <Slider/>
    </Formik>
  );
}
const Slider =  () => {
  //const { sendbird, onLogin } = props;
  const [state, dispatch] = useReducer(loginReducer, {
    userId: '',
    nickname: '',
    error: '',
    connecting: false,
  });
  const {values, errors, setFieldValue, setFieldTouched, touched} = useFormikContext<ProfileFields>();
  const [newLocation, setNewLocation] = useState(null)
  const {setIsUseOnMongoDb, sendbird, onLogin, setSendbird} = useContext(UserContext)
  const [lastSlide, setLastSlide] = useState(false)
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [newUserToken, setNewUserToken] = useState(null)
  const [index, setIndex] = useState(0)
  const [showNextButton, setShowNextButton] = useState(true)
  const [canSignUp, setCanSignUp] = useState(false)
  const [noUserFoundMessage, setNoUserFoundMessage] = useState(null)
  const navigation = useNavigation()
  const {setLoadingSignUInRefresh} = useContext(RootRefreshContext)
  const [checkPhoneInput, {data: userPhoneInfo}] = useLazyQuery(CHECK_PHONE_INPUT, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log("canSignIn", data)
      if (
        data.checkPhoneInput.isPhoneExist == false &&
        data.checkPhoneInput.isDeleted == false
      ) {
        // TODO: fix logic!!
        this.slider.goToSlide(index + 1, true);
        setCanSignUp(true);
      } else {
        this.slider.goToSlide(index + 1, true);
        setCanSignUp(false);
      }
    },
    onError: (err) => {
      console.log('phone query', err);
    },
  });
  const [createSquash2, {client, data}] = useMutation(ADD_PROFILE2, {
    ignoreResults: false,
    context:  {
              headers: {
                "authorization": newUserToken ? `Bearer ${newUserToken}` : 'nothin',
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
    else if (index == TOTAL_SIGNUP_SLIDES - 2){
      setShowNextButton(false)
    }
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
  const _submit = ( value ) => {
    checkPhoneInput({variables: {phoneNumber: values.phoneNumber}});
  }
  const [authMessage, setAuthMessage] = useState(null)
const _checkSignIn = () => {
  //setAuthMessage('invalid verification code')
  console.log("canSignUp", canSignUp)
  canSignUp
    ? _confirmSignInGC()
    : userPhoneInfo.checkPhoneInput.isDeleted
    ? setNoUserFoundMessage(
        'User was deleted in the past few months, cannot sign up again just yet',
      )
    /// user already exixts so he CAN NOT sign up again, but msg is left vague to prevent
    : setNoUserFoundMessage('invalid code or phone number');

}
  const start = user => {
    if (onLogin) {
      onLogin(user);
    }
  };

const _confirmSignInGC = () => {
  var poolData = {
    UserPoolId: 'us-east-1_idvRudgcB', // Your user pool id here
    ClientId: '5db5ndig7d4dei9eiviv06v59f', // Your client id here
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
var attributePhoneNumber = new CognitoUserAttribute(
	dataPhoneNumber
);
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
        alert(err.message || JSON.stringify(err));
        return;
      }
      var cognitoUser = result.user;
      this.slider.goToSlide(index + 1, true);

    },
  );
}
  const _awsConfirmOTP = () => {
  var poolData = {
    UserPoolId: 'us-east-1_idvRudgcB', // Your user pool id here
    ClientId: '5db5ndig7d4dei9eiviv06v59f', // Your client id here
  };
  var userPool = new CognitoUserPool(poolData);
  var userData = {
    Username: values.phoneNumber,
    Pool: userPool,
  };
  var cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmRegistration(values.confirmationCode, true, function (err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      console.log('call result: ' + result);
      authenticateAWS(values.phoneNumber, values.password).then((userDetails) => {
        userDetails.confirmedUser.getUserAttributes((err, attributes) => {
          if (err) {
            console.log('Attribute Error in signup', err);
            return;
          } else {

            setNewUserToken(userDetails.session)

            attributes = attributes;
            const _id = _.find(attributes, {Name: 'sub'}).Value;
            console.log('user name is ' + cognitoUser.getUsername());
            setLoadingSignUInRefresh(true);
            setLoadingSubmit(true);
            console.log('values before submit', values);
            registerOnMongoDb(values, _id, createSquash2, userDetails.session)
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
              })
              .catch(async (err) => {
                console.log(err);
                // this error reallu shoudnt happen
                setAuthMessage('unable to upload information to the cloud');
                setLoadingSubmit(false);
                setLoadingSignUInRefresh(false);
              });
          }
        });
      });
    });
  }

  const _onPrev = () => {
    const index = this.slider.state.activeIndex
    this.slider.goToSlide(index - 1, true)
  };
  const _onNext = () => {
    console.log("erros location", errors.gender)
    console.log("erros location", errors.location)
    const index = this.slider.state.activeIndex
    console.log(index)
    const field = _.find(signUpSlides, ['key', index.toString()]).inputLabel
    console.log(field)
    //setFieldTouched(field)
    !errors[field] &&
    touched[field] &&
    this.slider.goToSlide(index + 1, true)
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
                  <PhoneInput />
                </>
              )
              break
            case 'Email Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <EmailInput isSignUp={true}/>
                </>
              )
              break
            case 'Name Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <NameInput isSignUp={true}/>
                </>
              )
              break
            case 'Birthday Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <BirthdayInput isSignUp={true}/>
                </>
              )
              break
            case 'Gender Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <GenderInput isSignUp={true}/>
                </>
              )
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
                    <ImageInput isSignUp={true} _submit={_submit} />
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
                  <DescriptionInput isSignUp={true}/>
                </>
              )
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
                  <PasswordInput
                    authMessage={authMessage}
                    noUserFoundMessage={noUserFoundMessage}
                    isLastSlide={lastSlide}
                    _confirmSignInGC={_checkSignIn}
                  />
                </>
              )
              break
            case 'Confirmation Code':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <ConfirmationCode
                    authMessage={authMessage}
                    noUserFoundMessage={noUserFoundMessage}
                    isLastSlide={lastSlide}
                    _confirmSignInGC={_awsConfirmOTP}
                  />
                </>
              )
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
          //onDone={() => {
            //_confirmSignInGC();
          //}}
          showNextButton={showNextButton && !isKeyboardShown}
          renderNextButton={renderNext}
          renderPrevButton={renderPrev}
          dotClickEnabled={false}
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
