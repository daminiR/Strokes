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

export const MatchesProfileContext = createContext(null)
export const FilterContext = createContext(null)

const Match  =  ({ navigation}: MatchT )  => {
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [matches, setMatches] = useState(null)
  const {aloading, currentUser, data: currentUserData, userLoading} = useContext(UserContext)
  const [filterFlag, setFilterFlag] = useState(false)
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
    //fetchPolicy: "network-only",
  const { data: squashData } = useQuery(GET_POTENTIAL_MATCHES, {
    variables: {_id: currentUser.uid},
    onCompleted: (data) => {
        const all_users = data.queryProssibleMatches
        //const patron_list = createPatronList(all_users, currentUserData.squash.likes, currentUserData.squash.dislikes, currentUserData.squash.i_blocked, currentUser.squash.blocked_me, currentUser.squash.matches)
        const patron_list = createPatronList(currentUserData.squash?.location, all_users, currentUserData.squash?.likes, currentUserData.squash?.dislikes, currentUserData.squash?.matches)
        setMatches(patron_list)
        setLoadingMatches(false)
    }
  });
  const getFilterMain = (filter) => {
    console.log("filter in main", filter)
    setFilterFlag(filter)
  }
  const matchesProfileValue = {matches, loadingMatches};
  useEffect(() => {
    setLoadingMatches(true);
    createInitialFilterFormik(currentUserData.squash.sports)
      .then((initialValues) => {
        setInitialValuesFormik(initialValues);
        setLoadingMatches(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
    console.log("inital values in match2", initialValuesFormik)
  return (
    <>
      {!loadingMatches && (
        <MatchesProfileContext.Provider value={matchesProfileValue}>
          <Formik
            //enableReinitialize={true}
            initialValues={initialValuesFormik}
            //validationSchema={FilterSchema}
            onSubmit={(values) =>
              console.log('if it works it submits', values)
            }>
            <Test getFilterMain={getFilterMain}/>
          </Formik>
        </MatchesProfileContext.Provider>
      )}
    </>
  );
}
export { Match }
