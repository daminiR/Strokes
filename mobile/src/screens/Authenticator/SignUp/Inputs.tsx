import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {Theme, Input, Chip, Card,withBadge, ListItem, Icon, Avatar, Badge, Button} from 'react-native-elements'
import * as Keychain from 'react-native-keychain'
import { useFormikContext, Formik, Form, Field } from 'formik';
import * as Yup from 'yup'
import { StackNavigationProp } from '@react-navigation/stack'
import { onScreen, goBack, genderRadioObject, signUpSlides, intitialFormikSignUp} from '../../../constants'
import auth from '@react-native-firebase/auth'
import { View,  Text, ScrollView, TextInput } from 'react-native'
import styles from '../../../assets/styles/'
import { ADD_PROFILE } from '../../../graphql/mutations/profile'
import {useFormState, useFormDispatch} from '../../../Contexts/FormContext'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import AppIntroSlider from 'react-native-app-intro-slider'
import {SportChipsstyles, SportChips} from '../Profile/profileSettingInput'
import {sportsList} from './../../../constants';
import {Pictures} from '../Profile/initation'
interface ProfileFields {
       email: string;
       phoneNumber: string;
       first_name: string,
       last_name: string,
       age: string
}
const ImageInput = () => {
    const { values, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
    return (
      <View style={styles.imageContainer}>
          <Pictures/>
         <Button onPress={() => handleSubmit()} title="Submit" />
    </View>
    )}
  const GenderInput = () => {
  const [radioButtons, setRadioButtons] = useState(genderRadioObject)
   const onPressRadioButton = (radioButtonsArray: RadioButtonProps[]) => {
        setRadioButtons(radioButtonsArray)
        console.log(radioButtonsArray)
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
  const { values, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
    return (
      <View style={styles.sportsContainer}>
        <Card containerStyle={styles.CardStyle}>
          <Card.Title> List of Acitivities</Card.Title>
          <Card.Divider />
          <View style={styles.sportChipSet}>
            {sportsList.map((sport, i) => (
              <SportChips
                key={i}
                sport={sport}
                isDisplay={false}
                //isSelected={userSportsList.some((currSport) => currSport.sport === sport)}
                //getData={getData}
              />
            ))}
          </View>
        </Card>
      </View>
    );
  };

  export {EmailInput, ImageInput, SportsInput, GenderInput, PhoneInput, NameInput, BirthdayInput}
