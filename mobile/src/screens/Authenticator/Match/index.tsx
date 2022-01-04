import React, { useEffect, useContext,createContext, useState } from 'react'
import {StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../../AppNavigator'
import {UserContext} from '@UserContext'
import { Formik} from 'formik'
import _ from 'lodash'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter} from '@localStore'
import {createInitialFilterFormik, createPatronList, calculateOfflineMatches} from '@utils'
import {Patron} from '@components'
import {useApolloClient} from '@apollo/client'
import {styles} from '@styles'
import FlashMessage from "react-native-flash-message";
import {View} from "react-native";
import { showMessage, hideMessage } from "react-native-flash-message";
import {FilterFields} from "@localModels"


type MatchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MATCH'>
export const FilterSportContext = createContext(null);
export const MatchesProfileContext = createContext(null)


const Match =()  => {
  console.log("Match how many querries are running")
  const [allUsers, setAllUsers] = useState(null)
  const {data: currentUserData, initialValuesFormik: filterValues, userLoading, cachedUser, currentUser, userData} = useContext(UserContext)
  const renderPatron = () => {
    return <Patron/>
  }
  return (
    <>
      {filterValues && (
        <View style={{flex:1}}>
          <FlashMessage position="top" />
          <Formik
            //enableReinitialize={true}
            initialValues={filterValues}
            //validationSchema={FilterSchema}
            onSubmit={(values) =>
              console.log('if it works it submits', values)
            }>
            {renderPatron()}
          </Formik>
        </View>
      )}
    </>
  );
}
export { Match}
