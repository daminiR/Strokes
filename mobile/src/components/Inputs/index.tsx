import React, { useEffect, useContext, useState, ReactElement } from 'react'
import { useFormikContext} from 'formik';
import { EditInputVar} from '../../cache'
import { Cancel, Done, } from '..'
import { StackNavigationProp } from '@react-navigation/stack'
import { genderRadioObject } from '../../constants'
import auth from '@react-native-firebase/auth'
import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge, CheckBox} from 'react-native-elements'
import { View} from 'react-native'
import styles from '../../assets/styles/'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import AppIntroSlider from 'react-native-app-intro-slider'
import {Pictures} from '../../components'
import {ChooseSportsChips} from '../../components'
import { EditFields, ProfileFields, SignIn} from '../../localModels/UserSportsList'
import {DoneCancelContext} from '../../screens/Authenticator/Profile/index'
import _ from 'lodash'

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
  const refreshGenderObj = (radioObj) => {
          radioObj.selected = false
          return radioObj
    }
  const GenderInput = ({isSignUp}) => {
  const { setValues, values, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
  const [radioButtons, setRadioButtons] = useState(_.map(genderRadioObject, (radioObj) => refreshGenderObj(radioObj)))
  const [loadRadioButtons, setLoadRadioButtons] = useState(true)
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
    var setTempInputValues = null;
    var tempInputValues = null;
   if (!isSignUp){
    var {setTempInputValues, tempInputValues} = useContext(DoneCancelContext);
   }
  const genders = [
    {title: "Female", checkFunc: setCheck1, checked: check1},
    {title: "Male", checkFunc: setCheck2, checked: check2}
  ]
  useEffect(() => {
      setLoadRadioButtons(true)
      const gender = values.gender
      if (!isSignUp){
          setTempInputValues((prevState) => {return {...prevState, 'gender' : gender}})
      }
        _.find(genders, genderObj => genderObj.title == gender).checkFunc(true)
      setLoadRadioButtons(false)
    }, [])
   const onPressRadioButton = (gender, genderFunc) => {
     _.map(genders, genderObj => genderObj.checkFunc(false))
     genderFunc(true)
     isSignUp?
        setValues({... values, 'gender': gender})
       : setTempInputValues((prevState) => {
           return {...prevState, gender: gender};
         });
    }
    return (
      <View style={styles.ageContainer}>
        <Text>Gender</Text>
        {genders.map(({title, checkFunc, checked}, i) => (
        <CheckBox
          key={i}
          title={title}
          center
          checkedIcon={
            <Icon
              name="radio-button-checked"
              type="material"
              color="green"
              size={25}
              iconStyle={{marginRight: 10}}
            />
          }
          uncheckedIcon={
            <Icon
              name="radio-button-unchecked"
              type="material"
              color="grey"
              size={25}
              iconStyle={{marginRight: 10}}
            />
          }
          checked={checked}
          onPress={() => onPressRadioButton(title, checkFunc)}
        />
        )
        )}
      </View>
    )}
  const NameInput = ({isSignUp}) => {
    const {values, handleChange, handleSubmit} = useFormikContext<
      ProfileFields | EditFields
    >();
   const [loadingTempValues, setLoadingTempValues] = useState(true);
    var setTempInputValues = null;
    var tempInputValues = null;
   if (!isSignUp){
    var {setTempInputValues, tempInputValues} = useContext(DoneCancelContext);
   }
    useEffect(() => {
        setLoadingTempValues(true)
      if (!isSignUp ){
        setTempInputValues((prevState) => {return {...prevState, 'first_name' : values.first_name, 'last_name' : values.last_name}})
      }
        setLoadingTempValues(false)
    }, [])
    return (
      <>
        {!loadingTempValues && (
          <View style={styles.nameContainer}>
            <Input
              placeholder="FirstName"
              label="First Name"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={
                isSignUp
                  ? handleChange('first_name')
                  : (text) => setTempInputValues({first_name: text})
              }
              value={isSignUp ? values.first_name : tempInputValues.first_name}
            />
            <Input
              placeholder="Last Name"
              label="Last Name"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={
                isSignUp
                  ? handleChange('last_name')
                  : (text) => setTempInputValues({last_name: text})
              }
              value={isSignUp ? values.last_name : tempInputValues.last_name}
            />
          </View>
        )}
      </>
    );
  }
  const EmailInput = ({isSignUp, _signIn=null, getData=null}) => {
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
  const BirthdayInput = ({isSignUp}) => {
    const { values, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();
   const [loadingTempValues, setLoadingTempValues] = useState(true);
    var setTempInputValues = null;
    var tempInputValues = null;
   if (!isSignUp){
    var {setTempInputValues, tempInputValues} = useContext(DoneCancelContext);
   }
    useEffect(() => {
        setLoadingTempValues(true)
      if (!isSignUp){
        console.log("age value", values.age)
        setTempInputValues((prevState) => {return {...prevState, 'age' : values.age}})
      }
        setLoadingTempValues(false)
    }, [])
    return (
      <>
        {!loadingTempValues && (
          <View style={styles.ageContainer}>
            <Input
              placeholder="Age"
              label="Age"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={
                isSignUp
                  ? handleChange('age')
                  : (text) => setTempInputValues({age: text})
              }
              value={isSignUp ? values.age.toString() : tempInputValues.age.toString()}
            />
          </View>
        )}
      </>
    );}
  const SportsInput = ({isSignUp}) => {
  const { values, setValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
    return (
      <View style={styles.sportsContainer}>
        <ChooseSportsChips isSignUp={isSignUp}/>
      </View>
    );
  };
const DescriptionInput = ({isSignUp}) => {
  const { values, setValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();
    var setTempInputValues = null;
    var tempInputValues = null;
   if (!isSignUp){
    var {setTempInputValues, tempInputValues} = useContext(DoneCancelContext);
   }
   const [loadingTempValues, setLoadingTempValues] = useState(true);
    useEffect(() => {
        setLoadingTempValues(true)
      if (!isSignUp ){
        setTempInputValues((prevState) => {return {...prevState, 'description' : values.description}})
      }
        setLoadingTempValues(false)
    }, [])
    return (
      <>
        {!loadingTempValues && (
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
                maxLength={300}
                onChangeText={
                  isSignUp
                    ? handleChange('description')
                    : (text) => setTempInputValues({description: text})
                }
                value={
                  isSignUp ? values.description : tempInputValues.description
                }
              />
            </View>
          </Card>
        )}
      </>
    );
  };

  export {DescriptionInput, EmailInput, ImageInput, SportsInput, GenderInput, PhoneInput, NameInput, BirthdayInput}
