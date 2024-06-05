//import {fetch} from 'node-fetch'; // Import fetch if you're in Node.js

/**
 * Hides a group channel in Sendbird.
 * @param {string} appId Your Sendbird application ID.
 * @param {string} channelUrl The unique URL of the channel to hide.
 * @param {string} apiToken Your Sendbird API token.
 * @param {string} userId The user ID of the user making the request.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const apiToken = process.env.SB_TOKEN as string; // Your SendBird API token
const appId = process.env.SENDBIRD_APP_ID as string; // Your SendBird App ID

export const createSendbirdUser = async (userId: string, nickname: string, profile_url: string) => {
    const url = `https://api-${appId}.sendbird.com/v3/users`;
    const headers = {
        "Content-Type": "application/json",
        "Api-Token": apiToken
    };
    const body = JSON.stringify({
        user_id: userId,
        nickname: nickname,
        profile_url: profile_url,  // Optional: URL to the user's profile picture
        issue_access_token: false  // Optional: Set to true if you want Sendbird to return an access token for the user
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("User created successfully.");
        const responseData = await response.json();  // Assuming the API returns JSON
        console.log(responseData);
    } catch (error) {
      console.error("Failed to create the user:", error);
    }
}


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

