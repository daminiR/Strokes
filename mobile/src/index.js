import React, { createContext, useEffect, useState } from 'react'
import { Text } from 'react-native'
import { cache } from './cache'
import {AuthNavigator} from '@screens'
import {ApolloClient, ApolloProvider} from '@apollo/client'
import { FormProvider } from './Contexts/FormContext'
import {CachePersistor, AsyncStorageWrapper} from 'apollo3-cache-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import  { createUploadLink } from 'apollo-upload-client';
import { enableFlipperApolloDevtools } from 'react-native-flipper-apollo-devtools'
import { setContext } from '@apollo/client/link/context'
import { LogBox } from 'react-native'
import SendBird from 'sendbird'
import { AppContainer } from '@components'
import auth from '@react-native-firebase/auth'

//TODO: async funtion persist check later

export const RootRefreshContext = createContext(null);
const appId = process.env.React_App_SendBird
const sendbird = new SendBird({ appId });
sendbird.setErrorFirstCallback(true);
const App = () =>
{
  const [client, setClient] = useState();
  const [persistor, setPersistor] = useState();
  const [loadingSignUpInRefresh, setLoadingSignUInRefresh] = useState(false);
  const uri_upload = process.env.React_App_UriUploadRemote
  console.log("uri currently", uri_upload)
  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreAllLogs();
    async function init() {
      console.log('getting fired up');
      let newPersistor = new CachePersistor({
        cache,
        storage: new AsyncStorageWrapper(AsyncStorage),
        trigger: 'write',
      });
      await newPersistor.restore();
      setPersistor(newPersistor);
      //newPersistor.pause();
      //newPersistor.purge();
      const uploadLink = createUploadLink({
        uri: uri_upload,
      });
      const user =  await auth().currentUser
      console.log("logged user", user)
      var token = null
      if (user) {
        token = await auth().currentUser.getIdToken(true);
        console.log("whats the token here", token)
      }
      console.log("logged user token", token)
      const authLink = setContext((_, {headers}) => {
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      });
      var apolloClient = new ApolloClient({
        link: authLink.concat(uploadLink),
        //link: uploadLink,
        cache: cache,
      });
      setClient(apolloClient);
    }
    init();
  }, [loadingSignUpInRefresh]);
  const rootRefreshValues = {
    setLoadingSignUInRefresh: setLoadingSignUInRefresh,
  }
  const renderAuth = () => {
    return (
      <AppContainer loading={loadingSignUpInRefresh}>
        <RootRefreshContext.Provider value={rootRefreshValues}>
          <AuthNavigator sendbird={sendbird}/>
        </RootRefreshContext.Provider>
      </AppContainer>
    );
  };
    if (!client) {
      // TODO : MAKE FANCY loadin gwhile app is intiializing// som eanimatioin preferable
    console.log(' still no clinet');
    return <Text>Initializing app...</Text>;
    }
    if (client) {
      console.log('clinet found');
      return (
          <ApolloProvider client={client}>
            <FormProvider>{renderAuth()}</FormProvider>
          </ApolloProvider>
      );
    }
  //client.resetStore()
  //client.resetStore()
  //just to reset cache for debugging
  //TODO: high : need to figure out where to place Form provider that doesnt contradict user auth
  //{ready && <AuthNavigator/>}
  //return renderInitial();
    //only in androik
  enableFlipperApolloDevtools(client)
  //return (
    //<ApolloProvider client={client}>
      //<FormProvider>
        //{<AuthNavigator />}
      //</FormProvider>
    //</ApolloProvider>
  //);
}
export default App
