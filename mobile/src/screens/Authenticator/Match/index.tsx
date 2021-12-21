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
import { useQuery} from '@apollo/client'
import styles from '../../../assets/styles/'
import {View, Alert, Button} from 'react-native'
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";

type MatchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MATCH'>
export const FilterSportContext = createContext(null);
export const MatchesProfileContext = createContext(null)


const Match =()  => {
  const [allUsers, setAllUsers] = useState(null)
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
  const [loadingFormik, setLoadingFormik] = useState(true);
  const {data: currentUserData, userLoading} = useContext(UserContext)
  const didMountRef = useRef(false)
  useEffect(() => {
    // you have to add new alerts
    if (didMountRef.current) {
    showMessage({
      message: 'New matches!',
      type: 'info',
      titleStyle:styles.notificationText,
      style: styles.notificationStyle
    });
    }
    else{
      didMountRef.current = true;
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
