import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {useLazyQuery, useMutation} from '@apollo/client'
import { useFormikContext, Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import {signUpSlides, intitialFormikSignUp, TOTAL_SIGNUP_SLIDES} from '@constants'
import {  RootStackSignOutParamList } from 'src/navigation'
import AppIntroSlider from 'react-native-app-intro-slider'
import {CHECK_PHONE_INPUT, ADD_PROFILE2 } from '@graphQL2'
import {ProfileFields} from '@localModels';
import {
  NeighborhoodSearch,
  ConfirmationCode,
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
import { registerOnFirebase, registerOnMongoDb} from '@utils'
import { UserContext} from '@UserContext'
import {Keyboard, View} from 'react-native'
import  _ from 'lodash'
import { styles } from '@styles'
import  { signUpSchema} from '@validation'
import {RootRefreshContext} from '../../../index.js'

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
  const {values, errors, setFieldValue, setFieldTouched, touched} = useFormikContext<ProfileFields>();
  const [newLocation, setNewLocation] = useState(null)
  const {setIsUseOnMongoDb} = useContext(UserContext)
  const [lastSlide, setLastSlide] = useState(false)
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [index, setIndex] = useState(0)
  const [showNextButton, setShowNextButton] = useState(true)
  const [canSignUp, setCanSignUp] = useState(false)
  const [noUserFoundMessage, setNoUserFoundMessage] = useState(null)
  const navigation = useNavigation()
  const {setLoadingSignUInRefresh} = useContext(RootRefreshContext)
  const [checkPhoneInput, {data: userPhoneInfo}] = useLazyQuery(CHECK_PHONE_INPUT, {
    onCompleted: (data) => {
      if (
        data.checkPhoneInput.isPhoneExist == false &&
        data.checkPhoneInput.isDeleted == false
      ) {
        _.isEmpty(errors) &&
          registerOnFirebase(values.phoneNumber, values.email)
            .then((confirmation: any) => {
              setConfirmationFunc(confirmation);
              this.slider.goToSlide(TOTAL_SIGNUP_SLIDES - 1);
            })
            .catch((err) => {
              console.log(err);
            });
        !_.isEmpty(errors) && console.log(errors);
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
    onCompleted: (data) => {
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
  canSignUp
    ? _confirmSignInGC()
    : userPhoneInfo.checkPhoneInput.isDeleted
    ? setNoUserFoundMessage(
        'User was deleted in the past few months, cannot sign up again just yet',
      )
    /// user already exixts so he CAN NOT sign up again, but msg is left vague to prevent
    : setNoUserFoundMessage('invalid code or phone number');

}
const _confirmSignInGC = () => {
    // promise in parralell
      confirmationFunc
        .confirm(values.confirmationCode)
        .then((userCredential) => {
          setLoadingSignUInRefresh(true)
          setLoadingSubmit(true)
          console.log('values before submit', values);
          console.log(userCredential.additionalUserInfo);
          registerOnMongoDb(values, userCredential.user.uid, createSquash2)
            .then(() => {
              //setInitialFilters()
              console.log('logged in');
              setIsUseOnMongoDb(true);
              setLoadingSubmit(false);
            })
            .catch(async (err) => {
              // else delete user as if not created
              //await auth().currentUser.delete()
              console.log(err);
              // this error reallu shoudnt happen
              setAuthMessage('unable to upload information to the cloud');
              setLoadingSubmit(false);
              setLoadingSignUInRefresh(false)
            });
        })
        .catch(async (err) => {
          console.log(err);
          if (err.code === 'auth/invalid-verification-code') {
            console.log(
              'you provided incorrect verifcation code / phone number. Make sure phone number and code is valid',
            );
            setAuthMessage('invalid verification code');
          } else if (err.code === 'auth/missing-verification-code') {
            console.log('did not provide verification code');
            setAuthMessage('need to provide verification code');
          }
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
                  <NeighborhoodSearch isSignUp={true}/>
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
                    _confirmSignInGC={_checkSignIn}
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
