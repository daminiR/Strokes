import React, { useEffect, useContext,createContext, useRef, useState, ReactElement } from 'react'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { View, Text, Button, AppState} from 'react-native'
import {Icon, FAB, Overlay} from 'react-native-elements'
import { onScreen, goBack } from '../../../constants'
import { AppContainer } from '../../../components'
import { RootStackParamList } from '../../../AppNavigator'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useLazyQuery, useQuery, useMutation } from '@apollo/client'
import { GET_POTENTIAL_MATCHES, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import  {Matches}  from './Matches'
import  {Home}  from './Home'
import {Test} from './Test'
import {createPatronList} from '../../../utils/matching/patron_list'
type MatchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MATCH'>

type MatchT = {
  navigation: MatchScreenNavigationProp
}
export const MatchesProfileContext = createContext(null)
const Match  = ({ navigation }: MatchT ): ReactElement => {
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [matches, setMatches] = useState(null)
  console.log("loads")
  const {aloading, currentUser, data: currentUserData, userLoading} = useContext(UserContext)
    //fetchPolicy: "network-only",
  const { data: squashData } = useQuery(GET_POTENTIAL_MATCHES, {
    // fetch policty newtowrk only gives infinte loop! changes after v3 appolo client
    //fetchPolicy: "network-only",
    variables: {_id: currentUser.uid},
    onCompleted: (data) => {
        console.log("/////////////// mactesh dat //////////////////////", data)
        console.log("/////////////// current user //////////////////////", currentUserData)
        const all_users = data.queryProssibleMatches
        //const patron_list = createPatronList(all_users, currentUserData.squash.likes, currentUserData.squash.dislikes, currentUserData.squash.i_blocked, currentUser.squash.blocked_me, currentUser.squash.matches)
        const patron_list = createPatronList(currentUserData.squash?.location, all_users, currentUserData.squash?.likes, currentUserData.squash?.dislikes, currentUserData.squash?.matches)
        setMatches(patron_list)
        console.log("///////////////patron list/////////////", patron_list)
        setLoadingMatches(false)
    }
  });
  const matchesProfileValue = {matches, loadingMatches}
  return (
    <>
      {!loadingMatches && <MatchesProfileContext.Provider value={matchesProfileValue}>
        <Test/>
      </MatchesProfileContext.Provider>}
    </>
  );
}
export { Match }
