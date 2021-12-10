import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {useMutation} from '@apollo/client'
import { useFormikContext, Formik} from 'formik';
import { StackNavigationProp } from '@react-navigation/stack'
import {signInSlides, iniitialSignInForm} from '../../../constants'
import {  RootStackSignOutParamList } from '../../../navigation/SignOutStack'
import AppIntroSlider from 'react-native-app-intro-slider'
import { ADD_PROFILE2 } from '../../../graphql/mutations/profile'
import { ProfileFields} from '../../../localModels/UserSportsList'
import {PhoneInput, EmailInput} from '../../../components'
import { ConfirmationCode } from '../../../components'
import { registerOnFirebase} from '../../../utils/User'
import { UserContext } from '../../../UserContext'

type SignInScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'SIGN_IN'>
type SignInT = {
  navigation: SignInScreenNavigationProp
}
const SignIn = ({ navigation }: SignInT): ReactElement => {
  return (
    <Formik
      initialValues={iniitialSignInForm}
      onSubmit={(values) => console.log(values)}>
      <Slider/>
    </Formik>
  );
}
const Slider =  () => {
  const {values} = useFormikContext<ProfileFields>();
  const {setIsUseOnMongoDb} = useContext(UserContext)
  const [lastSlide, setLastSlide] = useState(false)
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const [index, setIndex] = useState(0)
  const [showNextButton, setShowNextButton] = useState(true)

  const _onSlideChange = (index, last_index) => {
    setIndex(index)
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

  const _confirmSignInGC = () => {
    confirmationFunc
      .confirm(values.confirmationCode)
      .then((userCredential) => {
        console.log('logged in');
        setIsUseOnMongoDb(true);
      })
      .catch(async (err) => {
        //await auth().currentUser.delete()
        console.log(err);
      });
  };
  const renderInputForm = ({item}) => {
          switch (item.type) {
            case 'Phone Input':
              return <PhoneInput />;
              break;
            case 'Email Input':
              return <EmailInput isSignUp={false} _signIn={_signIn}/>;
              break;
            case 'Confirmation Code':
             return <ConfirmationCode isLastSlide={lastSlide} _confirmSignInGC={_confirmSignInGC}/>;
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
        ref={(ref) => (this.slider = ref!)}
      />
  )
}
export { SignIn }
