import React, { createContext, useEffect, useState } from 'react'
import {Text} from 'react-native';
import {getAWSUser} from '@utils';
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

//TODO: async funtion persist check later

export const RootRefreshContext = createContext(null);
const appId = process.env.React_App_SendBird
const sendbird = new SendBird({ appId });
sendbird.setErrorFirstCallback(true);
const App = () =>
{
  const [client, setClient] = useState();
  const [persistor, setPersistor] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingSignUpInRefresh, setLoadingSignUInRefresh] = useState(false);
  const [loadingApp, setLoadingApp ] = useState(false)
  const uri_upload = process.env.React_App_UriUploadRemote
  useEffect(() => {
    setLoadingApp(true)
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
      var token = null;
      var idToken = null;
      getAWSUser()
        .then((args) => {
          if (args) {
            token = args.session.getAccessToken().getJwtToken();
            idToken = args.session.getIdToken().getJwtToken();
            setCurrentUser(args.attributes);
          }
          else {
            setCurrentUser(null);
          }
          ///// when and if user is found
          const authLink = setContext((_, {headers}) => {
            return {
              headers: {
                ...headers,
                authorization: idToken ? `Bearer ${idToken}` : '',
              },
            };
          });
          var apolloClient = new ApolloClient({
            link: authLink.concat(uploadLink),
            cache: cache,
          });
          setClient(apolloClient);
          setLoadingApp(false)
        })
        .catch((err) => {
          console.log('getAWS Error');
          console.log(err);
          // if user not found
          const authLink = setContext((_, {headers}) => {
            return {
              headers: {
                ...headers,
                authorization: idToken ? `Bearer ${idToken}` : '',
              },
            };
          });
          var apolloClient = new ApolloClient({
            link: authLink.concat(uploadLink),
            cache: cache,
          });
          AsyncStorage.clear();
          setClient(apolloClient);
          setLoadingApp(false)
        });
    }
    init();
  }, [loadingSignUpInRefresh]);

  const rootRefreshValues = {
    setLoadingSignUInRefresh: setLoadingSignUInRefresh,
    setClient: setClient
  }
  const renderAuth = () => {
    return (
      <AppContainer loading={loadingSignUpInRefresh || loadingApp}>
        <RootRefreshContext.Provider value={rootRefreshValues}>
            <AuthNavigator sendbird={sendbird} currentUser={currentUser}/>
        </RootRefreshContext.Provider>
      </AppContainer>
    );
  };
    if (!client) {
    return <Text>Initializing app...</Text>;
    }
    if (client) {
      return (
          <ApolloProvider client={client}>
            <FormProvider>{renderAuth()}</FormProvider>
          </ApolloProvider>
      );
    }
  //client.resetStore()
  //client.resetStore()
  //just to reset cache for debugging
  enableFlipperApolloDevtools(client)
}
export default App
