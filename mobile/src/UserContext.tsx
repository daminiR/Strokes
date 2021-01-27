import React, {createContext, useEffect, useState} from "react";
import auth from '@react-native-firebase/auth'
import SignInStack from './navigation/SignInStack'
import SignOutStack from './navigation/SignOutStack'
import SportAppStack from './navigation/SportsAppStack'
import {isProfileCompleteVar} from './cache'
import {useReactiveVar} from '@apollo/client'

export const UserContext = createContext();
export const AuthNavigator = () => {
  const [confirmResult, setConfirmResult ] = useState(null)
  const [currentUser, setCurrentUser ] = useState(null)
  const [loading, setLoading ] = useState(true)
  const  isProfileComplete  = useReactiveVar(isProfileCompleteVar)
  const onAuthStateChanged = (user) => {
        setCurrentUser(user)
        setLoading(false)
        console.log(currentUser)
  }
  useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged)
      return unsubscribe
  }, [])
  const value = {
    confirmResult,
    setConfirmResult,
    currentUser,
  };
  const renderSignIn = () => {
    //#todo make note: changes here affect how it skips email after signup
    if (!isProfileComplete && currentUser && currentUser.email !== null) {
      return !loading && <SignInStack />;
    } else if (isProfileComplete && currentUser && currentUser.email !== null) {
      return !loading && <SportAppStack />;
    } else {
      return <SignOutStack />;
    }
  }
  return (
    <UserContext.Provider value={value}>
      {renderSignIn()}
    </UserContext.Provider>
  )
}
