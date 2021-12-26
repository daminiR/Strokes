import React, { useEffect, useContext, useState, ReactElement } from 'react'
import { useFormikContext} from 'formik';
import { EditInputVar} from '../../cache'
import { Cancel, Done, } from '..'
import { StackNavigationProp } from '@react-navigation/stack'
import { genderRadioObject } from '../../constants'
import auth from '@react-native-firebase/auth'
import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge, CheckBox} from 'react-native-elements'
import { View, TouchableWithoutFeedback, Keyboard} from 'react-native'
import styles from '../../assets/styles/'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import AppIntroSlider from 'react-native-app-intro-slider'
import {Pictures, CodeInput} from '../../components'
import {ChooseSportsChips} from '../../components'
import { EditFields, ProfileFields, SignIn} from '../../localModels/UserSportsList'
import {DoneCancelContext} from '../../screens/Authenticator/Profile/index'
import {sanitizePhone, formatPhoneNumber} from '../../../common/index'
import _ from 'lodash'


const DismissKeyboard = ({ children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const ImageInput = ({_submit, isSignUp}) => {
  const { values, errors, touched,  setValues, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();
    return (
      <>
      <View style={styles.imageContainer}>
        <Pictures />
        <View style={styles.buttonIndStyle}>
            {errors.image_set ? (
              <Text style={{alignSelf:'center'}}>{errors.image_set}</Text>
            ) : null}
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
  const { setValues, setFieldTouched, errors, touched, values, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
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
      setFieldTouched('gender')
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
            {errors.gender && touched.gender ? (
              <Text>{errors.gender}</Text>
            ) : null}
      </View>
    )}
  const NameInput = ({isSignUp}) => {
    const {values, handleBlur, errors, touched, handleChange, handleSubmit} = useFormikContext<
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
    var val1 = null
    var val2 = null
    var val3 = null
    const renderError = () => {
      if (errors.first_name && touched.first_name){
          console.log("in name", errors.first_name)
          val1 = <Text>{errors.first_name}</Text>
      }
      if (errors.last_name && touched.last_name){
         val2 =  <Text>{errors.last_name}</Text>
      }
      else{
         val3 = null
      }
      return (
        <>
          {val1}
          {val2}
          {val3}
        </>
      )
    }
    return (
      <>
        {!loadingTempValues && (
      <DismissKeyboard>
          <View style={styles.nameContainer}>
            <Input
              placeholder="FirstName"
              label="First Name"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onBlur={handleBlur('first_name')}
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
              onBlur={handleBlur('last_name')}
              onChangeText={
                isSignUp
                  ? handleChange('last_name')
                  : (text) => setTempInputValues({last_name: text})
              }
              value={isSignUp ? values.last_name : tempInputValues.last_name}
            />
            {renderError()}
          </View>
      </DismissKeyboard>
        )}
      </>
    );
  }
  const EmailInput = ({isSignUp, _signIn=null, getData=null}) => {
    const { handleBlur, values, errors, touched, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | SignIn>();
    const [email, setEmail] = useState(values.email)
    useEffect(() => {
      if (getData){
      getData(email, 'Email Input');
      }
    }, [email])
    return (
      <>
      <DismissKeyboard>
        <View style={styles.emailContainer}>
          <Input
            placeholder="Email"
            label="Email"
            leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
            onChangeText={getData ? setEmail : handleChange('email')}
            value={getData ? email : values.email}
            onBlur={handleBlur('email')}
          />
          <View style={styles.buttonIndStyle}>
            {errors.email && touched.email ? (
              <Text>{errors.email}</Text>
            ) : null}
            {!isSignUp && _signIn && (
              <Button
                buttonStyle={styles.buttonStyle}
                onPress={() => _signIn()}
                titleStyle={styles.buttonText}
                title="Submit"
              />
            )}
          </View>
        </View>
      </DismissKeyboard>
      </>
    );}


  const PhoneInput = () => {
    const { values, handleBlur, setFieldValue, submitForm, handleChange, errors, touched} = useFormikContext<ProfileFields | SignIn>();
    useEffect(() => {
        console.log(touched)
    }, [errors])
    const [inputValue, setDisplayInputValue] = useState("")
    const handleInput = (text) => {
      const tempText = text
    // this is where we'll call our future formatPhoneNumber function that we haven't written yet.
    const formattedPhoneNumber = formatPhoneNumber(tempText);
    // we'll set the input value using our setInputValue
    setDisplayInputValue(formattedPhoneNumber);
  }
  const _onDoneEditing = () => {
   setFieldValue( 'phoneNumber', sanitizePhone(inputValue))
  }
    return (
      <>
      <DismissKeyboard>
      <View style={styles.phoneNumberContainer}>
        <Input
          placeholder="Phone Number"
          label="Phone Number"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          onEndEditing={() => _onDoneEditing()}
          onChangeText={(text) => {
            handleInput(text);
          }}
          keyboardType={'phone-pad'}
          onBlur={handleBlur('phoneNumber')}
          value={inputValue}
        />
        {errors.phoneNumber && touched.phoneNumber ? (
          <Text>{errors.phoneNumber}</Text>
        ) : null}
      </View>
      </DismissKeyboard>
      </>
    );}
  const BirthdayInput = ({isSignUp}) => {
    const { handleBlur, errors, touched, values, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();

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
      <DismissKeyboard>
          <View style={styles.ageContainer}>
            <Input
              onBlur={handleBlur('age')}
              keyboardType={'phone-pad'}
              placeholder="Age"
              label="Age"
              leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
              onChangeText={
                isSignUp
                  ? handleChange('age')
                  : (text) => setTempInputValues({age: text})
              }
              value={
                isSignUp
                  ? values.age.toString()
                  : tempInputValues.age.toString()
              }
            />
            {errors.age && touched.age ? (
              <Text style={{alignSelf:'center'}}>{errors.age}</Text>
            ) : null}
          </View>
      </DismissKeyboard>
        )}
      </>
    );}
  const SportsInput = ({isSignUp}) => {
  const { values, setValues, errors, touched, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
    return (
      <View style={styles.sportsContainer}>
        <ChooseSportsChips isSignUp={isSignUp}/>
            {errors.sports ? (
              <Text style={{alignSelf:'center'}}>{errors.sports}</Text>
            ) : null}
      </View>
    );
  };
const DescriptionInput = ({isSignUp}) => {
  const { handleBlur, errors, touched, values, setValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();
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
      <DismissKeyboard>
        <View style={{flex:1}}>
        {!loadingTempValues && (
          <Card containerStyle={styles.CardStyle}>
            <Card.Title> Description </Card.Title>
            <Card.Divider />
            <View style={styles.sportChipSet}>
              <Input
                onBlur={handleBlur('description')}
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
        {errors.description && touched.description ? (
          <Text style={{alignSelf: 'center'}}>{errors.description}</Text>
        ) : null}
        </View>
      </DismissKeyboard>
      </>
    );
  };

  export {DescriptionInput, EmailInput, ImageInput, SportsInput, GenderInput, PhoneInput, NameInput, BirthdayInput}
