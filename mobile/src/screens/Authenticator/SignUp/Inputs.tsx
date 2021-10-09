import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {Theme, Input, Chip, Card,withBadge, ListItem, Icon, Avatar, Badge, Button} from 'react-native-elements'
import * as Keychain from 'react-native-keychain'
import { useFormikContext, Formik, Form, Field } from 'formik';
import * as Yup from 'yup'
import { StackNavigationProp } from '@react-navigation/stack'
import { onScreen, goBack, genderRadioObject, signUpSlides, intitialFormikSignUp} from '../../../constants'
import { generateRNFile } from '../../../utils/Upload'
import auth from '@react-native-firebase/auth'
import { View,  Text, ScrollView, TextInput } from 'react-native'
import styles from '../../../assets/styles/'
import { ADD_PROFILE } from '../../../graphql/mutations/profile'
import {useFormState, useFormDispatch} from '../../../Contexts/FormContext'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import AppIntroSlider from 'react-native-app-intro-slider'
import {SportChipsstyles, SportChips} from '../Profile/profileSettingInput'
import {sportsList} from './../../../constants';
import {sportsItemsVar} from '../../../cache'
import {Pictures} from '../../../components'
import {ChooseSportsChips} from '../../../components'
import {SportsList, Sport, NameT} from './localModels/UserSportsList'
import { ProfileFields} from '../../../localModels/UserSportsList'
const ImageInput = ({_submit}) => {
    const { values, setValues, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
    const getImages = (images) =>{
        setValues({... values, 'images': images})
    }
    return (
      <View style={styles.imageContainer}>
          <Pictures getImages={getImages}/>
         <Button onPress={() => _submit()} title="Submit" />
    </View>
    )}
  const GenderInput = () => {
  const { setValues, values, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
  const [radioButtons, setRadioButtons] = useState(genderRadioObject)
   const onPressRadioButton = (radioButtonsArray: RadioButtonProps[]) => {
        const gender = radioButtons.find((genderObj) => genderObj.selected == true).value
        setRadioButtons(radioButtonsArray)
        setValues({... values, 'gender': gender})
        console.log(gender)
    }
    return (
      <View style={styles.ageContainer}>
        <Text>Gender</Text>
        <RadioGroup radioButtons={radioButtons}
        onPress={onPressRadioButton}
          />
      </View>
    );}
  const NameInput = () => {
    const { values, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
    return (
      <View style={styles.nameContainer}>
        <Input
          placeholder="FirstName"
          label="First Name"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          onChangeText={handleChange('first_name')}
          value={values.first_name}
        />
        <Input
          placeholder="Last Name"
          label="Last Name"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          onChangeText={handleChange('last_name')}
          value={values.last_name}
        />
      </View>
    )}
  const EmailInput = () => {
    const { values, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
    return (
      <View style={styles.emailContainer}>
        <Input
          placeholder="Email"
          label="Email"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          onChangeText={handleChange('email')}
          value={values.email}
        />
    </View>
    )}


  const PhoneInput = () => {
    const { values, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
    return (
      <View style={styles.phoneNumberContainer}>
        <Input
          placeholder="Phone Number"
          label="Phone Number"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          onChangeText={handleChange('phoneNumber')}
          value={values.phoneNumber}
        />
      </View>
    )}
  const BirthdayInput = () => {
    const { values, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
    return (
      <View style={styles.ageContainer}>
        <Input
          placeholder="Age"
          label="Age"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          onChangeText={handleChange('age')}
          value={values.age}
        />
    </View>
    )}
  const SportsInput = () => {
  const { values, setValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
  const getSportsData = (sportsList) => {
    console.log("calues in parent")
    setValues({... values, 'sports': sportsList})
  }
    return (
      <View style={styles.sportsContainer}>
        <ChooseSportsChips getSportsList={getSportsData}/>
      </View>
    );
  };

  export {EmailInput, ImageInput, SportsInput, GenderInput, PhoneInput, NameInput, BirthdayInput}
