import React, { useLayoutEffect, useContext, useState, ReactElement } from 'react'
import {Theme, Text, Chip, Card, Input, Button,withBadge, ListItem, Icon, Avatar, Badge } from 'react-native-elements'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import * as Yup from 'yup'
import { onScreen, goBack } from '../../../constants'
import  auth  from '@react-native-firebase/auth'
import { HeaderBackButton, StackHeaderLeftButtonProps } from '@react-navigation/stack';
import {RootStackSignInParamList } from '../../../navigation/SignInStack'

export type FirstNameScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'FIRST_NAME'>
export type FirstNameScreenRouteProp = RouteProp<RootStackSignInParamList, 'FIRST_NAME'>;
export type FirstNameT = {
  navigation: FirstNameScreenNavigationProp
  route: FirstNameScreenRouteProp
}
const FirstName = ({route, navigation}: FirstNameT): ReactElement => {
  const _callQuerry = () => {
    //navigation.navigate('PROFILE', {data: 34})
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
      <Text >
        "FirstName"
      </Text >
    </>
  )
}
export { FirstName }
