import React, { useEffect, useContext,createContext, useRef, useState } from 'react'
import {UserContext} from '../../../UserContext'
import { useLazyQuery} from '@apollo/client'
import { GET_POTENTIAL_MATCHES} from '../../../graphql/queries/profile'
import {Test} from './Test'
import {createPatronList} from '../../../utils/matching/patron_list'
import { useFormikContext} from 'formik'
import _ from 'lodash'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter} from '../../../utils/AsyncStorage/retriveData'
import {FilterFields} from '../../../localModels/UserSportsList'
import {cityVar}from '../../../cache'

export const MatchesProfileContext = createContext(null)
export const FilterContext = createContext(null)

const Patron = ()  => {
  const didMountRef = useRef(false)
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [matches, setMatches] = useState(null)
  const [allUsers, setAllUsers] = useState(null)
  const {values: filterValues } = useFormikContext<FilterFields>();
  const {currentUser, data: currentUserData, userLoading} = useContext(UserContext)
  // you have to re querry and reget filters everytime filters change -> useEffect
    //fetchPolicy: "network-only",
  const [queryProssibleMatches] = useLazyQuery(GET_POTENTIAL_MATCHES, {
    onCompleted: (data) => {
        setLoadingMatches(true)
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
        cityVar(currentUserData?.squash.location.city)
  }, []);
  useEffect(() => {
    if (didMountRef.current) {
        setLoadingMatches(true)
        const patron_list = createPatronList(currentUserData.squash?.location, allUsers, currentUserData.squash?.likes, currentUserData.squash?.dislikes, currentUserData.squash?.matches, filterValues)
        setMatches(patron_list);
        setLoadingMatches(false)
    } else {
      didMountRef.current = true;
    }
  }, [filterValues]);
  const matchesProfileValue = {matches, loadingMatches};
  console.log("values o fmatches debug", matchesProfileValue)
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
