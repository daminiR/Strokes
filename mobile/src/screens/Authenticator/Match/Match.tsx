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

//export const MatchesProfileContext = createContext(null)
export const FilterContext = createContext(null)

const Patron = ()  => {
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [allUsers, setAllUsers] = useState(null)
  const {values: filterValues } = useFormikContext<FilterFields>();
  const { potentialMatches, currentUser, data: currentUserData, userLoading} = useContext(UserContext)
  const [matches, setMatches] = useState(null)
  useEffect(() => {
        cityVar(currentUserData?.squash.location.city)
  }, []);
  useEffect(() => {
    if (potentialMatches) {
      setLoadingMatches(true);
      const patron_list = createPatronList(
        currentUserData?.squash,
        potentialMatches,
        filterValues,
      );
      setMatches(patron_list);
      console.log("new patron list",patron_list)
      setLoadingMatches(false);
    }
  }, [filterValues]);
  return (
    <>
      {!loadingMatches && (
          <Test matches={matches}/>
      )}
    </>
  );
}
export { Patron }
