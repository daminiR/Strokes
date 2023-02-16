import React, {useEffect, useContext, useReducer, useState} from 'react';
//import { HiddenChannelFilter } from '@sendbird/chat/groupChannel';
import _ from 'lodash'
import {
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  View,
  FlatList,
  RefreshControl,
  AppState,
} from 'react-native';

import {UserContext} from '@UserContext'
import { channelsReducer } from '../../../reducers/Channels';
import Channel from '../../../components/Channels';
import { handleNotificationAction } from '../../../utils/SendBird';
import {createSendbirdChannel} from '@utils'

const Channels = props => {
  const { route, navigation} = props;
  const {currentUser} = route.params
  const {data: currentUserData, sendbird, setSendbird} = useContext(UserContext)
  const [query, setQuery] = useState(null);
  const [state, dispatch] = useReducer(channelsReducer, {
    sendbird,
    currentUser,
    matches: [],
    channels: [],
    channelMap: {},
    loading: false,
    empty: '',
    error: null,
  });
  // on state change
  useEffect(() => {
    sendbird.addConnectionHandler('channels', connectionHandler);
    sendbird.addChannelHandler('channels', channelHandler);
    //const unsubscribe = AppState.addEventListener('change', handleStateChange);
    if (!sendbird.currentUser) {
      sendbird.connect(currentUser.userId, (err, _) => {
        if (!err) {
          refresh();
        } else {
          dispatch({
            type: 'end-loading',
            payload: {
              error: 'Connection failed. Please check the network status.',
            },
          });
        }
      });
    } else {
      refresh();
    }
    return () => {
      console.log("sbError channel error")
      dispatch({ type: 'end-loading' });
      sendbird.removeConnectionHandler('channels');
      sendbird.removeChannelHandler('channels');
      //unsubscribe.remove();
    };
  }, []);

  useEffect(() => {
    console.log("channesError route params change")
    if (route.params && route.params.action) {
      const { action, data } = route.params;
      switch (action) {
        case 'leave':
          data.channel.leave(err => {
            if (err) {
              dispatch({
                type: 'error',
                payload: {
                  error: 'Failed to leave the channel.',
                },
              });
            }
          });
          break;
      }
    }
  }, [route.params]);

  useEffect(() => {
    if (query) {
      next();
    }
  }, [query]);
  /// on connection event
  const connectionHandler = new sendbird.ConnectionHandler();
  connectionHandler.onReconnectStarted = () => {
    dispatch({
      type: 'error',
      payload: {
        error: 'Connecting..',
      },
    });
  };
  connectionHandler.onReconnectSucceeded = () => {
    dispatch({ type: 'error', payload: { error: null } });
    refresh();
    handleNotificationAction(navigation, sendbird, currentUser, 'channels').catch(err => console.error(err));
  };
  connectionHandler.onReconnectFailed = () => {
    dispatch({
      type: 'error',
      payload: {
        error: 'Connection failed. Please check the network status.',
      },
    });
  };

  // now that we have connection add all matches channels
  /// on channel event
  const channelHandler = new sendbird.ChannelHandler();
  channelHandler.onUserJoined = (channel, user) => {
    if (user.userId === sendbird.currentUser.userId) {
      dispatch({ type: 'join-channel', payload: { channel } });
    }
  };
  channelHandler.onUserLeft = (channel, user) => {
    if (user.userId === sendbird.currentUser.userId) {
      dispatch({ type: 'leave-channel', payload: { channel } });
    }
  };
  channelHandler.onChannelChanged = channel => {
    dispatch({ type: 'update-channel', payload: { channel } });
  };
  channelHandler.onChannelDeleted = channel => {
    dispatch({ type: 'delete-channel', payload: { channel } });
  };

  const handleStateChange = newState => {
    if (newState === 'active') {
      sendbird.setForegroundState();
    } else {
      sendbird.setBackgroundState();
    }
  };
  const chat = (channel) => {
    const other_user = _.filter(channel.members, (member)=> {return member.userId !== currentUser.userId})
    const other_id = other_user[0].userId
    const profileViewDataList = _.filter(currentUserData.squash.matches, (match)  => {return match._id === other_id})

    if (profileViewDataList.length === 0) {
      console.log("user doesnt exist anymore")
    } else {

      navigation.navigate('ACTIVE_CHAT', {
        currentUserID: currentUser.sub,
        channel: channel,
        currentUser: currentUser,
        profileViewData: profileViewDataList[0],
      });
    }
  };
  const refresh = () => {
    const matches = currentUserData.squash.matches
    createSendbirdChannel(matches, sendbird, currentUser)
    const params = {
      includeEmpty: true,
      //hiddenChannelFilter: "hidden_prevent_auto_unhide",
      hiddenChannelFilter: "unhidden_only",
    };
    var q = sendbird.GroupChannel.createMyGroupChannelListQuery()
      q.limit = 10;
      q.show_empty = true
      q.includeEmpty = true
      //q.hiddenChannelFilter ="hidden_prevent_auto_unhide"
      q.hiddenChannelFilter ="unhidden_only"
    setQuery(q);
    dispatch({ type: 'refresh' });
  };
  const next = () => {
    if (query.hasNext) {
      dispatch({ type: 'start-loading' });
      query.limit = 10;
      query.show_empty = true
      query.includeEmpty = true
      query.hiddenChannelFilter ="unhidden_only"
      query.next((err, fetchedChannels) => {
        const matches_id = _.map(currentUserData.squash.matches, match => {return match._id})
        //console.log("matches id debud chennell fetched:", fetchedChannels);
        //if (fetchedChannels) {
           //const notArchivedChannels = fetchedChannels.filter((channel) => {
            //console.log("matches id debud chennell:", channel);
            //const member = _.filter(channel.members, (member) => {
              //return member.userId !== currentUser.userId;
            //});
            //if (member?.userId) {
              //console.log("matches id debud sb:", matches_id);
              //console.log("matches id debud sb memebr id:", member);
              //return _.includes(matches_id, member[0].userId);
            //} else {
              //false;
            //}
          //});
        //console.log("matches id debud chennell fetched:", fetchedChannels);
        //}
        dispatch({ type: "end-loading" });
        if (!err) {
          dispatch({
            type: "fetch-channels",
            payload: { channels: fetchedChannels , matches: matches_id, currentUser: currentUser},
          });
        } else {
          dispatch({
            type: "error",
            payload: {
              error: "Failed to get the channels.",
            },
          });
        }
        //refresh()
      });
    }
  };
  return (
    <>
      <StatusBar backgroundColor="#742ddd" barStyle="light-content" />
      <SafeAreaView style={style.container}>
        <FlatList
          data={state.channels}
          renderItem={({ item }) => <Channel key={item.url} sendbird={sendbird} channel={item} onPress={channel => chat(channel)} />}
          keyExtractor={item => item.url}
          refreshControl={
            <RefreshControl refreshing={state.loading} colors={['#742ddd']} tintColor={'#742ddd'} onRefresh={refresh} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
          ListHeaderComponent={
            state.error && (
              <View style={style.errorContainer}>
                <Text style={style.error}>{state.error}</Text>
              </View>
            )
          }
          ListEmptyComponent={
            <View style={style.emptyContainer}>
              <Text style={style.empty}>{state.empty}</Text>
            </View>
          }
          onEndReached={() => next()}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    </>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  loading: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 24,
    color: '#999',
    alignSelf: 'center',
  },
})

export  {Channels}
