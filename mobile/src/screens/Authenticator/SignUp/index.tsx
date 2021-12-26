import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {useMutation} from '@apollo/client'
import { useFormikContext, Formik} from 'formik';
import auth from '@react-native-firebase/auth'
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import {signUpSlides, intitialFormikSignUp, TOTAL_SIGNUP_SLIDES} from '../../../constants'
import {  RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import AppIntroSlider from 'react-native-app-intro-slider'
import { ADD_PROFILE2 } from '../../../graphql/mutations/profile'
import { ProfileFields} from '../../../localModels/UserSportsList'
import {NeighborhoodSearch, ConfirmationCode, PhoneInput, GenderInput, EmailInput, BirthdayInput, NameInput, DescriptionInput, ImageInput, SportsInput, Cancel, NextButton, PrevButton, AppContainer} from '../../../components'
import { registerOnFirebase, registerOnMongoDb} from '../../../utils/User'
import { UserContext} from '../../../UserContext'
import {Text, TouchableWithoutFeedback, Keyboard, View,StyleSheet} from 'react-native'
import  _ from 'lodash'
import styles from '../../../assets/styles'
import  { signUpSchema} from '../../../../common'
import  AnimatedLoader from 'react-native-animated-loader'

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
  const navigation = useNavigation()
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
  useEffect(() => {
    if (isKeyboardShown) {



    }
    else{


    }
  }, [isKeyboardShown]);

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
    _.isEmpty(errors)
    && registerOnFirebase(values.phoneNumber, values.email)
      .then((confirmation: any) => {
        this.slider.goToSlide(TOTAL_SIGNUP_SLIDES - 1);
        setConfirmationFunc(confirmation)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const _confirmSignInGC = () => {
    // promise in parralell
    setLoadingSubmit(true)
      confirmationFunc
        .confirm(values.confirmationCode)
        .then((userCredential) => {
            console.log("values before submit",values)
            console.log(userCredential.additionalUserInfo)
            registerOnMongoDb(values, userCredential.user.uid, createSquash2).then(() => {
            //setInitialFilters()
            console.log('logged in');
            setIsUseOnMongoDb(true)
            setLoadingSubmit(false)
        })
        .catch(async (err) => {
            // else delete user as if not created
            //await auth().currentUser.delete()
          console.log(err);
          setLoadingSubmit(false)
        });
        });

  }
  const _onPrev = () => {
    errors && touched && this.slider.goToSlide(this.slider.state.activeIndex - 1, true)
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
                    isLastSlide={lastSlide}
                    _confirmSignInGC={_confirmSignInGC}
                  />
                </>
              )
              break
          }
  };
const [visible, setVisible] = useState(false);
  return (
    <>
        <AppIntroSlider
          renderItem={renderInputForm}
          data={signUpSlides}
          scrollEnabled={false}
          showPrevButton={true && !isKeyboardShown}
          showDoneButton={false}
          onSlideChange={(index, lastIndex) => _onSlideChange(index, lastIndex)}
          onDone={() => {
            _confirmSignInGC();
          }}
          showNextButton={showNextButton && !isKeyboardShown}
          renderNextButton={renderNext}
          renderPrevButton={renderPrev}
          dotClickEnabled={false}
          keyboardShouldPersistTaps="always"
          onNext={() => _onNext()}
          onPrev={() => _onPrev()}
          ref={(ref) => (this.slider = ref!)}
        />
    </>
  );
}
      //<AppContainer loading={loadingSubmit}>
      //</AppContainer>
export { SignUp }
