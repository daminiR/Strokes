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
import {RootIndividualProfileInputParamList } from '../../../navigation/individualProfileStack'
import {FirstNameVar} from '../../../cache'
import { useFormikContext} from 'formik';
import { ProfileFields, SignIn} from '../../../localModels/UserSportsList'
import {GET_FIRST_NAME} from '../../../graphql/queries/profile'
import {UPDATE_NAME} from '../../../graphql/mutations/profile'
import {UserContext} from '../../../UserContext'
import {ProfileContext} from '../Profile/index'

export type FirstNameScreenNavigationProp = StackNavigationProp<RootIndividualProfileInputParamList, 'FIRST_NAME'>
export type FirstNameScreenRouteProp = RouteProp<RootIndividualProfileInputParamList, 'FIRST_NAME'>;
export type FirstNameT = {
  navigation: FirstNameScreenNavigationProp
  route: FirstNameScreenRouteProp
}
const FirstName = ({navigation, route}: FirstNameT): ReactElement => {
const [currentFirstName, setCurrentFirstName] = useState(null)
const {currentUser} = useContext(UserContext)
const [loading, setLoading] = useState(true)
const [updateName] = useMutation(UPDATE_NAME);
const {values: formikValues, submitForm, handleChange, handleSubmit } = useFormikContext<ProfileFields>();
const [firstNameValue, onChangeFirstName] = React.useState('Useless Placeholder')
const [lastNameValue, onChangeLastName] = React.useState('Useless Placeholder')
let {
  loading: apolloLoading,
  error: apolloError,
  data: apolloName,
} = useQuery(GET_FIRST_NAME);
useEffect(() => {
      setLoading(true)
      console.log(apolloName)
      onChangeFirstName(apolloName.fullName.FirstName);
      onChangeLastName(apolloName.fullName.LastName);
      setLoading(false)
}, []);
  const _updateName = () => {
    updateName({variables: {_id: currentUser.uid, first_name: firstNameValue, last_name: lastNameValue}})
    navigation.goBack()
  }
  const [data, setData] = useState("checking")
  return (
    <>
      {!loading && (
        <View>
          <Input
            placeholder="FirstName"
            label="First Name"
            leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
            onChangeText={onChangeFirstName}
            value={firstNameValue}
          />
          <Input
            placeholder="Last Name"
            label="Last Name"
            leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
            onChangeText={onChangeLastName}
            value={lastNameValue}
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
export { FirstName }
