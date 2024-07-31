//import {fetch} from 'node-fetch'; // Import fetch if you're in Node.js

/**
 * Hides a group channel in Sendbird.
 * @param {string} appId Your Sendbird application ID.
 * @param {string} channelUrl The unique URL of the channel to hide.
 * @param {string} apiToken Your Sendbird API token.
 * @param {string} userId The user ID of the user making the request.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const apiToken = process.env.SB_TOKEN2 as string; // Your SendBird API token
const appId = process.env.SENDBIRD_APP_ID as string; // Your SendBird App ID

export const userExists = async (userId: string): Promise<boolean> => {
  const url = `https://api-${appId}.sendbird.com/v3/users/${userId}`;
  const headers = {
    "Content-Type": "application/json",
    "Api-Token": apiToken,
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (response.status === 200) {
      return true; // User exists
    } else if (response.status === 404) {
      return false; // User does not exist
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to check user existence:", error);
    return false;
  }
};

export const createChannel = async (
  userIds: string[],
  name: string,
  isDistinct: boolean = true
): Promise<string> => {
  const url = `https://api-${appId}.sendbird.com/v3/group_channels`;
  const headers = {
    "Content-Type": "application/json",
    "Api-Token": apiToken,
  };
  const body = JSON.stringify({
    name: name,
    user_ids: userIds,
    is_distinct: isDistinct,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Channel created successfully:", responseData.channel_url);
    return responseData.channel_url;
  } catch (error) {
    console.error("Failed to create channel:", error);
    throw error;
  }
};

export const createSendbirdUser = async (
  userId: string,
  nickname: string,
  profile_url: string
) => {
  const url = `https://api-${appId}.sendbird.com/v3/users`;
  const headers = {
    "Content-Type": "application/json",
    "Api-Token": apiToken,
  };
  const body = JSON.stringify({
    user_id: userId,
    nickname: nickname,
    profile_url: profile_url, // Optional: URL to the user's profile picture
    issue_access_token: true,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("User created successfully.");
    const responseData = await response.json(); // Assuming the API returns JSON
    console.log(responseData.access_token);
    return responseData.access_token;
  } catch (error) {
    console.error("Failed to create sendbirduser:", error);
    throw error;
  }
};


export const hideSendbirdChannel = async (channelUrl) => {
    const url = `https://api-${appId}.sendbird.com/v3/group_channels/${channelUrl}/hide`;
    const headers = {
        "Content-Type": "application/json",
        "Api-Token": apiToken
    };
    const body = JSON.stringify({
        user_id: {},  // Necessary if the API requires identifying the user making the change
        should_hide_all: true  // Set to true to hide the channel for all members
    });

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Channel hidden successfully.");
        const responseData = await response.json();  // Assuming the API returns JSON
        console.log(responseData);
    } catch (error) {
        console.error("Failed to hide the channel:", error);
    }
}

