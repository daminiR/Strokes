import React, { useCallback, useReducer, useEffect, useState, useLayoutEffect, useContext} from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View, Platform } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { loginReducer } from '../../../reducers/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  useFocusEffect } from '@react-navigation/native'
import messaging from '@react-native-firebase/messaging';
import {connect} from '../../../utils/SendBird'

import { withAppContext } from '../../../AppContext';
import {Login, Channels} from '@screens';
import {UserContext} from '@UserContext'
import { handleNotificationAction } from '../../../utils/SendBird';

const Lobby = props => {
  const [state, dispatch] = useReducer(loginReducer, {
    userId: '',
    nickname: '',
    error: '',
    connecting: false,
  });
  const {navigation} = props;
  const {data, sendbird} = useContext(UserContext);
  const [initialized, setInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const start = (user) => {
    if (login) {
      login(user);
    }
  };
    //useCallback(() => {
      //useFocusEffect(
      //const val = navigation.state
      //console.log("connect status: on chat", val)
      ////connect(data.squash._id, data.squash.first_name, dispatch, sendbird, start);
      //return () => {
        ////logout()
      //console.log("connect status: not on chat")
        ////unsubscribe()
      //}
    //}, [])
  //);

  useEffect(() => {
    console.log(" connect status: we did login")
    connect(data.squash._id, data.squash.first_name, dispatch, sendbird, start);
    return () => {
      //console.log("connect status: did we logout")
      //logout();
    };
},


  []);
  useLayoutEffect(() => {
    const title = currentUser ? (
      <View style={style.headerLeftContainer}></View>
    ) : null;
    //<Text style={style.headerTitle}>Channels</Text>

    const right = currentUser ? (
      <View style={style.headerRightContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={style.profileButton}
          onPress={startChat}>
          <Icon name="chat" color="#fff" size={28} />
        </TouchableOpacity>
      </View>
    ) : null;

    navigation.setOptions({
      headerShown: !!currentUser,
      headerTitle: () => title,
      headerRight: () => right,
    });
  }, [currentUser]);

  const login = async (user) => {
    try {
      setCurrentUser(user);
      const authorizationStatus = await messaging().requestPermission();
      if (
        authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        if (Platform.OS === 'ios') {
          const token = await messaging().getAPNSToken();
          sendbird.registerAPNSPushTokenForCurrentUser(token);
        } else {
          const token = await messaging().getToken();
          sendbird.registerGCMPushTokenForCurrentUser(token);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    sendbird.disconnect();
    setCurrentUser(null);
  };

  const startChat = () => {
    if (currentUser) {
      navigation.navigate('Invite', {currentUser});
    }
  };
  const profile = () => {
    if (currentUser) {
      navigation.navigate('Profile', {currentUser});
    }
  };

  return (
    <>
      {currentUser && (
        <Channels {...props} sendbird={sendbird} currentUser={currentUser} />
      )}
    </>
  );
};

const style = StyleSheet.create({
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
  },
  logo: {
    width: 32,
    height: 32,
  },
  profileButton: {
    marginLeft: 10,
  },
})

export default withAppContext(Lobby);
