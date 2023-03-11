import React, { useEffect, useContext,createContext, useRef, useState } from 'react'
import {UserContext} from '@UserContext'
import {MatchList, AppContainer} from '@components'
import { useFormikContext} from 'formik'
import _ from 'lodash'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter, createPatronList} from '@utils'
import {FilterFields} from '@localModels'
import {cityVar}from '@cache'
import {RootRefreshContext} from '../../index'

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
  const [offsetVar, setOffsetVar] = useState(10)
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [allUsers, setAllUsers] = useState(null)
  const [loadUsers, setLoadUsers] = useState(null)
  const { values: filterValues } = useFormikContext<FilterFields>();
  const { potentialMatches, dataGlobal: currentUserData } =
    useContext(UserContext);
  const [matches, setMatches] = useState(null)
  useEffect(() => {
        cityVar(currentUserData?.location.city)
  }, []);
  useEffect(() => {
    setLoadingMatches(true);
    if (potentialMatches) {
      const patron_list = createPatronList(
        currentUserData,
        potentialMatches,
        filterValues,
      );
      setMatches(patron_list);
      setLoadingMatches(false);
    }
  }, [potentialMatches]);
  return (
    <>
      <AppContainer loading={loadingMatches}>
      {!loadingMatches && (
        <>
          <MatchList matches={matches}/>
        </>
      )}
      </AppContainer>
    </>
  );
}
export { Patron }
