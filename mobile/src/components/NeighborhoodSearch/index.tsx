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

const GooglePlacesInput = ({}) => {
  const { setValues, values, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
  const ref = useRef(null);
  useEffect(() => {
    const GooglePlacesProps = ref.current
    GooglePlacesProps?.setAddressText(values.location.city);
  }, []);
  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder='Search'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log("location value", values.location)
        ref.current?.setAddressText(data.description);
        const newLocation = {'city': data.terms[0].value, 'country': data.terms[2].value, 'state': data.terms[1].value}
        setValues({... values, 'location': newLocation})
      }}
      query={{
        key: API_KEY,
        language: 'en',
        components: 'country:us',
        types:'(cities)'
      }}
    />
  );
};

const NeighborhoodSearch = () => {
  return (
    <View style={{flex:1}}>
      <GooglePlacesInput/>
    </View>
  );
  }

export {NeighborhoodSearch};