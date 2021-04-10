import React, { useContext, useState, ReactElement } from 'react'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { View, Text, Button } from 'react-native'
import { onScreen, goBack } from '../../../constants'
import { AppContainer } from '../../../components'
import { RootStackParamList } from '../../../AppNavigator'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PROFILE'>

type ProfileT = {
  navigation: ProfileScreenNavigationProp
}

const Profile  = ({ navigation }: ProfileT ): ReactElement => {
  //<Button title="Profile" onPress={_onPressProfile}/>

  return (
    <>
      <AppContainer title="User" loading={loading}>
        <Text>
          {'you are loged in!'}
          {JSON.stringify(currentUser)}
          {JSON.stringify(currentUser.additionalInfor)}
        </Text>
      </AppContainer>
    </>
  );
}
export { Profile }
