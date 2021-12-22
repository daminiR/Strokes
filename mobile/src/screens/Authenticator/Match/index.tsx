import React, { useEffect, useRef, useContext,createContext, useState } from 'react'
import {StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../../AppNavigator'
import {UserContext} from '../../../UserContext'
import { Formik} from 'formik'
import _ from 'lodash'
import {_retriveGameLevel, _retriveAgeRangeFilter, _retriveSportFilter} from '../../../utils/AsyncStorage/retriveData'
import {createInitialFilterFormik} from '../../../utils/formik/index'
import {Patron} from './Match'
import {createPatronList} from '../../../utils/matching/patron_list'
import { useQuery, useApolloClient} from '@apollo/client'
import styles from '../../../assets/styles/'
import {View, Alert, Button} from 'react-native'
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { GET_POTENTIAL_MATCHES, READ_SQUASH} from '../../../graphql/queries/profile'
import {calculateOfflineMatches} from '../../../utils/matching/dataManipulation'

type MatchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MATCH'>
export const FilterSportContext = createContext(null);
export const MatchesProfileContext = createContext(null)


const Match =()  => {
  const [allUsers, setAllUsers] = useState(null)
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
  const [loadingFormik, setLoadingFormik] = useState(true);
  const {data: currentUserData, userLoading, cachedUser, currentUser} = useContext(UserContext)
  const client = useApolloClient();
  useEffect(() => {
    // you have to add new alerts
    const cachedMatches =  calculateOfflineMatches(cachedUser)
    const totalMatches =  calculateOfflineMatches(currentUserData.squash)
    console.log("cached", cachedMatches)
    console.log("not cached", totalMatches)
    const cachedIDs = _.map(cachedMatches, cachedObj => {
      return cachedObj._id
    })
    const matchedIDs = _.map(totalMatches, (matchObj) => {
      return matchObj._id;
    });
    if (!_.isEqual(cachedIDs, matchedIDs)) {
      showMessage({
        message: 'New matches!',
        type: 'info',
        titleStyle: styles.notificationText,
        style: styles.notificationStyle,
      });
    }
  }, [currentUserData.squash.matches]);
  useEffect(() => {
    if (!userLoading){
      setLoadingFormik(true);
      createInitialFilterFormik(currentUserData.squash.sports)
        .then((initialValues) => {
          setInitialValuesFormik(initialValues);
          setLoadingFormik(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // bruhhh
  }, [currentUserData]);
  return (
    <>
      <FlashMessage position="top" />
      {!loadingFormik && (
        <Formik
          //enableReinitialize={true}
          initialValues={initialValuesFormik}
          //validationSchema={FilterSchema}
          onSubmit={(values) => console.log('if it works it submits', values)}>
          <Patron />
        </Formik>
      )}
    </>
  );
}
export { Match}
