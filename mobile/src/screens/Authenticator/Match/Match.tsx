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
import { useFormikContext, Formik, ErrorMessage} from 'formik'
import {defaultAgeRange, defaultGameLevel} from '../../../constants'
import _ from 'lodash'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter} from '../../../utils/AsyncStorage/retriveData'
import {FilterSchema} from '../../../validationSchemas/FilterSchema'
import {createInitialFilterFormik} from '../../../utils/formik/index'
import {FilterFields} from '../../localModels/UserSportsList'

export const MatchesProfileContext = createContext(null)
export const FilterContext = createContext(null)

const Patron = ()  => {
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [matches, setMatches] = useState(null)
  const [allUsers, setAllUsers] = useState(null)
  const {setValues, values: filterValues } = useFormikContext<FilterFields>();
  const {aloading, currentUser, data: currentUserData, userLoading} = useContext(UserContext)
  // you have to re querry and reget filters everytime filters change -> useEffect
  const [filterFlag, setFilterFlag] = useState(false)
    //fetchPolicy: "network-only",
  const [queryProssibleMatches, { data: squashData }] = useLazyQuery(GET_POTENTIAL_MATCHES, {
    onCompleted: (data) => {
        console.log("are we here ever")
        const all_users = data.queryProssibleMatches
        setAllUsers(all_users)
        const patron_list = createPatronList(currentUserData.squash?.location, all_users, currentUserData.squash?.likes, currentUserData.squash?.dislikes, currentUserData.squash?.matches, filterValues)
        setMatches(patron_list)
        setLoadingMatches(false)
    }
  });
  useEffect(() => {
    queryProssibleMatches({variables: {_id: currentUser.uid}})
  }, []);
  useEffect(() => {
    console.log("run every time new filter values")
        setLoadingMatches(true)
        const patron_list = createPatronList(currentUserData.squash?.location, allUsers, currentUserData.squash?.likes, currentUserData.squash?.dislikes, currentUserData.squash?.matches, filterValues)
        console.log("new filter patron list ////////////", patron_list)
        setMatches(patron_list)
        setLoadingMatches(false)
  }, [filterValues]);
  const matchesProfileValue = {matches, loadingMatches};
  console.log("whaaaa",matchesProfileValue)
  return (
    <>
      {!loadingMatches && (
        <MatchesProfileContext.Provider value={matchesProfileValue}>
          <Test/>
        </MatchesProfileContext.Provider>
      )}
    </>
  );
}
export { Patron }
