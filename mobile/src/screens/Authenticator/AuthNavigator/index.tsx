import React, {useContext, createContext, useRef, useEffect, useState} from "react";
import messaging from '@react-native-firebase/messaging';
import { Formik} from 'formik'
import {byGameLevel} from '@utils'
import _ from 'lodash'
import { Platform, Alert} from 'react-native';
import { SignOutStack, MatchStackScreen} from '@NavStack'
import { READ_SQUASH, GET_POTENTIAL_MATCHES, SOFT_UN_DELETE_PROFILE} from '@graphQL2'
import { useLazyQuery, useMutation} from '@apollo/client'
import {SWIPIES_PER_DAY_LIMIT} from '@constants'
import { cityVar } from "@cache"
import { SignUp } from "@screens"
import {useNavigation} from '@react-navigation/native';
import  {AppContainer} from '@components'
import { useApolloClient} from '@apollo/client'
import {RootRefreshContext} from '../../../index.js'
export const UserContext = createContext(null);
import {createInitialFilterFormik} from '@utils'
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const AuthNavigator = ({sendbird, currentUser: newUserSub}) => {
  const [currentUser, setCurrentUser ] = useState(newUserSub)
  const [isProfileComplete, setProfileState ] = useState(false)
  const [loadingSigning, setLoadingSiginig] = useState(true);
  const [deleted, setDeleted] = useState({isDeleted: false});
  const [imageErrorVisible, setImageErrorVisible] = useState(false)
  const [changeSport, setChangeSport] = useState(true)
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingMatches, setLoadinMatches] = useState(false);
  const [data, setData] = useState(null);
  const [allUsers, setAllUsers] = useState(null)
  const [offlineMatches, setOfflineMatches] = useState(null)
  const [CacheVal, setCacheVal] = useState(null)
  const [sb, setSb] = useState(sendbird)
  const [loadAllResults, setLoadAllResults] = useState(true)
  const [initialValuesFormik, setInitialValuesFormik] = useState({});
  const {loadingSignUpInRefresh, setLoadingSignUInRefresh} = useContext(RootRefreshContext)
  const didMountRef = useRef(false);
  const [softUnDeleteUser] = useMutation(SOFT_UN_DELETE_PROFILE, {
    //refetchQueries: [{query: READ_SQUASH, variables: {id: currentUser.uid}}],
    onCompleted: async () => {
      setLoadingSignUInRefresh(true);
      console.log("Succesful signout, and soft delete");
      setLoadingSignUInRefresh(false);
    },
  });
  const [queryProssibleMatches, { loading: loadingMatches2, data: testData, fetchMore}] = useLazyQuery(GET_POTENTIAL_MATCHES, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
        setLoadinMatches(false)
      if (data) {
        setLoadinMatches(false)
        const all_users = data.queryProssibleMatches;
        setAllUsers(all_users);
      }
    },
    onError: (err) => {
      setLoadinMatches(false)
      console.log('Match query Error', err);
    },
  });
  const [getSquashProfile, {data: userData, loading: userLoading, error, refetch: refetchUserData}] = useLazyQuery(READ_SQUASH, {
    fetchPolicy: "network-only",
    onCompleted: async (data) => {
      //TODO: if data doesnt exists input is incorrect => add checks
      setLoadingUser(false);
      if (data?.squash) {
        setDeleted(data.squash.deleted);
        //if soft delete is true set to false
        const delete_doc = data.squash.deleted;
        const id = data.squash._id
        if (id) {
          delete_doc &&
            delete_doc.isDeleted &&
            softUnDeleteUser({
              variables: {
                _id: id,
              },
            });
        }
        setProfileState(true);
        setData(data);
      }
    },
    onError: (({graphQLErrors, networkError}) => {
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
            console.log(initialValues);
            const sport = _.find(initialValues.sportFilters, (sportObj) => {
              return sportObj.filterSelected == true;
            }).sport;
            setLoadinMatches(false)
            byGameLevel(initialValues.gameLevels)
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
    if (currentUser) {
      setLoadingUser(true);
      getSquashProfile({variables: {id: currentUser.sub}});
      //setLoadingUser(false);
    }
  }, [loadingSignUpInRefresh, currentUser]);
  useEffect(() => {
  }, [userData]);

  useEffect(() => {
    deleted &&
      deleted.isDeleted &&
      Alert.alert(
        "Account Restored",
        "Your account will no longer be deleted",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );

  }, [deleted])
  useEffect(() => {
    if(didMountRef.current){
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
      } else {
        // user is a soft deleted user and put alert message
        //restore account back
        return !loadingSigning && !loadingMatches && <MatchStackScreen />;
      }
    } else {
        return !loadingUser && <SignOutStack/>
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
