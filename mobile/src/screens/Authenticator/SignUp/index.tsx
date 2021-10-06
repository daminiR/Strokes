import React, { useEffect, useContext, useState, ReactElement } from 'react'
import {Theme, Input, Chip, Card,withBadge, ListItem, Icon, Avatar, Badge, Button} from 'react-native-elements'
import * as Keychain from 'react-native-keychain'
import { Form, Formik, FormikConfig, FormikValues} from 'formik'
import * as Yup from 'yup'
import RadioGroup from 'react-native-radio-buttons-group'
import { StackNavigationProp } from '@react-navigation/stack'
import { onScreen, goBack, genderRadioObject} from '../../../constants'
import {  RootStackSignOutParamList } from '../../../navigation/'
import auth from '@react-native-firebase/auth'
import { View,  Text, ScrollView, TextInput } from 'react-native'
import styles from '../../../assets/styles/'
import { ADD_PROFILE } from '../../../graphql/mutations/profile'
import {useFormState, useFormDispatch} from '../../../Contexts/FormContext'
import AppIntroSlider from 'react-native-app-intro-slider'
import {SportChipsstyles, SportChips} from '../Profile/profileSettingInput'
import {sportsList} from './../../../constants';
type SignUpScreenNavigationProp = StackNavigationProp<RootStackSignOutParamList, 'SIGNUP'>
type SignUpT = {
  navigation: SignUpScreenNavigationProp
}
const slides = [
  {
    key: '0',
    type: 'Phone Input',
    title: 'Phone Number',
    inputLabel: 'Phone Number',
    backgroundColor: '#59b2ab',
  },
  //{
    //key: '1',
    //type: 'Email Input',
    //title: 'Email',
    //InputLabel: 'Email',
    //backgroundColor: '#59b2ab',
  //},
  //{
    //key: '2',
    //type: 'Name Input',
    //title: 'Name',
    //InputLabel: 'Name',
    //backgroundColor: '#22bcb5',
  //},
  //{
    //key: '3',
    //type: 'Birthday Input',
    //title: 'Birthday',
    //InputLabel: 'Birthday',
    //backgroundColor: '#59b2ab',
  //},
  //{
    //key: '4',
    //type: 'Gender Input',
    //title: 'Gender',
    //InputLabel: 'Gender',
    //backgroundColor: '#59b2ab',
  //},
  //{
    //key: '5',
    //type: 'Sports Input',
    //title: 'Sports',
    //InputLabel: 'Sports',
    //backgroundColor: '#59b2ab',
  //},
  //{
    //key: '6',
    //type: 'Image Input',
    //title: 'Email',
    //InputLabel: 'Email',
    //backgroundColor: '#59b2ab',
  //},
];

const SignUp = ({ navigation }: SignUpT): ReactElement => {
  const [loading, setLoading] = useState(false)
  const [error2, setError] = useState('');
  const [radioButtons, setRadioButtons] = useState(genderRadioObject)
  const form = React.useRef()
  const dispatch = useFormDispatch()
  const {values: formValues, errors: formErrors } = useFormState("user")
  const _onPressProfile = async () => {
        onScreen('BIRTHDAY', navigation)()
  }
  const imageInput = ({item}) => {
    return (
      <View style={{ backgroundColor: 'blue', flex: 1}}>
      <Text>
        {item.title}
      </Text>
    </View>
    )}
  const genderInput = ({item}) => {
    return (
      <View style={{backgroundColor: 'blue', flex: 1}}>
        <Text>{item.title}</Text>
        <RadioGroup radioButtons={radioButtons}
        //onPress={onPressRadioButton}
          />
        <Button
          title="Update"
          //onPress={() => {
            //_updateName();
          //}}
        />
      </View>
    );}
  const renderName = ({item}) => {
    return (
      <View style={{backgroundColor: 'blue', flex: 1}}>
        <Text>{item.title}</Text>
        <Input
          placeholder="FirstName"
          label="First Name"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          //onChangeText={onChangeFirstName}
          //value={firstNameValue}
        />
        <Input
          placeholder="Last Name"
          label="Last Name"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          //onChangeText={onChangeLastName}
          //value={lastNameValue}
        />
      </View>
    )}
  const renderEmail = ({item}) => {
    return (
      <View style={{ backgroundColor: 'blue', flex: 1}}>
      <Text>
        {item.title}
      </Text>
        <Input
          placeholder="Email"
          label="Email"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          //onChangeText={onChangeFirstName}
          //value={firstNameValue}
        />

    </View>
    )}
  const renderPhoneInput = ({item}) => {
    return (
      <View style={{backgroundColor: 'blue', flex: 1}}>
        <Input
          placeholder="Phone Number"
          label="Phone Number"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          //onChangeText={onChangeFirstName}
          //value={firstNameValue}
        />
      </View>
    )}
  const renderBirthday = ({item}) => {
    return (
      <View style={{ backgroundColor: 'blue', flex: 1}}>
      <Text>
        {item.title}
      </Text>
        <Input
          placeholder="Age"
          label="Age"
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
          //onChangeText={onChangeFirstName}
          //value={firstNameValue}
        />
    </View>
    )}
  const renderSports = ({item}) => {
    return (
      <View style={{backgroundColor: 'blue', flex: 1}}>
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
    )}
  const renderInputForm = ({item}) => {
    switch(item.type){
      case 'Phone Input':
          return <>{renderPhoneInput({item})}</>;
       break
      //case 'Email Input':
          //return <>{renderEmail({item})}</>;
       //break
      //case 'Name Input':
          //return <>{renderName({item})}</>;
       //break
      //case 'Birthday Input':
          //return <>{renderBirthday({item})}</>;
       //break
      //case 'Gender Input':
          //return <>{genderInput({item})}</>;
       //break
      //case 'Sports Input':
          //return <>{renderSports({item})}</>;
       //break
      //case 'Image Input':
          //return <>{imageInput({item})}</>;
       //break
      //case 'Sports Input':
          //return <>{renderSports({item})}</>;
       //break
    }
  }
  return (
    <AppIntroSlider renderItem={renderInputForm} data={slides} scrollEnabled={false} showPrevButton={true}/>
  );
}
//<Formik
  //innerRef={form}
  //initialValues={formValues}
  //initialErrors={formErrors}
  //enableReinitialize>
  //{({
    //values,
    //handleChange,
    //errors,
    //setFieldTouched,
    //touched,
    //handleSubmit,
  //}): ReactElement => (
    //<>
    //</>
  //)}
//</Formik>
//const FirstName = () => {
  //return (
    //<>
      //<Input
        //name="first_name"
        //value={values.first_name}
        //onChangeText={handleChange('first_name')}
        //onBlur={(): void => setFieldTouched('first_name')}
        //placeholder="First Name"
        //touched={touched}
        //errors={errors}
        //autoCapitalize="none"
      ///>
      //<Button title="Continue" onPress={_onPressProfile} />
    //</>
  //);

//}
export { SignUp }
