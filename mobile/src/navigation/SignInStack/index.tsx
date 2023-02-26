import React, { useCallback, useReducer, useEffect, useState, useLayoutEffect, useContext} from 'react';
import {createStackNavigator } from '@react-navigation/stack'
import {  useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Image, Text, TouchableOpacity, View, Platform } from 'react-native';
import {ActiveChat, Profile, Chat, Match, Likes, Login, Channels} from '@screens'
import {SendBirdChat} from '../../screens/Authenticator/SendBirdChat'
import Lobby from '../../screens/Authenticator/Lobby'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {tabBarSize} from '@constants'
import {Icon} from 'react-native-elements'
import { HeaderBackButton } from '@react-navigation/elements'
import {UserContext} from '@UserContext'
import {connect} from '../../utils/SendBird'
import notifee, { AndroidImportance } from '@notifee/react-native';

import { loginReducer } from '../../reducers/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import { withAppContext } from '../../AppContext';
import { handleNotificationAction } from '../../utils/SendBird';

const ProfileStack = createStackNavigator()
const ChatStack = createStackNavigator()
const Tab  = createBottomTabNavigator()

export type RootStackSignInParamList = {
  PROFILE: {data: number}
  EDIT_SPORTS: undefined
  EDIT_DESCRIPTION: undefined
  ACTIVE_CHAT: undefined
  MATCH: undefined
  FIRST_NAME: undefined
  AGE: undefined
  LAST_NAME: undefined
  GENDER: undefined
  LIKES: undefined
  LOBBY: undefined
  LOGIN: undefined
  CHAT: undefined
  SBCHAT: undefined
}
 const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator initialRouteName="PROFILE">
      <ProfileStack.Screen options={{headerShown:false}} name="PROFILE" component={Profile} />
    </ProfileStack.Navigator>
  );
}
 const ChatStackScreen = ({ route }) => {
   const token = route.params;
   console.log("token in chat", token);
   const [state, dispatch] = useReducer(loginReducer, {
     userId: "",
     nickname: "",
     error: "",
     connecting: false,
   });
   const { data, sendbird, setSendbird } = useContext(UserContext);
   const [initialized, setInitialized] = useState(false);
   const [currentUser, setCurrentUser] = useState(null);
   //useEffect(() => {
   //messaging().setBackgroundMessageHandler(async (message) => {
   //const isSendbirdNotification = Boolean(message.data.sendbird);
   //if(!isSendbirdNotification) return;

   //const text = message.data.message;
   //const payload = JSON.parse(message.data.sendbird);

   //// The following is required for compatibility with Android 8.0 (API level 26)
   //// and higher. Refer to Notifee's reference page for more information.
   //const channelId = await notifee.createChannel({
   //id: '1234',
   //name: 'trial_channel',
   //importance: AndroidImportance.HIGH
   //});

   //await notifee.displayNotification({
   //id: message.messageId,
   //title: 'New message has arrived!',
   //subtitle: `Number of unread messages: ${payload.unread_message_count}`,
   //body: payload.message,
   //data: payload,
   //android: {
   //channelId,
   ////smallIcon: NOTIFICATION_ICON_RESOURCE_ID,
   //importance: AndroidImportance.HIGH,
   //},
   //ios: {
   //foregroundPresentationOptions: {
   //alert: true,
   //badge: true,
   //sound: true,
   //},
   //},
   //});
   //})

   //}, []);
   useFocusEffect(
     useCallback(() => {
       connect(
         data.squash._id,
         data.squash.first_name,
         dispatch,
         sendbird,
         setSendbird,
         setCurrentUser,
         token
       );
       return () => {
         sendbird.disconnect();
       };
     }, [])
   );
   const logout = async () => {
     sendbird.disconnect();
     setCurrentUser(null);
   };

   return (
     currentUser && (
       <ChatStack.Navigator>
         <ProfileStack.Screen
           options={{ headerShown: false }}
           name="CHANNELS"
           component={Channels}
           initialParams={{ currentUser }}
         />
         <ProfileStack.Screen
           options={{ headerShown: false }}
           name="SBCHAT"
           component={SendBirdChat}
         />
         <ProfileStack.Screen
           options={{ headerShown: true }}
           name="ACTIVE_CHAT"
           component={ActiveChat}
         />
       </ChatStack.Navigator>
     )
   );
 };
const customTabBarStyle = {
  showLabel: false,
  inactiveTintColor: "gray",
  style: {
    backgroundColor: "#2b1d08",
    height: Platform.OS === "ios" ? 100 : 60,
  },
  labelStyle: {
    color: "#242424",
    fontFamily: "OpenSans-Regular",
    //fontSize: 10,
  },
};
const MatchStackScreen = () => {
  const [token, setToken] = useState(null);
  const {data, sendbird, setSendbird} = useContext(UserContext);
  const login = async () => {
    //try {
    //setCurrentUser(user);
    const authorizationStatus = await messaging().requestPermission();
    if (
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      if (Platform.OS === "ios") {
        const token = await messaging().getAPNSToken();
        sendbird.registerAPNSPushTokenForCurrentUser(token);
      } else {
        const token = await messaging().getToken();
        setToken(token)
        sendbird.registerGCMPushTokenForCurrentUser(token)
      }
    }
    //} catch (err) {
    //console.log("did we get token or not")
    //console.error(err);
    //}
  };
  const start = () => {
    if (login) {
      login();
    }
  };
  useEffect(() => {
    start();
    return () => {};
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let iconName;
            switch (route.name) {
              case "Match":
                iconName = focused ? "home" : "home";
                break;
              case "Profile":
                iconName = focused ? "person-outline" : "person-outline";
                break;
              case "Chat":
                iconName = focused
                  ? "chat-bubble-outline"
                  : "chat-bubble-outline";
                break;
              case "Likes":
                iconName = focused ? "favorite-border" : "favorite-border";
                break;
            }
            // You can return any component that you like here!
            return (
              <Icon
                name={iconName}
                type="material"
                size={20}
                color={"#ff7f02"}
              />
            );
          },
          tabBarInactiveTintColor: "gray",
          tabBarStyle: customTabBarStyle.style,
          tabBarShowLabel: false,
        })}
        initialRouteName="Match"
      >
        <Tab.Screen
          options={{ headerShown: false }}
          name="Profile"
          component={ProfileStackScreen}
        />
        <Tab.Screen
          options={{ headerShown: false }}
          name="Match"
          component={Match}
        />
        {token && (
          <Tab.Screen
            options={{ headerShown: false }}
            name="Chat"
            component={ChatStackScreen}
            initialParams={{ token: token }}
          />
        )}
        <Tab.Screen
          options={{ headerShown: false }}
          name="Likes"
          component={Likes}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};


export {MatchStackScreen, ChatStackScreen, ProfileStackScreen}
