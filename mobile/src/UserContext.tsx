import React, {createContext, useEffect, useState} from "react";
import auth from '@react-native-firebase/auth'
import SignInStack from './navigation/SignInStack'
import SignOutStack from './navigation/SignOutStack'
import SportAppStack from './navigation/SportsAppStack'
import { ApolloErrorScreen, Hello }  from './screens/Authenticator/'
import {isProfileCompleteVar} from './cache'
import {useReactiveVar} from '@apollo/client'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from './graphql/queries/profile'
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'

export const UserContext = createContext();
export const AuthNavigator = () => {
  const [confirmResult, setConfirmResult ] = useState(null)
  const [currentUser, setCurrentUser ] = useState()
  const [isProfileComplete, setProfileState ] = useState(false)
  const [isApolloConected, setIsApolloConected ] = useState(false)
  const [loadingSigning, setLoadingSiginig] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [getSquashProfile, {data, loading: loadingApollo, error}] = useLazyQuery(READ_SQUASH, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      //TODO: if data doesnt exists input is incorrect => add checks
      if (data) {
        setProfileState(true);
        setIsApolloConected(true)
        if (loadingSigning) setLoadingSiginig(false);
      }
    },
    onError: (({graphQLErrors, networkError}) => {
      console.log("errors")
      if (networkError){
        setIsApolloConected(false)
        console.log(networkError)
        // go to appoloeError page
        // logout user from firebase priority high! TODO: this needs to happen to every querry that takes place! actually dont need to do this -> this needs thinking
      }
    })
  });
  const onAuthStateChanged = (currentUser) => {
      setCurrentUser(currentUser);
      if (currentUser) {
        getSquashProfile({variables: {id: currentUser.uid}});
        setLoadingUser(false)
      }
      else{
       setLoadingUser(false)
      }
  }
  useEffect(() => {
      setLoadingUser(true)
      const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged)
      console.log(unsubscribe)
      return unsubscribe
  }, [])

  if (loadingSigning) return null
  const value = {
    confirmResult,
    setConfirmResult,
    currentUser,
    setCurrentUser,
    isProfileComplete,
    setProfileState
  };
  const render2 = () =>{
    if (currentUser) {
      //if (isApolloConected){
          return !loadingSigning && <SignInStack />;
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
  const renderSignIn = () => {
    //TODO make note: changes here affect how it skips email after signup
    //TODO: fix surrent User email verification at some point!!
    //if (currentUser && currentUser.email !== null) {
    if (currentUser  !== null && loadingSigning === false) {
      if(isApolloConected){
          return !loadingSigning && <SignInStack />;
    }
    else{
      return <ApolloErrorScreen isApolloConected={isApolloConected} />;
    }
    }
    //else if ( currentUser && currentUser.email !== null) {
    //return !loading && <SportAppStack />;}
    else {
      return !loadingSigning && <SignOutStack />;
    }
  }
  return (
    <UserContext.Provider value={value}>
      {render2()}
    </UserContext.Provider>
  )
}
