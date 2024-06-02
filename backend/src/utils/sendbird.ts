import axios from 'axios'
import 'dotenv/config'
import {
  apiToken,
  userAPI,
  groupChannelApi,
} from "./../services/sendbirdService";

export const createGroupChannel = async (userId1: string, userId2: string): Promise<any> => {
   const sb_token = process.env.SB_TOKEN as string;
    const sb_app_id = process.env.SB_APP_ID as string;
    const url = `https://api-${sb_app_id}.sendbird.com/v3/group_channels`;

    const form = JSON.stringify({
        user_ids: [userId1, userId2],
        is_distinct: true
    });

    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Api-Token": sb_token,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: form
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error ? data.error.message : "Failed to create group channel");
        }
        return data;
    } catch (error: any) {
        console.error("Error creating group channel:", error.message);
        throw error;
    }
};
export const getMatchedUserToken = (matchedUserId) => {
  const sb_token = process.env.SB_TOKEN as any
  const sb_app_id = process.env.SB_APP_ID as any
  const url = `https://api-${sb_app_id}.sendbird.com/v3/group_channels`;
  const request = {};
  return new Promise((resolve, reject) => {
    axios
      .post(url, request, {
        headers: {
          "Content-Type": "application/json, charset=utf8",
          "Api-Token": sb_token,
        },
      })
      .then((response) => {
        resolve(response["tokens"])
      })
      .catch((err) => {
        reject();
      });
  });
};
export const sendAdminMatchMessages = (
  channel_url,
  current_user_name,
  apns_matched_user_token
) => {
  // only matches user gets notification, not the user matching. Only on message needed
  const sb_token = process.env.SB_TOKEN as any;
  const sb_app_id = process.env.SB_APP_ID as any;
  const url = `https://api-${sb_app_id}.sendbird.com/v3/group_channels`;
  const request = {
    message_type: "MESG",
    message:
      "This chat will close in 14 days. Make sure you comply with terms of use while using the app.",
    send_push: true,
    push_message_template: {
      title: `you just matched with ${current_user_name}!`,
      body: `say hi and get started.`,
    },
    apns_bundle_id: apns_matched_user_token,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(url, request, {
        headers: {
          "Content-Type": "application/json, charset=utf8",
          "Api-Token": sb_token,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        reject();
      });
  });
};



export const hideChannel = async (channelUrl) => {
  let body = {
    channelUrl: channelUrl,
    //gcHideOrArchiveChannelData: {
      //channelUrl: channelUrl,
      ////userId: userId,
      //allowAutoUnhide: true,
      //shouldHideAll: true,
      //hidePreviousMessages: true,
    //},
  };
  try {
    const data = await groupChannelApi.gcHideOrArchiveChannel(apiToken, channelUrl);
    console.log("Channel hidden successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to hide channel:", error);
    throw error;
  }
};
export const createUserSendbird = (userId1, first_name, issue_access_token) => {
  const sb_token = process.env.SB_TOKEN as any
  const sb_app_id = process.env.SB_APP_ID as any
  const url = `https://api-${sb_app_id}.sendbird.com/v3/group_channels`;
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
          "Api-Token": sb_token,
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
