import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import _ from 'lodash'
import notifee from '@notifee/react-native';

const channelNameMaxMembers = 3;
const channelNameEllipsisLength = 32;
const maxUnreadMessageCount = 99;

export const createSendbirdChannel = async (matches, sendbird) => {
      _.map(matches, async (match) => {
        var userIds = [sendbird.currentUser.userId, match._id];
        // check if matchId channel already exists
        sendbird.GroupChannel.createChannelWithUserIds(userIds, true)
          .then(() => {
            console.log("all good");
          })
          .catch((err) => {
            console.log("errsb")
            console.log(err);

          });
        //true,
        //function (groupChannel, error) {
        //if (error) {
        //// Handle error.
        //console.log('SB_ERROR', error);
        //}
        //console.log('SB OPEN2', groupChannel);
        //},
        //);
      })
}
//export const hideOldChannels = (sendbird) => {
//}

export const connect = async (
  uid,
  nickname,
  dispatch,
  sendbird,
  setSendbird=null,
) => {
  dispatch({ type: "start-connection" });
  return await new Promise((resolve, reject) => {
    sendbird
    .connect(uid)
    .then((user) => {
      if (user.nickname !== nickname) {
        sendbird
          .updateCurrentUserInfo(nickname, "")
          .then((new_user) => {
            setSendbird(sendbird);
            dispatch({ type: "end-connection" });
            resolve(new_user)
            //start(user);
          })
          .catch((err) => {
            dispatch({ type: "end-connection" });
            console.log("Connect Error error ....", err);
            reject()
          });
      }
      else {
        setSendbird(sendbird);
        dispatch({ type: "end-connection" });
        resolve(user)
      }
    })
    .catch((err) => {
      dispatch({ type: "end-connection" });
      console.log("Connect Error error ....", err);
      reject()
    });
  })
  //}
};

export const ellipsis = (s, len) => {
  return s.length > len ? s.substring(0, len) + '..' : s;
};
export const createChannelName = (channel, currentUserID)=> {
  if (channel.name === 'Group Channel' || channel.name.length === 0) {
    console.log("how many channels", channel)
    const nicknames = [_.filter(channel.members, (member) => {
              return member.userId !== currentUserID;
    })[0]?.nickname]
    if (nicknames.length > channelNameMaxMembers) {
      return ellipsis(
        `${nicknames.slice(0, channelNameMaxMembers + 1).join(', ')} and ${
          nicknames.length - channelNameMaxMembers
        } others`,
        channelNameEllipsisLength,
      );
    } else {
      return ellipsis(`${nicknames.join(', ')}`, channelNameEllipsisLength);
    }
  }
  return ellipsis(channel.name, channelNameEllipsisLength);
};
export const createUnreadMessageCount = channel => {
  if (channel.unreadMessageCount > maxUnreadMessageCount) {
    return `${maxUnreadMessageCount}+`;
  } else {
    return `${channel.unreadMessageCount}`;
  }
};
export const onRemoteMessage = async remoteMessage => {
  // Set the channel for Android
  const channelId = await notifee.createChannel({
    id: 'SendbirdNotificationChannel',
    name: 'Sendbird RN Sample',
  });

  if (remoteMessage && remoteMessage.data) {
    let pushActionId = 'SendbirdNotification-';

    // Set the notification push action id from channel url
    const message = JSON.parse(remoteMessage.data.sendbird);
    let channelUrl = null;
    if (message && message.channel) {
      channelUrl = message.channel.channel_url;
    }
    pushActionId += channelUrl;

    await AsyncStorage.setItem(pushActionId, JSON.stringify(remoteMessage));

    // Display a notification
    await notifee.displayNotification({
      title: 'Sendbird Sample',
      body: remoteMessage.data.message,
      android: {
        channelId,
        pressAction: {
          id: pushActionId,
          launchActivity: 'default',
        },
      },
    });
  }
};

export const handleNotificationAction = async (navigation, sendbird, currentUser) => {
  // Move to channel from pushed notification
  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification && initialNotification.pressAction) {
    const remoteMessage = JSON.parse(await AsyncStorage.getItem(initialNotification.pressAction.id));
    if (remoteMessage && remoteMessage.data) {
      const message = JSON.parse(remoteMessage.data.sendbird);
      if (message && message.channel) {
        const channel = await sendbird.GroupChannel.getChannel(message.channel.channel_url);
        navigation.dispatch(state => {
          const lobbyIndex = state.routes.findIndex(route => route.name === 'Lobby');
          const newRoute = { name: 'Chat', params: { channel, currentUser } };
          const routes = [...state.routes.slice(0, lobbyIndex + 1), newRoute];
          const action = CommonActions.reset({ ...state, routes, index: routes.length - 1 });

          const chatRoute = state.routes.find(route => route.name === 'Chat');
          if (chatRoute && chatRoute.params && chatRoute.params.channel) {
            if (chatRoute.params.channel.url === channel.url) {
              // Navigate from same channel
              return CommonActions.reset(state);
            } else {
              // Navigate from another channel
              return action;
            }
          } else {
            // Navigate from Lobby
            return action;
          }
        });
        await AsyncStorage.removeItem(initialNotification.pressAction.id);
      }
    }
  }
};
