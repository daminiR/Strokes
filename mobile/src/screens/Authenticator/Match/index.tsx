import React, { useContext,createContext, useState, ReactElement } from 'react'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { View, Text, Button } from 'react-native'
import { onScreen, goBack } from '../../../constants'
import { AppContainer } from '../../../components'
import { RootStackParamList } from '../../../AppNavigator'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useQuery, useMutation } from '@apollo/client'
import { GET_POTENTIAL_MATCHES, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import  {Matches}  from './Matches'
import  {Home}  from './Home'
import {Test} from './Test'
type MatchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MATCH'>

type MatchT = {
  navigation: MatchScreenNavigationProp
}
export const MatchesProfileContext = createContext()
const Match  = ({ navigation }: MatchT ): ReactElement => {
  const [loading, setLoading] = useState(false)
  const {currentUser} = useContext(UserContext);
  const {data: squashData} = useQuery(GET_POTENTIAL_MATCHES, {
    variables: {_id: currentUser.uid},
  });
  console.log("sada",squashData)
  const matchesProfileValue = {squashData}
  return (
    <>
      <MatchesProfileContext.Provider value={matchesProfileValue}>
        <Test />
      </MatchesProfileContext.Provider>
    </>
  );
}
export { Match }
