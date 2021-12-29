import React, { useEffect, useState, ReactElement } from 'react'
import { Text} from 'react-native'
import { cache, persist} from './cache'
import {AuthNavigator} from './UserContext'
import { from ,createHttpLink, ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import { FormProvider } from './Contexts/FormContext'
import {split} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities';
import {CachePersistor, persistCache, AsyncStorageWrapper} from 'apollo3-cache-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import  { createUploadLink } from 'apollo-upload-client';
import { enableFlipperApolloDevtools } from 'react-native-flipper-apollo-devtools'
import { WebSocketLink } from '@apollo/client/link/ws'
import { LogBox } from 'react-native'

//TODO: async funtion persist check later

const App = () =>
{
  const [client, setClient] = useState();
  const [persistor, setPersistor] = useState();
  const uri_upload = process.env.React_App_UriUploadRemote
  const uri_ws = process.env.React_App_WSlinkRemote
  useEffect(() => {
      //LogBox.ignoreLogs(['Warning: ...']);
      //LogBox.ignoreAllLogs();
    async function init() {
      console.log('getting fired up');
      let newPersistor = new CachePersistor({
        cache,
        storage: new AsyncStorageWrapper(AsyncStorage),
        trigger: 'write',
      });
      await newPersistor.restore();
      //setPersistor(newPersistor);
      //newPersistor.pause()
      //newPersistor.purge()
        console.log("uri", uri_upload)
        console.log("uri",uri_ws)
      const uploadLink = createUploadLink({
      uri: uri_upload,
      //uri: "http://169.254.63.0:4000/graphql"
        //uri: 'http://192.168.1.12:4000/graphql',
      });
      const wsLink = new WebSocketLink({
        //uri: 'ws://192.168.1.12:4000/graphql',
      uri: uri_ws,
        options: {
          reconnect: true,
        },
      });
      // The split function takes three parameters:
      //
      // * A function that's called for each operation to execute
      // * The Link to use for an operation if the function returns a "truthy" value
      // * The Link to use for an operation if the function returns a "falsy" value
      const splitLink = split(
        ({query}) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        uploadLink,
      );
      //const link = ApolloLink.from([onErrorLink, uploadLink]);
      //const uri = 'http://localhost:4000/graphql'
      var apolloClient = new ApolloClient({
        link: splitLink,
        cache: cache,
      });
      setClient(apolloClient);
    }
    init();
  }, []);
    if (!client) {
    console.log(' still no clinet');
    return <Text>Initializing app...</Text>;
    }

  //const renderInitial = () => {
    //if (ready) {
      //if (client) {
        //console.log(client)
        //console.log('client loaded?');
        //return (
          //<ApolloProvider client={client}>
            //<FormProvider>
              //<AuthNavigator />
            //</FormProvider>
          //</ApolloProvider>
        //);
      //} else {
        //return <ApolloErrorScreen isApolloConected={false} />;
      //}
    //}
  //};
  //client.resetStore()
  //client.resetStore()
  //just to reset cache for debugging
  //TODO: high : need to figure out where to place Form provider that doesnt contradict user auth
  //{ready && <AuthNavigator/>}
  //return renderInitial();
    //only in androik
  enableFlipperApolloDevtools(client)
  return (
          <ApolloProvider client={client}>
            <FormProvider>
              <AuthNavigator />
            </FormProvider>
          </ApolloProvider>
  );
}
export default App
