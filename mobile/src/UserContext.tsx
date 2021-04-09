import React, {createContext, useEffect, useState} from "react";
import auth from '@react-native-firebase/auth'
import SignInStack from './navigation/SignInStack'
import SignOutStack from './navigation/SignOutStack'
import SportAppStack from './navigation/SportsAppStack'
import {isProfileCompleteVar} from './cache'
import {useReactiveVar} from '@apollo/client'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from './graphql/queries/profile'
import { useQuery, useMutation } from '@apollo/client'

export const UserContext = createContext();
export const AuthNavigator = () => {
  const [confirmResult, setConfirmResult ] = useState(null)
  const [currentUser, setCurrentUser ] = useState(null)
  const [loading, setLoading ] = useState(true)
  const {data} = useQuery(GET_PROFILE_STATUS);
  const onAuthStateChanged = (user) => {
        setCurrentUser(user)
        setLoading(false)
  }
  useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged)
      console.log(unsubscribe)
      return unsubscribe
  }, [])
  const value = {
    confirmResult,
    setConfirmResult,
    currentUser,
  };
  const renderSignIn = () => {
    console.log(currentUser)
    //TODO make note: changes here affect how it skips email after signup
    //TODO: fix surrent User email verification at some point!!
    //if (currentUser && currentUser.email !== null) {
    if (currentUser !== null) {
      return !loading && <SignInStack />;}
    //else if (data.isProfileComplete && currentUser && currentUser.email !== null) {
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
