import axios from 'axios'
import { SB_APP_ID, TOKEN } from '../constants';

export const createGroupChannel = (userId1, userId2) => {
  const url = `https://api-${SB_APP_ID}.sendbird.com/v3/group_channels`;
  const form = {
    user_ids: [userId1, userId2],
    is_distinct: true,
    //strict: true,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(url, form, {
        headers: {
          "Content-Type": "application/json, charset=utf8",
          "Api-Token": TOKEN,
        },
      })
      .then((response) => {
        resolve(response)
        console.log("good to go");
      })
      .catch((err) => {
        reject();
      });
  });
};
export const getMatchedUserToken = (matchedUserId) => {
  const url = `https://api-${SB_APP_ID}.sendbird.com/v3/users/${matchedUserId}/push/apns`
  const request = {};
  return new Promise<string[]>((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json, charset=utf8",
          "Api-Token": TOKEN,
        },
      })
      .then((response) => {
        console.log("response is good")
        resolve(response["data"]["token"])
      })
      .catch((err) => {
        console.log("we have err")
        console.log(err)
        reject(null);
      });
  });
};
export const sendAdminMatchMessages = (
  channel_response,
  current_user_name,
  apns_matched_user_token,
  matched_id
) => {
  // only matches user gets notification, not the user matching. Only on message needed
  console.log(channel_response["data"]["channel_url"])
  const channel_url = channel_response["data"]["channel_url"]
  const url = `https://api-${SB_APP_ID}.sendbird.com/v3/group_channels/${channel_url}/messages`;
  const request = {
    user_id: matched_id,
    message_type: "MESG",
    message: "This chat will close in 14 days. Make sure you comply with terms of use while using the app.",
    send_push: true,
    push_message_template: {
      title: `you just matched with ${current_user_name}!`,
      body: `say hi and get started.`,
    },
    //apns_bundle_id: apns_matched_user_token,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(url, request, {
        headers: {
          "Content-Type": "application/json, charset=utf8",
          "Api-Token": TOKEN,
        },
      })
      .then((response) => {
        resolve(response)
        console.log(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const createUserSendbird = (userId1, first_name, issue_access_token) => {
  const url = `https://api-${SB_APP_ID}.sendbird.com/v3/users`
  const form = {
    user_id: userId1,
    nickname: first_name,
    issue_access_token: issue_access_token
  };
  return new Promise((resolve, reject) => {
    axios
      .post(url, form, {
        headers: {
          "Content-Type": "application/json, charset=utf8",
          "Api-Token": TOKEN,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        reject()
      });
  })
};
