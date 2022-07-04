import React, {useContext, createContext, useRef, useEffect, useState} from "react";
import messaging from '@react-native-firebase/messaging';
import { Formik} from 'formik'
import {byGameLevel} from '@utils'
import _ from 'lodash'
import { Platform } from 'react-native';
import { SignOutStack, MatchStackScreen} from '@NavStack'
import { READ_SQUASH, GET_POTENTIAL_MATCHES} from '@graphQL2'
import { useLazyQuery} from '@apollo/client'
import {SWIPIES_PER_DAY_LIMIT} from '@constants'
import  {cityVar} from '@cache'
import  {AppContainer} from '@components'
import { useApolloClient} from '@apollo/client'
import {RootRefreshContext} from '../../../index.js'
export const UserContext = createContext(null);
import {createInitialFilterFormik} from '@utils'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthNavigator = ({sendbird, currentUser: newUserSub}) => {
  const [currentUser, setCurrentUser ] = useState(newUserSub)
  const [isProfileComplete, setProfileState ] = useState(false)
  const [loadingSigning, setLoadingSiginig] = useState(true);
  const [deleted, setDeleted] = useState({isDeleted: false});
  const [imageErrorVisible, setImageErrorVisible] = useState(false)
  const [changeSport, setChangeSport] = useState(true)
  const [loadingUser, setLoadingUser] = useState(false);
  const [data, setData] = useState(null);
  const [allUsers, setAllUsers] = useState(null)
  const [offlineMatches, setOfflineMatches] = useState(null)
  const [CacheVal, setCacheVal] = useState(null)
  const [sb, setSb] = useState(sendbird)
  const [loadAllResults, setLoadAllResults] = useState(true)
  const [initialValuesFormik, setInitialValuesFormik] = useState({});
  const {loadingSignUpInRefresh, setLoadingSignUInRefresh} = useContext(RootRefreshContext)
  const didMountRef = useRef(false)
  const [queryProssibleMatches, { loading: loadingMatches, data: testData, fetchMore}] = useLazyQuery(GET_POTENTIAL_MATCHES, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data) {
        const all_users = data.queryProssibleMatches;
        setAllUsers(all_users);
      }
    },
    onError: (err) => {
      console.log('Match query Errpr', err);
    },
  });
  const [getSquashProfile, {data: userData, loading: userLoading, error, refetch: refetchUserData}] = useLazyQuery(READ_SQUASH, {
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      //TODO: if data doesnt exists input is incorrect => add checks
      setLoadingUser(false);
      if (data?.squash) {
        console.log("did we make it here", data)
        setDeleted(data.squash.deleted)
        setProfileState(true);
        setData(data);
      }
    },
    onError: (({graphQLErrors, networkError}) => {
      console.log("errors here2")
      if (networkError){
        console.log(networkError)
      }
        console.log(graphQLErrors)
    })
  });
  useEffect(() => {
    if (!didMountRef.current) {
      if (userData?.squash) {
        createInitialFilterFormik(userData.squash.sports)
          .then((initialValues) => {
            setInitialValuesFormik(initialValues);
            const dislikes = userData.squash.dislikes
              ? userData.squash.dislikes.length
              : 0;
            console.log(dislikes);
            const likes = userData.squash.likes
              ? userData.squash.likes.length
              : 0;
            console.log(likes);
            const limit = dislikes + likes + SWIPIES_PER_DAY_LIMIT;
            console.log('whats the limit', limit);
            console.log(initialValues);
            const sport = _.find(initialValues.sportFilters, (sportObj) => {
              return sportObj.filterSelected == true;
            }).sport;
            byGameLevel(initialValues.gameLevels),
              queryProssibleMatches({
                variables: {
                  _id: currentUser.sub,
                  offset: 0,
                  limit: limit,
                  location: _.omit(userData.squash.location, ['__typename']),
                  sport: sport,
                  game_levels: byGameLevel(initialValues.gameLevels),
                  ageRange: initialValues.ageRange,
                },
              });
          })
          .catch((err) => {
            console.log(err);
          });
        didMountRef.current = true;
      }
      if (loadingSigning) setLoadingSiginig(false);
    }
  }, [userLoading]);
  const client = useApolloClient();
const start = (user) => {
  if (login) {
    login(user);
  }
};
  useEffect(() => {
    //setLoadingUser(true);
    //setLoadingUser(false);
    console.log("what is current user", currentUser)
    if (currentUser) {
      setLoadingUser(true);
      getSquashProfile({variables: {id: currentUser.sub}});
      //setLoadingUser(false);
    }
  }, [loadingSignUpInRefresh, currentUser]);

  useEffect(() => {
    deleted && deleted.isDeleted &&
      console.log("user info must be erase from react native and soft deleted on database")
  }, [deleted])
  useEffect(() => {
    if(didMountRef.current){
      console.log("figure logic for useRef")
    }
  }, [cityVar()])
  const login = user => {
    const savedUserKey = 'savedUser';
    AsyncStorage.setItem(savedUserKey, JSON.stringify(user))
      .then(async () => {
        try {
          setCurrentUser(user);
          const authorizationStatus = await messaging().requestPermission();
          if (
            authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
          ) {
            if (Platform.OS === 'ios') {
              //const token = await messaging().getAPNSToken();
              //sendbird.registerAPNSPushTokenForCurrentUser(token);
            } else {
              const token = await messaging().getToken();
              sendbird.registerGCMPushTokenForCurrentUser(token);
            }
          }
        } catch (err) {
          console.error(err);
        }
      })
      .catch(err => console.error(err));
  };

  if (loadingSigning) return null
  const value = {
    getSquashProfile: getSquashProfile,
    refetchUserData: refetchUserData,
    userData: userData,
    setData: setData,
    data: data,
    userLoading: userLoading,
    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
    isProfileComplete: isProfileComplete,
    setProfileState: setProfileState,
    potentialMatches: allUsers,
    setPotentialMatches: setAllUsers,
    cachedUser: CacheVal,
    offlinMatches:offlineMatches,
    setOfflineMatches:setOfflineMatches,
    initialValuesFormik: initialValuesFormik,
    queryProssibleMatches: queryProssibleMatches,
    setLoadAllResults: setLoadAllResults,
    imageErrorVisible: imageErrorVisible,
    setImageErrorVisible: setImageErrorVisible,
    changeSport: changeSport,
    setChangeSport: setChangeSport,
    sendbird: sb,
    setSendbird: setSb,
    onLogin: login,
  };
  const render2 = () =>{
    if (userData?.squash && currentUser) {
      // found user squash data
      if (!deleted || !deleted?.isDeleted) {
        // user is not a soft deleted user
        return !loadingSigning && !loadingMatches && <MatchStackScreen />;
      }
    } else {
      return !loadingUser && <SignOutStack/>;
    }
  }

  const renderRoot = () => {
    return (
      <AppContainer loading={loadingSigning || loadingUser || loadingMatches || userLoading}>
        <UserContext.Provider value={value}>
          {initialValuesFormik && (
            <Formik
              enableReinitialize={true}
              initialValues={initialValuesFormik}
              //validationSchema={FilterSchema}
              onSubmit={(values) =>
                console.log('if it works it submits', values)
              }>
              {render2()}
            </Formik>
          )}
        </UserContext.Provider>
      </AppContainer>
    );
  };
  return <>{renderRoot()}</>;}
  export {AuthNavigator}
