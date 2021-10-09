import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {Theme, Input, Chip, Card,withBadge, ListItem, Icon, Avatar, Badge, Button} from 'react-native-elements'
import * as Keychain from 'react-native-keychain'
import { InMemoryCache, useQuery, useMutation , makeVar} from '@apollo/client'
import { useFormikContext, Formik, Form, Field } from 'formik';
import * as Yup from 'yup'
import RadioGroup from 'react-native-radio-buttons-group'
import { StackNavigationProp } from '@react-navigation/stack'
import { onScreen, goBack, genderRadioObject, signUpSlides, intitialFormikSignUp} from '../../../constants'
import {  RootStackSignOutParamList } from '../../../navigation/'
import auth from '@react-native-firebase/auth'
import { View,  Text, ScrollView, TextInput } from 'react-native'
import styles from '../../../assets/styles/'
import {useFormState, useFormDispatch} from '../../../Contexts/FormContext'
import AppIntroSlider from 'react-native-app-intro-slider'
import {SportChipsstyles, SportChips} from '../Profile/profileSettingInput'
import { ADD_PROFILE2 } from '../../../graphql/mutations/profile'
import {sportsList} from './../../../constants';
import {Pictures} from '../Profile/initation'
import { ProfileFields} from '../../../localModels/UserSportsList'
import {PhoneInput, GenderInput, EmailInput, BirthdayInput, NameInput, ImageInput, SportsInput} from './Inputs'
import { ConfirmationCode } from './confirmationCode'
import { registerOnFirebase, registerOnMongoDb} from '../../../utils/User'
import { UserContext} from '../../../UserContext'
type SignUpScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'SIGNUP'>
type SignUpT = {
  navigation: SignUpScreenNavigationProp
}
const SignUp = ({ navigation }: SignUpT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error2, setError] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(0)
  const {values: formValues, errors: formErrors } = useFormState("user")
  return (
    <Formik
      initialValues={intitialFormikSignUp}
      onSubmit={(values) => console.log(values)}>
      <Slider/>
    </Formik>
  );
}
const Slider =  () => {
  const {values, handleChange} = useFormikContext<ProfileFields>();
  const {setIsUseOnMongoDb} = useContext(UserContext)
  const [lastSlide, setLastSlide] = useState(false)
  const [confirmSlide, setConfirmSlide] = useState(false)
  const [confirmationFunc, setConfirmationFunc] = useState(null)
  const [index, setIndex] = useState(0)
  const [showNextButton, setShowNextButton] = useState(true)
  const [createSquash2, {client, data}] = useMutation(ADD_PROFILE2, {
    ignoreResults: false,
    onCompleted: (data) => {
    },
  });
  const _onSlideChange = (index, last_index) => {
    setIndex(index)
    if (index == 7){
      setLastSlide(true)
      setShowNextButton(false)
    }
    if (index == 6){
      setShowNextButton(false)
    }
  }
  const _submit = ( value ) => {
    registerOnFirebase(values.phoneNumber, values.email)
      .then((confirmation: any) => {
        this.slider.goToSlide(7);
        setConfirmationFunc(confirmation)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const _confirmSignInGC = () => {
    // promise in parralell
      confirmationFunc
        .confirm(values.confirmationCode)
        .then((userCredential) => {
            //registerOnMongoDb(values, userCredential.uid, createSquash2)
            setIsUseOnMongoDb(true)
          console.log('logged in');
        })
        .catch((err) => {
          console.log(err);
        });

  }
  const renderInputForm = ({item}) => {
          switch (item.type) {
            case 'Phone Input':
              return <PhoneInput />;
              break;
            case 'Email Input':
              return <EmailInput />;
              break;
            case 'Name Input':
              return <NameInput />;
              break;
            case 'Birthday Input':
              return <BirthdayInput />;
              break;
            case 'Gender Input':
              return <GenderInput />;
              break;
            case 'Sports Input':
              return <SportsInput />;
              break;
            case 'Image Input':
              return <ImageInput _submit={_submit}/>;
              break;
            case 'Confirmation Code':
              return <ConfirmationCode isLastSlide={lastSlide} _confirmSignInGC={_confirmSignInGC}/>;
              break;
          }
  };

  return (
      <AppIntroSlider
        renderItem={renderInputForm}
        data={signUpSlides}
        scrollEnabled={false}
        showPrevButton={true}
        onSlideChange={(index, lastIndex) => _onSlideChange(index, lastIndex)}
        onDone={() => {_confirmSignInGC()}}
        showNextButton={showNextButton}
        ref={(ref) => (this.slider = ref!)}
      />
  )
}
export { SignUp }
