import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {useMutation} from '@apollo/client'
import { useFormikContext, Formik} from 'formik';
import { StackNavigationProp } from '@react-navigation/stack'
import {signInSlides, iniitialSignInForm} from '../../../constants'
import {  RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import AppIntroSlider from 'react-native-app-intro-slider'
import { ProfileFields} from '../../../localModels/UserSportsList'
import {Cancel, PhoneInput, EmailInput, PrevButton, NextButton} from '../../../components'
import { ConfirmationCode } from '../../../components'
import { registerOnFirebase} from '../../../utils/User'
import { UserContext } from '../../../UserContext'
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native'
import styles from '../../../assets/styles'
import  { signInSchema } from '../../../../common'

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
  const {values} = useFormikContext<ProfileFields>();
  const {setIsUseOnMongoDb} = useContext(UserContext)
  const [lastSlide, setLastSlide] = useState(false)
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const navigation = useNavigation()
  const [index, setIndex] = useState(0)
  const [showNextButton, setShowNextButton] = useState(true)

  const _onSlideChange = (index, last_index) => {
    setIndex(index)
    console.log("format for phone number", typeof values.phoneNumber)
    console.log(index)
    if (index == 1){
      setLastSlide(true)
      setShowNextButton(false)
    }
    else if (index == 2){
      setShowNextButton(false)
    }
    else {
      setShowNextButton(true)
    }
  }
  const _signIn = ( value ) => {
    registerOnFirebase(values.phoneNumber, values.email)
      .then((confirmation: any) => {
        this.slider.goToSlide(2);
        setConfirmationFunc(confirmation)
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const renderNext = () => {
    return <NextButton />;
  };
  const renderPrev = () => {
    return <PrevButton />;
  };

const _confirmSignInGC = () => {
    confirmationFunc
      .confirm(values.confirmationCode)
      .then((userCredential) => {
        console.log('logged in');
        //if (changeEmail) {
          //setAuthOverlay(true)
          //console.log("changeemail here")
        //}
        setIsUseOnMongoDb(true);
      })
      .catch(async (err) => {
        //await auth().currentUser.delete()
        console.log(err);
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
            case 'Email Input':
              return (
                <>
                  <View style={styles.cancel}>
                    <Cancel _onPressCancel={_onPressCancel} />
                  </View>
                  <EmailInput isSignUp={false} _signIn={_signIn} />
                </>
              );
              break
              return <PhoneInput />;
              break;
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
              );
              break;
          }
  };

  return (
      <AppIntroSlider
        renderItem={renderInputForm}
        data={signInSlides}
        scrollEnabled={false}
        showPrevButton={true}
        onSlideChange={(index, lastIndex) => _onSlideChange(index, lastIndex)}
        onDone={() => {_confirmSignInGC()}}
        showNextButton={showNextButton}
        renderNextButton={renderNext}
        renderPrevButton={renderPrev}
        ref={(ref) => (this.slider = ref!)}
      />
  )
}
export { SignIn }
