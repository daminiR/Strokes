import React, {createContext, useRef, useEffect, useState} from "react";
import auth from '@react-native-firebase/auth'
import SignInStack from './navigation/SignInStack'
import SignOutStack from './navigation/SignOutStack'
import SportAppStack from './navigation/SportsAppStack'
import { ApolloErrorScreen, Hello }  from './screens/Authenticator/'
import {isProfileCompleteVar} from './cache'
import {useReactiveVar} from '@apollo/client'
import { GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from './graphql/queries/profile'
import { useQuery, useMutation, useLazyQuery} from '@apollo/client'

export const UserContext = createContext(null);
export const AuthNavigator = () => {
  const [currentUser, setCurrentUser ] = useState(null)
  const [isProfileComplete, setProfileState ] = useState(false)
  const [isApolloConected, setIsApolloConected ] = useState(false)
  const [loadingSigning, setLoadingSiginig] = useState(false);
  const [isUserOnmongoDb, setIsUseOnMongoDb] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [aloading, setALoading] = useState(false);
  const [data, setData] = useState(true);
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
  }, [isUserOnmongoDb])
  useEffect(() => {
      setALoading(userLoading)
  }, [userLoading])

  if (loadingSigning) return null
  const value = {
    userData: data,
    setData: setData,
    data: data,
    userLoading: userLoading,
    setIsUseOnMongoDb: setIsUseOnMongoDb,
    currentUser: currentUser,
    isProfileComplete: isProfileComplete,
    setProfileState: setProfileState,
    setALoading: aloading
  };
  const render2 = () =>{
    if (currentUser && isUserOnmongoDb) {
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
  return (
    <UserContext.Provider value={value}>
      {render2()}
    </UserContext.Provider>
  )
}
