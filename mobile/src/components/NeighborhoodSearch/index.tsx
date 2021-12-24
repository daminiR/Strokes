import React, { useRef, useEffect, useContext, useState, ReactElement } from 'react'
import { useFormikContext} from 'formik';
import { StackNavigationProp } from '@react-navigation/stack'
import { genderRadioObject } from '../../constants'
import auth from '@react-native-firebase/auth'
import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import { View} from 'react-native'
import styles from '../../assets/styles'
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import AppIntroSlider from 'react-native-app-intro-slider'
import {Pictures} from '..'
import {ChooseSportsChips} from '..'
import { EditFields, ProfileFields, SignIn} from '../../localModels/UserSportsList'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {API_KEY} from './API_KEY'
import {ScrollView } from 'react-native'
import {DoneCancelContext} from '../../screens/Authenticator/Profile/index'

const GooglePlacesInput = ({isSignUp = false}) => {
  console.log("what is signy value", isSignUp)
  const { setValues, values, handleChange, handleSubmit } = useFormikContext<ProfileFields | EditFields>();
  var setDisplayInput = null
  var setTempInputValues = null
  var tempInputValues= null
  if (!isSignUp){
    var {setDisplayInput, setTempInputValues, tempInputValues} = useContext(DoneCancelContext);
  }
  const ref = useRef(null);
  console.log(values)
  useEffect(() => {
    const GooglePlacesProps = ref.current;
      !isSignUp && GooglePlacesProps?.setAddressText(values?.location?.city);
  }, []);
  const _onPressLocation = (data, details=null) => {
//         'details' is provided when fetchDetails = true
        console.log("location value", values.location)
        ref.current?.setAddressText(data.description);
        const newLocation = {
          city: data.terms[0].value,
          country: data.terms[2].value,
          state: data.terms[1].value,
        };
        if (isSignUp) {
          console.log("do we hit this", isSignUp)
        setValues({... values, 'location': newLocation})
        }
        else {
        setTempInputValues((prevState) => {return {...prevState, 'location' : newLocation}})
        }
  }
  return (
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Search"
        onPress={(data, details=null) => _onPressLocation(data, details)}
        query={{
          key: API_KEY,
          language: 'en',
          components: 'country:us',
          types: '(cities)',
        }}
      />
  );
};

const NeighborhoodSearch = ({isSignUp}) => {
  return (
    <View style={{flex:1}}>
      <GooglePlacesInput isSignUp={isSignUp}/>
    </View>
  );
  }

export {NeighborhoodSearch};
