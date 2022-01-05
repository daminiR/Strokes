import React, {createContext, useRef, useEffect, useState} from "react";
import auth from '@react-native-firebase/auth'
import {byGameLevel} from '@utils'
import {styles} from '@styles'
import _ from 'lodash'
import FlashMessage from "react-native-flash-message";
import { SignOutStack, MatchStackScreen} from '@NavStack'
import { READ_SQUASH } from './graphql/queries'
import { useSubscription, useQuery, useLazyQuery} from '@apollo/client'
import {MESSAGE_POSTED} from './graphql/queries'
import {SWIPIES_PER_DAY_LIMIT} from '@constants'
import { GET_POTENTIAL_MATCHES} from './graphql/queries'
import { useApolloClient} from '@apollo/client'
import { showMessage, hideMessage } from "react-native-flash-message";
export const UserContext = createContext(null);

import {createInitialFilterFormik, createPatronList, calculateOfflineMatches} from '@utils'
export const AuthNavigator = () => {
  const [currentUser, setCurrentUser ] = useState(null)
  const [isProfileComplete, setProfileState ] = useState(false)
  const [loadingSigning, setLoadingSiginig] = useState(true);
  const [deleted, setDeleted] = useState({isDeleted: false});
  const [isUserOnmongoDb, setIsUseOnMongoDb] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [data, setData] = useState(true);
  const [allUsers, setAllUsers] = useState(null)
  const [offlineMatches, setOfflineMatches] = useState(null)
  const [CacheVal, setCacheVal] = useState(null)
  const [initialValuesFormik, setInitialValuesFormik] = useState(null);
  const [queryProssibleMatches, {data: testData}] = useLazyQuery(GET_POTENTIAL_MATCHES, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setLoadingMatches(true)
      console.log("check if fetch more updated any data", data)
      const all_users = data.queryProssibleMatches;
      console.log("............",all_users)
      setAllUsers(all_users)
      setLoadingMatches(false)
    }
  });
  const [getSquashProfile, {data: userData, loading: userLoading, error, refetch: refetchUserData}] = useLazyQuery(READ_SQUASH, {
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      //TODO: if data doesnt exists input is incorrect => add checks
      console.log("data", data)
      if (data) {
        setDeleted(data.squash.deleted)
        setProfileState(true);
        setData(data)
        const initialValues = await createInitialFilterFormik(userData.squash.sports)
        //.then((initialValues) => {
          //console.log("sucess")
        setInitialValuesFormik(initialValues);
        const dislikes = data.squash.dislikes ? data.squash.dislikes.length : 0;
        console.log(dislikes)
        const likes = data.squash.likes ? data.squash.likes.length : 0;
        console.log(likes)
        const limit = dislikes + likes + SWIPIES_PER_DAY_LIMIT;
        console.log('whats the limit', limit);
        const sport = _.find(initialValues.sportFilters, sportObj => {return sportObj.filterSelected ==  true}).sport
        byGameLevel(initialValues.gameLevels),
        queryProssibleMatches({
          variables: {
            _id: currentUser.uid,
            offset: 0,
            limit: limit,
            location: _.omit(data.squash.location, ['__typename']),
            sport: sport,
            game_levels: byGameLevel(initialValues.gameLevels),
            ageRange: initialValues.ageRange
          },
        });
        if (loadingSigning) setLoadingSiginig(false);
      }
    },
    onError: (({graphQLErrors, networkError}) => {
      console.log("errors")
      if (networkError){
        console.log(networkError)
      }
        console.log(graphQLErrors)
    })
  });
  const client = useApolloClient();
  const onAuthStateChanged = (currentUser) => {
      setCurrentUser(currentUser);
      if (currentUser) {
        if (!CacheVal) {
          // dta can be null for the first time users during sign up
          const data = client.readQuery({
            query: READ_SQUASH,
            variables: {id: currentUser.uid},
          });
          if (data?.squash) {
            const cachedUser = data.squash
            console.log('cached', cachedUser.matches);
            setCacheVal(cachedUser);
          }
        }
        getSquashProfile({variables: {id: currentUser.uid}});
        setLoadingUser(false);
      } else {
        setLoadingUser(false);
      }
  }
  useEffect(() => {
      setLoadingUser(true)
      const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged)
      console.log(unsubscribe)
      return unsubscribe
  }, [])
  useEffect(() => {
    deleted && deleted.isDeleted &&
      console.log("user info must be erase from react native and soft deleted on database")
  }, [deleted])

  //useEffect(() => {
    //// you have to add new alerts
    //if (userData) {
      //const cachedMatches = calculateOfflineMatches(CacheVal);
      //const totalMatches = calculateOfflineMatches(userData.squash);
      //console.log('cached', cachedMatches);
      //console.log('not cached', totalMatches);
      //const cachedIDs = _.map(cachedMatches, (cachedObj) => {
        //return cachedObj._id;
      //});
      //const matchedIDs = _.map(totalMatches, (matchObj) => {
        //return matchObj._id;
      //});
      //if (!_.isEqual(cachedIDs, matchedIDs)) {
        //showMessage({
          //message: 'New matches!',
          //type: 'info',
          //titleStyle: styles.notificationText,
          //style: styles.notificationStyle,
        //});
      //}
    //}
  //}, [userData.squash.matches]);

  if (loadingSigning) return null
  const value = {
    refetchUserData: refetchUserData,
    userData: userData,
    setData: setData,
    data: data,
    userLoading: userLoading,
    currentUser: currentUser,
    isProfileComplete: isProfileComplete,
    setProfileState: setProfileState,
    potentialMatches: allUsers,
    setPotentialMatches: setAllUsers,
    cachedUser: CacheVal,
    offlinMatches:offlineMatches,
    setOfflineMatches:setOfflineMatches,
    initialValuesFormik: initialValuesFormik,
    queryProssibleMatches: queryProssibleMatches
  };
  const render2 = () =>{
    if (currentUser && (!deleted || !deleted.isDeleted)) {
          return !loadingSigning  &&   !loadingMatches  && <MatchStackScreen/>;
      }
    else {
      return !loadingUser &&  <SignOutStack />;
    }
  }
  return (
    <UserContext.Provider value={value}>
      {render2()}
    </UserContext.Provider>
  )
}
