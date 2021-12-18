import React, { useEffect, useContext, useState, ReactElement } from 'react'
import { useFormikContext} from 'formik';
import { StackNavigationProp } from '@react-navigation/stack'
import { genderRadioObject } from '../../constants'
import auth from '@react-native-firebase/auth'
import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import { View} from 'react-native'
import styles from '../../assets/styles/'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import AppIntroSlider from 'react-native-app-intro-slider'
import {Pictures} from '../../components'
import {ChooseSportsChips} from '../../components'
import { EditFields, ProfileFields, SignIn} from '../../localModels/UserSportsList'

const ImageInput = ({_submit, isSignUp}) => {
  const { values, setValues, handleChange, handleSubmit } = useFormikContext<SignType>();
    return (
      <>
      <View style={styles.imageContainer}>
        <Pictures />
        <View style={styles.buttonIndStyle}>
          <Button
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonText}
            onPress={() => _submit()}
            title="Submit"
          />
      </View>
        </View>
      </>
    );}
  const GenderInput = () => {
  const { setValues, values, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
  const [radioButtons, setRadioButtons] = useState(genderRadioObject)
  const [loadRadioButtons, setLoadRadioButtons] = useState(true)
  useEffect(() => {
      setLoadRadioButtons(true)
        const gender = values.gender
        radioButtons.find((genderObj) => (genderObj.value == gender)).selected = true
        setRadioButtons(radioButtons)
      setLoadRadioButtons(false)
    }, [])
   const onPressRadioButton = (radioButtonsArray: RadioButtonProps[]) => {
        const gender = radioButtons.find((genderObj) => genderObj.selected == true).value
        setRadioButtons(radioButtonsArray)
        setValues({... values, 'gender': gender})
        console.log(gender)
    }
    return (
      <View style={styles.ageContainer}>
        <Text>Gender</Text>
          { !loadRadioButtons && <RadioGroup radioButtons={radioButtons}
        onPress={onPressRadioButton}
          />}
      </View>
    );}
  const NameInput = () => {
    const { values, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();
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
  const EmailInput = ({isSignUp=true, _signIn=null, getData=null}) => {
    console.log("does it go throu twice")
    const { values, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | SignIn>();
    const [email, setEmail] = useState(values.email)
    useEffect(() => {
      if (getData){
      getData(email, 'Email Input');
      }
    }, [email])
    return (
      <>
      <View style={styles.emailContainer}>
        <Input
          placeholder="Email"
          label="Email"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          onChangeText={getData? setEmail : handleChange('email')}
          value={getData ? email : values.email}
        />
        <View style={styles.buttonIndStyle}>
        {!isSignUp && _signIn && <Button buttonStyle={styles.buttonStyle} onPress={() => _signIn()} titleStyle={styles.buttonText} title="Submit"/>}
        </View>
    </View>
      </>
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
    console.log("running on ever slide")
  const { values, setValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
    return (
      <View style={styles.sportsContainer}>
        <ChooseSportsChips/>
      </View>
    );
  };
const DescriptionInput = () => {
  const { values, setValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();
    return (
      <Card containerStyle={styles.CardStyle}>
        <Card.Title> Description </Card.Title>
        <Card.Divider />
        <View style={styles.sportChipSet}>
          <Input
            multiline={true}
            inputContainerStyle={{borderBottomWidth: 0}}
            placeholder="Descriptionn"
            label="Description"
            leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
            onChangeText={handleChange('description')}
            maxLength={300}
            value={values.description}
          />
        </View>
      </Card>
    );
  };

  export {DescriptionInput, EmailInput, ImageInput, SportsInput, GenderInput, PhoneInput, NameInput, BirthdayInput}
