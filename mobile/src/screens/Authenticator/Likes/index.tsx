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

type LikesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LIKES'>

type LikesT = {
  navigation: LikesScreenNavigationProp
}
const Likes  = ({ navigation }: MatchT ): ReactElement => {
  //<Button title="Profile" onPress={_onPressProfile}/>
  const [loading, setLoading] = useState(false)
  return (
    <>
      <AppContainer title="User" loading={loading}>
        <Text>
          {'Likes alg tbc'}
        </Text>
      </AppContainer>
    </>
  );
}
export { Likes }