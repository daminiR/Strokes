import React, { useEffect, useContext, useState, ReactElement } from 'react'
import { useFormikContext, Formik} from 'formik';
import { StackNavigationProp } from '@react-navigation/stack'
import {signInSlides, iniitialSignInForm} from '@constants'
import {  RootStackSignOutParamList } from '@navigationStack'
import AppIntroSlider from 'react-native-app-intro-slider'
import { ProfileFields} from '@localModels'
import {ConfirmationCode, Cancel, PhoneInput, NextButton} from '@components'
import { registerOnFirebase} from '@utils'
import {useNavigation} from '@react-navigation/native'
import {Button} from 'react-native-elements'
import {View} from 'react-native'
import {styles }from '@styles'
import  { signInSchema } from '@validation'
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
  const [showNextButton, setShowNextButton] = useState(true)

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
    registerOnFirebase(values.phoneNumber)
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

  const _onPrev = () => {
    errors && touched && this.slider.goToSlide(this.slider.state.activeIndex - 1, true)
  };
  const _onNext = () => {
    const index = this.slider.state.activeIndex;
    const field = _.find(signInSlides, ['key', index.toString()]).inputLabel;
    setFieldTouched(field);

    if (index == 0) {
      _signIn();
    } else {
      !errors[field] &&
        touched[field] &&
        this.slider.goToSlide(index + 1, true);
    }
  };
const _confirmSignInGC = () => {
  //console.log("confirmation func", confirmationFunc)

    confirmationFunc
      .confirm(values.confirmationCode)
      .then((userCredential) => {
        console.log('logged in');
        //if (changeEmail) {
          //setAuthOverlay(true)
          //console.log("changeemail here")
        //}
        //setIsUseOnMongoDb(true);
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
        showDoneButton={false}
        renderNextButton={renderNext}
        onNext={() => _onNext()}
        ref={(ref) => (this.slider = ref!)}
      />
  )
}
export { SignIn }
