import React, { useEffect, useContext, useState, ReactElement } from 'react'
import { useFormikContext} from 'formik';
import { StackNavigationProp } from '@react-navigation/stack'
import {ScrollView, StyleSheet } from 'react-native'
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

const GooglePlacesInput = () => {
  return (
      <ScrollView>
    <GooglePlacesAutocomplete
      placeholder='Search'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyCxdvZ1p2d-AP7n20cKHzR03tCxPmk1Dyw',
        language: 'en',
      }}
    />
      </ScrollView>
  );
};

const NeighborhoodSearch = () => {
  return (
      <View>
      <GooglePlacesInput/>
    </View>
  );
  }

export {NeighborhoodSearch};
