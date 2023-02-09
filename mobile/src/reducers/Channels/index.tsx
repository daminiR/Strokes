import _ from 'lodash'
export const channelsReducer =  (state, action) => {
  switch (action.type) {
    case 'refresh': {
      console.log("dispatch", state.channels)
      return {
        ...state,
        channelMap: {},
        channels: [],
        loading: false,
        error: null,
      };
    }
    case 'fetch-channels': {
      const { channels } = action.payload || {};
      //const new_channels = channels.map((channel)=> {
        //const unixTime = channel.createdAt
        //// tesing with 1 day
        //const ChatTimer = 8.64e+7
        //// ideally 14 days
        ////const ChatTimer = 1.21e+9
         ////test with 1 hour
        ////const ChatTimer = 1.8e+6
        //if (Date.now() - unixTime > ChatTimer) {
          ////const params = {
            ////hidePreviousMessages: false,
            ////allowAutoUnhide: true,
          ////};
          //channel.hide()
          //.then(() => {
          //console.log("worked")
          //console.log(channel.isHidden)
          //return channel
          //})
          //.catch(err => console.log(err))
        //}
          //return channel
      //})
      console.log("channels to hide", channels.length)
      ////const new_channels = _.map(channelsToHide, (channel) => {
      ////})
      //const distinctChannels = new_channels.filter(channel => !state.channelMap[channel.url]);
      //const mergedChannels = [...state.channels, ...distinctChannels].sort((a, b) => {
        //const at = a.lastMessage ? a.lastMessage.createdAt : a.createdAt;
        //const bt = b.lastMessage ? b.lastMessage.createdAt : b.createdAt;
        //return bt - at;
      //});
      const channelMap = {};
      for (let i in channels) {
        const channel = channels[i];
        channelMap[channel.url] = true;
      }
      return {
        ...state,
        channelMap,
        channels: channels,
        empty: channels.length === 0 ? 'Start conversation.' : '',
      };
    }
    case 'join-channel':
    case 'update-channel': {
      const { channel } =   action.payload || {};
      return {
        ...state,
        channelMap: { ...state.channelMap, [channel.url]: true },
        channels: [channel, ...state.channels.filter(c => c.url !== channel.url)].sort((a, b) => {
          const at = a.lastMessage ? a.lastMessage.createdAt : a.createdAt;
          const bt = b.lastMessage ? b.lastMessage.createdAt : b.createdAt;
          return bt - at;
        }),
        empty: '',
      };
    }
    case 'leave-channel':
    case 'delete-channel': {
      const { channel } = action.payload || {};
      const slicedChannels = state.channels.filter(c => c.url !== channel.url);
      return {
        ...state,
        channelMap: { ...state.channelMap, [channel.url]: false },
        channels: slicedChannels,
        empty: slicedChannels.length === 0 ? 'Start conversation.' : '',
      };
    }
    case 'start-loading': {
      const { error = null } = action.payload || {};
      return { ...state, loading: true, error };
    }
    case 'end-loading': {
      const { error = null } = action.payload || {};
      return { ...state, loading: false, error };
    }
    case 'error': {
      const { error } = action.payload || {};
      return { ...state, error };
    }
  }
  return state;
};
