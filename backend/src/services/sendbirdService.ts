import * as sendbird from 'sendbird-platform-sdk-typescript';

const apiToken = process.env.SENDBIRD_API_TOKEN as string; // Your SendBird API token
const appId = process.env.SENDBIRD_APP_ID as string; // Your SendBird App ID
const serverConfig = new sendbird.ServerConfiguration("https://api-{app_id}.sendbird.com", { "app_id": appId })
const configuration = sendbird.createConfiguration({ baseServer : serverConfig });
const userAPI = new sendbird.UserApi(configuration);
const groupChannelApi = new sendbird.GroupChannelApi(configuration);

export { userAPI, groupChannelApi };

