import React, {createContext, useEffect, useState} from "react";
import auth from '@react-native-firebase/auth'
import SignInStack from './navigation/SignInStack'
import SignOutStack from './navigation/SignOutStack'
import SportAppStack from './navigation/SportsAppStack'
import {isProfileCompleteVar} from './cache'
import {useReactiveVar} from '@apollo/client'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from './graphql/queries/profile'
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'

export const UserContext = createContext();
export const AuthNavigator = () => {
  const [confirmResult, setConfirmResult ] = useState(null)
  const [currentUser, setCurrentUser ] = useState()
  const [isProfileComplete, setProfileState ] = useState(false)
  const [loading, setLoading] = useState(true);
  const [getSquashProfile, {data, error}] = useLazyQuery(READ_SQUASH, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      console.log(data)
      if (data) {
        setProfileState(true);
        if (loading) setLoading(false);
      }
    },
  });
  const onAuthStateChanged = (currentUser) => {
      setCurrentUser(currentUser);
      if (currentUser) {
        getSquashProfile({variables: {id: currentUser.uid}});
      }
      if (loading) setLoading(false)
  }
  useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged)
      console.log(unsubscribe)
      return unsubscribe
  }, [])

  if (loading) return null
  const value = {
    confirmResult,
    setConfirmResult,
    currentUser,
    setCurrentUser,
    isProfileComplete,
    setProfileState
  };
  const renderSignIn = () => {
    //TODO make note: changes here affect how it skips email after signup
    //TODO: fix surrent User email verification at some point!!
    //if (currentUser && currentUser.email !== null) {
    if (currentUser  !== null && loading === false) {
      //getSquashProfile({variables: {id: currentUser.uid}})
      if (isProfileComplete === false) {
        return !loading && <SportAppStack />;
      } else if (isProfileComplete === true) {
        return !loading && <SignInStack />;
      }
    }
    //else if ( currentUser && currentUser.email !== null) {
    //return !loading && <SportAppStack />;}
    else {
      return !loading && <SignOutStack />;
    }
  }
  return (
    <UserContext.Provider value={value}>
      {renderSignIn()}
    </UserContext.Provider>
  )
}
