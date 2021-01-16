import React, {createContext, useEffect, useState} from "react";
import auth from '@react-native-firebase/auth'
import SignInStack from './navigation/SignInStack'
import SignOutStack from './navigation/SignOutStack'

export const UserContext = createContext();
export const AuthNavigator = () => {
  const [confirmResult, setConfirmResult ] = useState(null)
  const [currentUser, setCurrentUser ] = useState(null)
  const [loading, setLoading ] = useState(true)
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
  return (
    <UserContext.Provider value={value}>
      { currentUser && currentUser.email !== null? (
      !loading && <SignInStack/>) : (
      <SignOutStack/>)}
    </UserContext.Provider>
  )
}
