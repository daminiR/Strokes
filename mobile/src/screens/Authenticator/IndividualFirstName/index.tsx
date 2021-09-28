import React, { useLayoutEffect, useContext, useState, ReactElement } from 'react'
import { useQuery, useMutation, useLazyQuery, HTTPFetchNetworkInterface} from '@apollo/client'
import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import * as Yup from 'yup'
import { onScreen, goBack } from '../../../constants'
import  auth  from '@react-native-firebase/auth'
import { HeaderBackButton, StackHeaderLeftButtonProps } from '@react-navigation/stack';
import {RootStackSignInParamList } from '../../../navigation/SignInStack'
import {GET_FIRST_NAME} from '../../../graphql/queries/profile'

export type FirstNameScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'FIRST_NAME'>
export type FirstNameScreenRouteProp = RouteProp<RootStackSignInParamList, 'FIRST_NAME'>;
export type FirstNameT = {
  navigation: FirstNameScreenNavigationProp
  route: FirstNameScreenRouteProp
}
const FirstName = ({navigation, route}: FirstNameT): ReactElement => {
const [value, onChangeText] = React.useState('Useless Placeholder')
  let {
    loading: apolloLoading,
    error: apolloError,
    data: apolloFirstName,
  } = useQuery(GET_FIRST_NAME);

  const _callQuerry = () => {
    navigation.navigate('PROFILE', {data: 34})
    navigation.goBack()
  }
  const [data, setData] = useState("checking")
    useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => _callQuerry()}
        />
      ),
    });
  }, [navigation]);
  return (
    <>
      <Input
        placeholder="ok"
        label="First Name"
        leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
        onChangeText={(text) => onChangeText(text)}
        value={value}
      />
    </>
  );
}
export { FirstName }
