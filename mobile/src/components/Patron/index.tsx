import React, { useEffect, useContext,createContext, useRef, useState } from 'react'
import {UserContext} from '@UserContext'
import {MatchList} from '@components'
import { useFormikContext} from 'formik'
import _ from 'lodash'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter, createPatronList} from '@utils'
import {FilterFields} from '@localModels'
import { useSubscription, useQuery, useLazyQuery} from '@apollo/client'
import { GET_POTENTIAL_MATCHES} from '@graphQL'
import {cityVar}from '@cache'
import {FAB}from 'react-native-elements'

//export const FilterContext = createContext(null)
const addmoreData= {
    type: 'material-community',
    name: 'alarm-plus',
    color: '#ff7f02',
    size: 60,
    style:{margin:0, padding: 0,
    shadowOpacity:0,
    elevation:0
    },
    containerStyle: {padding:0,
    },
  }

const Patron = ()  => {
  console.log("Patron how many querries are running")
  const [offsetVar, setOffsetVar] = useState(10)
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [allUsers, setAllUsers] = useState(null)
  const [loadUsers, setLoadUsers] = useState(null)
  const {values: filterValues } = useFormikContext<FilterFields>();
  const {userData, queryProssibleMatches, potentialMatches, currentUser, data: currentUserData, userLoading, setPotentialMatches} = useContext(UserContext)
  const [matches, setMatches] = useState(null)
  useEffect(() => {
        cityVar(currentUserData?.squash.location.city)
  }, []);
  //const addMoreData = () => {
    //queryProssibleMatches({
      //variables: {_id: currentUser.uid, offset: offsetVar, limit: 3},
    //});
    //setOffsetVar((offset) => offset + 10);
  //};
  useEffect(() => {
    if (potentialMatches) {
      console.log("beforeeeeeeeeeeee",potentialMatches)
      setLoadingMatches(true);
      const patron_list = createPatronList(
        userData?.squash,
        potentialMatches,
        filterValues,
      );
      setMatches(patron_list);
      console.log("new patron list",patron_list)
      setLoadingMatches(false);
    }
  }, [potentialMatches]);
  return (
    <>
      {!loadingMatches && (
        <>
          <MatchList matches={matches}/>
        </>
      )}
    </>
  );
}
export { Patron }
