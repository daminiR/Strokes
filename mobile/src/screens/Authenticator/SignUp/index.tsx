import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {Theme, Input, Chip, Card,withBadge, ListItem, Icon, Avatar, Badge, Button} from 'react-native-elements'
import * as Keychain from 'react-native-keychain'
import { useFormikContext, Formik, Form, Field } from 'formik';
import * as Yup from 'yup'
import RadioGroup from 'react-native-radio-buttons-group'
import { StackNavigationProp } from '@react-navigation/stack'
import { onScreen, goBack, genderRadioObject, signUpSlides, intitialFormikSignUp} from '../../../constants'
import {  RootStackSignOutParamList } from '../../../navigation/'
import auth from '@react-native-firebase/auth'
import { View,  Text, ScrollView, TextInput } from 'react-native'
import styles from '../../../assets/styles/'
import { ADD_PROFILE } from '../../../graphql/mutations/profile'
import {useFormState, useFormDispatch} from '../../../Contexts/FormContext'
import AppIntroSlider from 'react-native-app-intro-slider'
import {SportChipsstyles, SportChips} from '../Profile/profileSettingInput'
import {sportsList} from './../../../constants';
import {Pictures} from '../Profile/initation'
import {PhoneInput, GenderInput, EmailInput, BirthdayInput, NameInput, ImageInput, SportsInput} from './Inputs'
type SignUpScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'SIGNUP'>
type SignUpT = {
  navigation: SignUpScreenNavigationProp
}
const SignUp = ({ navigation }: SignUpT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error2, setError] = useState('');
  const form = React.useRef()
  const dispatch = useFormDispatch()
  const {values: formValues, errors: formErrors } = useFormState("user")
  const _onPressProfile = async () => {
    onScreen('BIRTHDAY', navigation)();
  };

  const renderInputForm = ({item}) => {
          switch (item.type) {
            case 'Phone Input':
              return <PhoneInput/>;
              break;
            case 'Email Input':
              return <EmailInput/>;
              break;
            case 'Name Input':
              return <NameInput/>;
              break;
            case 'Birthday Input':
              return <BirthdayInput/>;
              break;
            case 'Gender Input':
              return <GenderInput/>;
              break;
            case 'Sports Input':
              return <SportsInput/>;
              break;
            case 'Image Input':
              return <ImageInput/>;
              break;
          }
  };

  return (
    <Formik
      initialValues={intitialFormikSignUp}
      onSubmit={(values) => console.log(values)}>
      <AppIntroSlider
        renderItem={renderInputForm}
        data={signUpSlides}
        scrollEnabled={false}
        showPrevButton={true}
      />
    </Formik>
  );
}
export { SignUp }
