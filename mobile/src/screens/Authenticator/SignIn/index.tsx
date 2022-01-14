import React, { useEffect, useContext, useState, ReactElement } from 'react'
import auth from '@react-native-firebase/auth'
import { useFormikContext, Formik} from 'formik';
import { StackNavigationProp } from '@react-navigation/stack'
import {signInSlides, iniitialSignInForm} from '@constants'
import {  RootStackSignOutParamList } from '@navigationStack'
import AppIntroSlider from 'react-native-app-intro-slider'
import {ProfileFields} from '@localModels';
import {AppContainer, ConfirmationCode, Cancel, PhoneInput, NextButton} from '@components'
import { registerOnFirebase} from '@utils'
import {useNavigation} from '@react-navigation/native'
import { CHECK_PHONE_INPUT } from '@graphQL2'
import {View, Keyboard} from 'react-native'
import {styles }from '@styles'
import  { signInSchema } from '@validation'
import {useLazyQuery, useQuery} from '@apollo/client'
import {RootRefreshContext} from '../../../index.js'
import  _ from 'lodash'

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
  const {validateField, setTouched, values, errors, touched, setFieldTouched} = useFormikContext<ProfileFields>();
  const [lastSlide, setLastSlide] = useState(false)
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const navigation = useNavigation()
  const [index, setIndex] = useState(0)
  const [canSignIn, setCanSignIn] = useState(false)
  const [noUserFoundMessage, setNoUserFoundMessage] = useState(null)
  const [showNextButton, setShowNextButton] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [isKeyboardShown, setIsKeyboardShown] = useState(undefined);
  const {setLoadingSignUInRefresh} = useContext(RootRefreshContext)
  const [checkPhoneInput, {data: userPhoneInfo}] = useLazyQuery(CHECK_PHONE_INPUT, {
    onCompleted: (data) => {
      if (
        data.checkPhoneInput.isPhoneExist == true &&
        data.checkPhoneInput.isDeleted == false
      ) {
        registerOnFirebase(values.phoneNumber)
          .then((confirmation: any) => {
            setConfirmationFunc(confirmation);
            this.slider.goToSlide(2);
          })
          .catch((err) => {
            console.log(err);
          });
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
    if (index == 2){
      setLastSlide(true)
      setShowNextButton(false)
    }
    else {
      setShowNextButton(true)
    }
  }
  const _signIn = () => {
    checkPhoneInput({variables: {phoneNumber: values.phoneNumber}});
  }
  const renderNext = () => {
    return <NextButton />;
  };

  const _onPrev = () => {
    errors && touched && this.slider.goToSlide(this.slider.state.activeIndex - 1, true)
  };
  const _onNext = () => {
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
const _confirmSignInGC = () => {
  //console.log("confirmation func", confirmationFunc)
  setLoadingSubmit(true);
  setLoadingSignUInRefresh(true)
  confirmationFunc
    .confirm(values.confirmationCode)
    .then((userCredential) => {
      if (userCredential.additionalUserInfo.isNewUser){
        auth().currentUser.delete().then(() => {
          setLoadingSubmit(true);
          console.log("use needs to sign up")
        })
      }
      setLoadingSignUInRefresh(false)
      console.log('logged in');
      //if (changeEmail) {
      //setAuthOverlay(true)
      //console.log("changeemail here")
      //}
      //setIsUseOnMongoDb(true);
    })
    .catch(async (err) => {
      //await auth().currentUser.delete()
      if (err.code === 'auth/invalid-verification-code') {
        console.log(
          'you provided incorrect verifcation code / phone number. Make sure phone number and code is valid',
        );
            setAuthMessage('invalid verification code');
      } else if (err.code === 'auth/missing-verification-code') {
            setAuthMessage('need to provide verification code');
        console.log('did not provide verification code');
      }
      setLoadingSubmit(false);
      setLoadingSignUInRefresh(false)
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
                  <PhoneInput />
                </>
              );
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
                    _confirmSignInGC={_checkSignIn}
                  />
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
        showPrevButton={false}
        onSlideChange={(index, lastIndex) => _onSlideChange(index, lastIndex)}
        onDone={() => {
          _confirmSignInGC();
        }}
        showNextButton={showNextButton && !isKeyboardShown}
        showDoneButton={false}
        renderNextButton={renderNext}
        onNext={() => _onNext()}
        ref={(ref) => (this.slider = ref!)}
      />
    </AppContainer>
  );
}
export { SignIn }
