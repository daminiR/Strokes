import React, { useRef, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import storage from '@react-native-firebase/storage'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  SafeAreaView,
  View,
  Text,
  Button,
} from 'react-native';
import { Storage } from '@google-cloud/storage'
import {GET_SPORTS_LIST} from '../../../graphql/queries/profile'
import { onScreen, goBack } from '../../../constants'
import {sanitizeFile } from './../../../utils/fileNaming'
import { AppContainer } from '../../../components'
import { RootStackParamList } from '../../../AppNavigator'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useQuery, useMutation, useLazyQuery, HTTPFetchNetworkInterface} from '@apollo/client'
import * as RNFS from 'react-native-fs'
import  RNFetchBlob  from 'rn-fetch-blob'
import {GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import {UPDATE_USER_SPORTS, UPLOAD_FILE} from '../../../graphql/mutations/profile'
import { useFocusEffect, NavigationContainer } from '@react-navigation/native'
import ImagePicker from 'react-native-image-crop-picker'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { generateRNFile } from "../../../utils/Upload"
import { ReactNativeFile, File } from 'apollo-upload-client'
import { storage as GCP_Storage } from '@react-native-firebase/storage';
import { PictureWall } from './picturesWall'
import * as mime from 'react-native-mime-types'
import {sportsItemsVar} from '../../../cache'
export const ProfileContext = createContext()
export type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PROFILE'>
export type ProfileScreenRouteProp = RouteProp<RootStackSignInParamList, 'PR'>;
type ProfileT = {
  navigation: ProfileScreenNavigationProp
  route: ProfileScreenRouteProp
}
const Profile = ({ navigation, route }: ProfileT ): ReactElement => {
  // TODO: very hacky way to stop useEffect from firt render => need more elegant sol
  const didMountRef = useRef(false)
  const [loading, setLoading] = useState(false)
  const {currentUser} = useContext(UserContext)
  const [error, setError] = useState('')
  const {confirmResult, setConfirmResult} = useContext(UserContext)
  const {data} = useQuery(GET_PROFILE_STATUS);
  const [updateUserSports] = useMutation(UPDATE_USER_SPORTS);
  const [images, setImage] = useState(null);
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [getSquashData, {data: squashData, error: profileError}] = useLazyQuery(READ_SQUASH, {
    variables: {id: currentUser.uid},
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data) {
        //sportsItemsVar(data.squash.sports)
        if (loading) setLoading(false);
      }
    },
    onError: (profileerror => {
      console.log(profileerror)
    })
  });
  let {
    loading: apolloLoading,
    error: apolloError,
    data: apolloSportsList,
  } = useQuery(GET_SPORTS_LIST, {});
  useEffect(() => {
    if (didMountRef.current){
      const tempsp = []
      apolloSportsList.sportItems.map((sport_obj) => {
        tempsp.push({game_level: 0, sport: sport_obj.sport});
      });
      console.log(sportsItemsVar())
      console.log(apolloSportsList)
      if (currentUser) {
        updateUserSports({
          variables: {_id: currentUser.uid, sportsList: tempsp},
        });
      }
    }
    else {
      //getSquashData({variables: currentUser.uid})
      didMountRef.current = true
    }
    }, [apolloSportsList]),
  //useFocusEffect(
    //React.useCallback(() => {
      //console.log(apolloSportsList, " is this running last test")
      //// update mutation for squashdata and everythign else will be updated in the card divider
      //// // tempo add game+level as 0 for all sports = whole another world to ui
      //const tempsp = []
      //apolloSportsList.sportItems.map((sport_obj) => {
        //tempsp.push({game_level: 0, sport: sport_obj.sport});
      //});
    //if (currentUser){
      ////updateUserSports({variables: {_id: currentUser.uid, sportsList: tempsp}});
    //}
    //}, [apolloSportsList]),
  //);
  useFocusEffect(
    React.useCallback(() => {
      getSquashData({variables: currentUser.uid})
      console.log("fire when on page")
    }, [])
  );
  const sports_values = {
    squashData,
  }
  return (
    <>
      <ProfileContext.Provider value={sports_values}>
            <ScrollView contentContainerStyle = {{flexGrow: 1, justifyContent: 'space-between'}} >
              <PictureWall/>
          </ScrollView>
      </ProfileContext.Provider>
    </>
  );
}
const styles = StyleSheet.create({
  scrollview: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
export { Profile }
