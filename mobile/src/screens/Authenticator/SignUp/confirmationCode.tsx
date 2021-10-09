import React, {useRef, useEffect, useContext, useState, ReactElement } from 'react'
import {Theme, Input, Chip, Card,withBadge, ListItem, Icon, Avatar, Badge, Button} from 'react-native-elements'
import * as Keychain from 'react-native-keychain'
import { useFormikContext, Formik, Form, Field } from 'formik';
import * as Yup from 'yup'
import { StackNavigationProp } from '@react-navigation/stack'
import { onScreen, goBack, genderRadioObject, signUpSlides, intitialFormikSignUp} from '../../../constants'
import { generateRNFile } from '../../../utils/Upload'
import auth from '@react-native-firebase/auth'
import { View,  Text, ScrollView, TextInput} from 'react-native'
import { useFocusEffect, NavigationContainer } from '@react-navigation/native'
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
import { UserContext } from '../../../UserContext'

const ConfirmationCode = ({isLastSlide, _confirmSignInGC}) => {
  const {values, handleChange} = useFormikContext<ProfileFields>();
  const didMountRef = useRef(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSlide, setLastSlide] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const _resendCode = () =>{
    // can only resend code 5 times after that show msg cannot  add more code until next day
  }
  useEffect(() => {
    if (didMountRef.current) {
      const timeoutID = setTimeout(() => {
        setDelayed(true);
      }, 3000);
      return () => {
        clearTimeout(timeoutID);
        setDelayed(false);
      };
    } else {
      didMountRef.current = true;
    }
  }, [isLastSlide]);
  return (
    <View style={styles.phoneNumberContainer}>
      <Input
        placeholder="ConfirmationCode"
        label="Confirmation Code"
        leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
        onChangeText={handleChange('confirmationCode')}
        value={values.confirmationCode}
      />
      {delayed && <Button title="Resend" />}
       <Button onPress={() => _confirmSignInGC()} title="Confirm" />
    </View>
  );
}
export { ConfirmationCode }
