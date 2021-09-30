import React, { useEffect, useLayoutEffect, useContext, useState, ReactElement } from 'react'
import { useQuery, useMutation, useLazyQuery, HTTPFetchNetworkInterface} from '@apollo/client'
import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import {
  View
} from 'react-native';
import * as Yup from 'yup'
import { onScreen, goBack } from '../../../constants'
import  auth  from '@react-native-firebase/auth'
import { HeaderBackButton, StackHeaderLeftButtonProps } from '@react-navigation/stack';
import {RootIndividualProfileInputParamList } from '../../../navigation/individualProfileStack'
import {FirstNameVar} from '../../../cache'
import {GET_AGE} from '../../../graphql/queries/profile'
import {UPDATE_AGE} from '../../../graphql/mutations/profile'
import {UserContext} from '../../../UserContext'
import {ProfileContext} from '../Profile/index'

export type AgeScreenNavigationProp = StackNavigationProp<RootIndividualProfileInputParamList, 'AGE'>
export type AgeScreenRouteProp = RouteProp<RootIndividualProfileInputParamList, 'AGE'>;
export type AgeT = {
  navigation: AgeScreenNavigationProp
  route: AgeScreenRouteProp
}
const Age = ({navigation, route}: FirstNameT): ReactElement => {
const [currentFirstName, setCurrentFirstName] = useState(null)
const {currentUser} = useContext(UserContext)
const [loading, setLoading] = useState(true)
const [updateAge] = useMutation(UPDATE_AGE);
const [ageValue, onChangeAge] = React.useState('')
let {
  loading: apolloLoading,
  error: apolloError,
  data: localStateAge
} = useQuery(GET_AGE);
useEffect(() => {
      setLoading(true)
      onChangeAge(localStateAge.age.toString());
      setLoading(false)
}, []);
  const _updateName = () => {
    updateAge({variables: {_id: currentUser.uid, age: Number(ageValue)}})
    navigation.goBack()
  }
  return (
    <>
      {!loading && (
        <View>
          <Input
            placeholder="FirstName"
            label="First Name"
            leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
            onChangeText={onChangeAge}
            value={ageValue}
          />
        </View>
      )}
      <Button
        title="Update"
        onPress={() => {
          _updateName();
        }}
      />
    </>
  );
}
export { Age }
