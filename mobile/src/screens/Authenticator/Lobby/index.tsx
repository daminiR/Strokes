import React, { useEffect, useState, useLayoutEffect, useContext} from 'react';
import { Image, Text, TouchableOpacity, View, Platform } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import { withAppContext } from '../../../AppContext';
import {Login, Channels} from '@screens';
import {UserContext} from '@UserContext'
import { handleNotificationAction } from '../../../utils/SendBird';

const Lobby = props => {
  const { navigation } = props;
  const {sendbird} = useContext(UserContext)
  const [initialized, setInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const savedUserKey = 'savedUser';
  //await AsyncStorage.removeItem('savedUser')

  useLayoutEffect(() => {
    const title = currentUser ? (
      <View style={style.headerLeftContainer}>
      </View>
    ) : null;
    //<Text style={style.headerTitle}>Channels</Text>

    const right = currentUser ? (
      <View style={style.headerRightContainer}>
        <TouchableOpacity activeOpacity={0.85} style={style.profileButton} onPress={startChat}>
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

  useEffect(() => {
    AsyncStorage.getItem(savedUserKey)
      .then(user => {
        if (user) {
          setCurrentUser(JSON.parse(user));
        }
        setInitialized(true);
        return handleNotificationAction(navigation, sendbird, currentUser, 'lobby');
      })
      .catch(err => console.error(err));
  }, []);

  const login = user => {
    AsyncStorage.setItem(savedUserKey, JSON.stringify(user))
      .then(async () => {
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
      })
      .catch(err => console.error(err));
  };

  const logout = async () => {
    await AsyncStorage.removeItem(savedUserKey);
    sendbird.disconnect();
    setCurrentUser(null);
  };

  const startChat = () => {
    if (currentUser) {
      navigation.navigate('Invite', { currentUser });
    }
  };
  const profile = () => {
    if (currentUser) {
      navigation.navigate('Profile', { currentUser });
    }
  };

  return (
    <>
      {initialized ? (
        currentUser ? (
          <Channels {...props} sendbird={sendbird} currentUser={currentUser} />
        ) : (
          <Login {...props} sendbird={sendbird} onLogin={login} />
        )
      ) : (
        <View />
      )}
    </>
  );
};

const style = {
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
};

export default withAppContext(Lobby);
