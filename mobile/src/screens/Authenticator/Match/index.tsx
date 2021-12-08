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
import {Patron} from './Match'
import {cityVar}from '../../../cache'
type MatchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MATCH'>
export const FilterSportContext = createContext(null);

type MatchT = {
  navigation: MatchScreenNavigationProp
}

const Match  =  ({ navigation}: MatchT )  => {
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
  const [loadingFormik, setLoadingFormik] = useState(true)
  const {aloading, currentUser, data: currentUserData, userLoading} = useContext(UserContext)
  useEffect(() => {
    setLoadingFormik(true);
    createInitialFilterFormik(currentUserData.squash.sports)
      .then((initialValues) => {
        setInitialValuesFormik(initialValues);
        //cityVar(initialValues)
        setLoadingFormik(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
  }, []);
  console.log("inital values in match2", initialValuesFormik)
  return (
    <>
      {!loadingFormik && (
          <Formik
            //enableReinitialize={true}
            initialValues={initialValuesFormik}
            //validationSchema={FilterSchema}
            onSubmit={(values) =>
              console.log('if it works it submits', values)
            }>
          <Patron/>
          </Formik>
      )}
    </>
  );
}
export { Match}
