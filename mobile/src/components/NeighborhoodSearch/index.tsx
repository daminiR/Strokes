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

const GooglePlacesInput = ({currentLocation = 'Address'}) => {
  const ref = useRef(null);
  useEffect(() => {
    const GooglePlacesProps = ref.current
    GooglePlacesProps?.setAddressText(currentLocation);
  }, []);
  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder='Search'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        ref.current?.setAddressText(currentLocation);
        console.log(data, details);
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
