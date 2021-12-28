import React, {createContext, useRef, useEffect, useState} from "react";
import auth from '@react-native-firebase/auth'
import { SignOutStack, MatchStackScreen} from '@NavStack'
import { READ_SQUASH } from './graphql/queries'
import { useSubscription, useLazyQuery} from '@apollo/client'
import {MESSAGE_POSTED} from './graphql/queries'
import { GET_POTENTIAL_MATCHES} from './graphql/queries'
import { useApolloClient} from '@apollo/client'
export const UserContext = createContext(null);
export const AuthNavigator = () => {
  const [currentUser, setCurrentUser ] = useState(null)
  const [isProfileComplete, setProfileState ] = useState(false)
  const [loadingSigning, setLoadingSiginig] = useState(false);
  const [isUserOnmongoDb, setIsUseOnMongoDb] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [data, setData] = useState(true);
  const [allUsers, setAllUsers] = useState(null)
  const [offlineMatches, setOfflineMatches] = useState(null)
  const [CacheVal, setCacheVal] = useState(null)
  const [queryProssibleMatches] = useLazyQuery(GET_POTENTIAL_MATCHES, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setLoadingMatches(true)
        const all_users = data.queryProssibleMatches;
        setAllUsers(all_users)
      setLoadingMatches(false)
    }
  });
  const { data: postedMessages, loading: loadingMessagePosted} = useSubscription(MESSAGE_POSTED)
  const [getSquashProfile, {data: userData, loading: userLoading, error}] = useLazyQuery(READ_SQUASH, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      //TODO: if data doesnt exists input is incorrect => add checks
      console.log("data", data)
      if (data) {
        setProfileState(true);
        setIsUseOnMongoDb(true);
        setData(data)
        if (loadingSigning) setLoadingSiginig(false);
      }
    },
    onError: (({graphQLErrors, networkError}) => {
      console.log("errors")
      if (networkError){
        setIsUseOnMongoDb(false);
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
        queryProssibleMatches({variables: {_id: currentUser.uid}});
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
  }, [isUserOnmongoDb])

  if (loadingSigning) return null
  const value = {
    userData: userData,
    setData: setData,
    data: data,
    userLoading: userLoading,
    setIsUseOnMongoDb: setIsUseOnMongoDb,
    currentUser: currentUser,
    isProfileComplete: isProfileComplete,
    setProfileState: setProfileState,
    potentialMatches: allUsers,
    setPotentialMatches: setAllUsers,
    cachedUser: CacheVal,
    offlinMatches:offlineMatches,
    setOfflineMatches:setOfflineMatches
  };
  const render2 = () =>{
    if (currentUser && isUserOnmongoDb) {
          return !loadingSigning && !loadingMatches  && <MatchStackScreen />;
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
