import React, { useRef, createContext, useEffect, useContext, useState, ReactElement } from 'react'
import storage from '@react-native-firebase/storage'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { City } from '../../../components/City/City';
import { Filters } from '../../../components/Filters/Filters';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  TouchableOpacity,
  Modal,
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
import styles from '../../../assets/styles/'
import { onScreen, goBack } from '../../../constants'
import {sanitizeFile } from './../../../utils/fileNaming'
import { AppContainer } from '../../../components'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { RootStackParamList } from '../../../AppNavigator'
import auth from '@react-native-firebase/auth'
import {UserContext} from '../../../UserContext'
import { useQuery, useMutation, useLazyQuery, HTTPFetchNetworkInterface} from '@apollo/client'
import * as RNFS from 'react-native-fs'
import  RNFetchBlob  from 'rn-fetch-blob'
import {GET_FIRST_NAME, GET_PROFILE_STATUS, READ_SQUASH, GET_SELECTED_SQUASH, READ_SQUASHES } from '../../../graphql/queries/profile'
import {UPDATE_USER_SPORTS, UPLOAD_FILE} from '../../../graphql/mutations/profile'
import { useFocusEffect, NavigationContainer } from '@react-navigation/native'
import ImagePicker from 'react-native-image-crop-picker'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { generateRNFile } from "../../../utils/Upload"
import { ReactNativeFile, File } from 'apollo-upload-client'
import { storage as GCP_Storage } from '@react-native-firebase/storage';
import { PictureWall } from './picturesWall'
import * as mime from 'react-native-mime-types'
import { Tab,TabView, withBadge, Icon, Avatar, Badge, BottomSheet, ListItem} from 'react-native-elements'
import {FirstNameVar, sportsItemsVar} from '../../../cache'
import {ProfileView} from './ProfileView'
import {ProfileSettings} from './profileSettings'
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
  const [loadingSportsData, setLoadingSportsData] = useState(true)
  const [index, setIndex] = useState(0)
  const [tabState, setTabState] = useState(0)
  const {currentUser} = useContext(UserContext)
  const [loadingSignOut, setLoadingSignOut] = useState(true)
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
        FirstNameVar({FirstName: data.squash.first_name, LastName: data.squash.last_name})
        if (loadingSportsData) setLoadingSportsData(false);
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
  let {
    loading: firstNameLoading,
    error: firstNameError,
    data: firstName,
  } = useQuery(GET_FIRST_NAME);
  useEffect(() => {

    }, [apolloSportsList])

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
    }, [apolloSportsList])
  useEffect(() => {
    console.log(firstName)
    }, [firstName])
  useFocusEffect(
    React.useCallback(() => {
      getSquashData({variables: currentUser.uid})
      console.log("fire when on page")
    }, [])
  );
  const sports_values = {
    squashData,
    loadingSportsData
  }
  const _onPressSignOut = async () : Promise<void> => {
    setLoadingSignOut(true)
    await auth()
      .signOut()
      .then((res) => {
        console.log('Succesful signout');
        console.log(currentUser);
        //setConfirmResult(null)
        setLoadingSignOut(false);
      })
      .catch((err) => {
        console.log(err.code);
      });
  }
  const _editDisplay = (display) => {
    console.log("ddd")
    setIsVisible(display)
  }
  const [isVisible, setIsVisible] = useState(false);
const _onPressDone = () => {
  // add anything that needs to be modified -> TODO: remove all database updates and add them here! => this is super important for optimizing and scaling! you have to many updates to mutations data!
  setIsVisible(false)
}
const _onPressCancel = () => {
  //  clear everything from local states and dont push to data base!
   setIsVisible(false)
}
const renderDone = () => {
  return (
    <TouchableOpacity onPress={()=> _onPressDone()} style={styles.city}>
      <Text style={styles.cityText}>
        Done
      </Text>
    </TouchableOpacity>
  );
};
const renderCancel = () => {
  return (
    <TouchableOpacity onPress={()=> _onPressCancel()} style={styles.city}>
      <Text style={styles.cityText}>
       Cancel
      </Text>
    </TouchableOpacity>
  );
};

  return (
    <>
      <ProfileContext.Provider value={sports_values}>
        <ProfileSettings _editUserInfo={_editDisplay} signOut={_onPressSignOut}/>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isVisible}
          onRequestClose={() => {
            setIsVisible(!isVisible);
          }}>
          <View style = {{flex:1}}>
            <View style={styles.top}>
              {renderCancel()}
              {renderDone()}
            </View>
            <ScrollableTabView
              onChangeTab={({i, ref}) => setTabState(i)}
             style={{flex: 1}}>
              <PictureWall tabLabel="Edit Profile" />
              <ProfileView tabLabel="View Profile" />
            </ScrollableTabView>
          </View>
        </Modal>
      </ProfileContext.Provider>
    </>
  );
}
//<ScrollableTabView onChangeTab={({i, ref}) => setTabState(i)} style={{flex:1}}>
  //<PictureWall tabLabel="Edit Profile" />
  //<ProfileView tabLabel="View Profile" />
//</ScrollableTabView>
const styles2 = StyleSheet.create({
  scrollview: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
export { Profile }
