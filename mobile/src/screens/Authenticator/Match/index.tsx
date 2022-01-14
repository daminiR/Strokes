import React, { useEffect, useContext,createContext, useState } from 'react'
import {StackNavigationProp } from '@react-navigation/stack'
import { RootStackSignInParamList } from '@NavStack'
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


type MatchScreenNavigationProp = StackNavigationProp<RootStackSignInParamList, 'MATCH'>
export const FilterSportContext = createContext(null);
export const MatchesProfileContext = createContext(null)


const Match =()  => {
  const [allUsers, setAllUsers] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const {
    data,
    potentialMatches,
    initialValuesFormik: filterValues,
    userLoading,
    cachedUser,
    currentUser,
    userData,
  } = useContext(UserContext);
  useEffect(() => {
    setLoadingData(true);
    if (data) setLoadingData(false);
  }, [data.squash])
  const renderPatron = () => {
    return <Patron />;
  };
  return (
    <>
      {filterValues && (
        <View style={{flex:1}}>
          <FlashMessage position="top" />
            { !loadingData  && renderPatron()}
        </View>
      )}
    </>
  );
}
export { Match}
