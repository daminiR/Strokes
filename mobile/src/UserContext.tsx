import React, {createContext, useRef, useEffect, useState} from "react";
import auth from '@react-native-firebase/auth'
import SignInStack from './navigation/SignInStack'
import SignOutStack from './navigation/SignOutStack'
import SportAppStack from './navigation/SportsAppStack'
import { ApolloErrorScreen, Hello }  from './screens/Authenticator/'
import {isProfileCompleteVar} from './cache'
import {useReactiveVar} from '@apollo/client'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from './graphql/queries/profile'
import { useQuery, useSubscription, useMutation, useLazyQuery} from '@apollo/client'
import {MESSAGE_POSTED} from './graphql/queries/profile'
import {createPatronList} from './utils/matching/patron_list'
import { GET_POTENTIAL_MATCHES} from './graphql/queries/profile'

import { useApolloClient} from '@apollo/client'
export const UserContext = createContext(null);
export const AuthNavigator = () => {
  const [currentUser, setCurrentUser ] = useState(null)
  const [isProfileComplete, setProfileState ] = useState(false)
  const [isApolloConected, setIsApolloConected ] = useState(false)
  const [loadingSigning, setLoadingSiginig] = useState(false);
  const [isUserOnmongoDb, setIsUseOnMongoDb] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [data, setData] = useState(true);
  const [allUsers, setAllUsers] = useState(null)
  const [CacheVal, setCacheVal] = useState(null)
  //const{data: potentialMatches} = useQuery(GET_POTENTIAL_MATCHES, {
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
        setIsApolloConected(true);
        setIsUseOnMongoDb(true);
        setData(data)
        if (loadingSigning) setLoadingSiginig(false);
      }
      //onError: ({graphQLErrors, networkError}) => {
          //if(networkError){
            //setIsUseOnMongoDb(false);
          //}
      //}
    },
    onError: (({graphQLErrors, networkError}) => {
      console.log("errors")
      if (networkError){
        setIsUseOnMongoDb(false);
        setIsApolloConected(false)
        console.log(networkError)
        // go to appoloeError page
        // logout user from firebase priority high! TODO: this needs to happen to every querry that takes place! actually dont need to do this -> this needs thinking
      }
        console.log(graphQLErrors)

    })
  });

  const client = useApolloClient();
  const onAuthStateChanged = (currentUser) => {
      setCurrentUser(currentUser);
      if (currentUser) {
        if (!CacheVal) {
          const {squash: cachedUser} = client.readQuery({
            query: READ_SQUASH,
            variables: {id: currentUser.uid},
          });
          console.log('cached', cachedUser.matches);
          setCacheVal(cachedUser.matches);
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
    cachedVal: CacheVal
  };
  const render2 = () =>{
    if (currentUser && isUserOnmongoDb) {
      //if (isApolloConected){
          return !loadingSigning && !loadingMatches  && <SignInStack />;
      }
      //else{
        //// also remove current user and sign them out from firebase
      //return !loadingApollo && <ApolloErrorScreen isApolloConected={isApolloConected} />;
      //}
    //}
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
