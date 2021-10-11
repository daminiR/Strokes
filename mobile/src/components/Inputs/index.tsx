import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {Input, Button} from 'react-native-elements'
import { useFormikContext} from 'formik';
import { StackNavigationProp } from '@react-navigation/stack'
import { genderRadioObject } from '../../constants'
import auth from '@react-native-firebase/auth'
import { View,  Text} from 'react-native'
import styles from '../../assets/styles/'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import AppIntroSlider from 'react-native-app-intro-slider'
import {Pictures} from '../../components'
import {ChooseSportsChips} from '../../components'
import { ProfileFields, SignIn} from '../../localModels/UserSportsList'

const ImageInput = ({_submit, isSignUp}) => {
  const { values, setValues, handleChange, handleSubmit } = useFormikContext<SignType>();
    const getImages = (images) =>{
        setValues({... values, 'images': images})
    }
    return (
      <View style={styles.imageContainer}>
          <Pictures getImages={getImages}/>
          <Button style={{flexDirection:'row', alignSelf: 'center', justifyContent: 'flex-end'}} onPress={() => _submit()} title="Submit" />
    </View>
    )}
  const GenderInput = () => {
  const { setValues, values, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
  const [radioButtons, setRadioButtons] = useState(genderRadioObject)
   const onPressRadioButton = (radioButtonsArray: RadioButtonProps[]) => {
        const gender = radioButtons.find((genderObj) => genderObj.selected == true).value
        setRadioButtons(radioButtNameray)
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
  const EmailInput = ({isSignUp=true, _signIn=null}) => {
    const { values, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | SignIn>();
    return (
      <View style={styles.emailContainer}>
        <Input
          placeholder="Email"
          label="Email"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          onChangeText={handleChange('email')}
          value={values.email}
        />
        {!isSignUp && _signIn && <Button style={{flexDirection:'row', alignSelf: 'center', justifyContent: 'flex-end'}} onPress={() => _signIn()} title="Submit"/>}
    </View>
    )}


  const PhoneInput = () => {
    const { values, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | SignIn>();
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
