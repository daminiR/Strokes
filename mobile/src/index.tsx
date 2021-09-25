import React, { useEffect, useState, ReactElement } from 'react'
import { Text} from 'react-native'
import { cache, persist} from './cache'
import {AuthNavigator} from './UserContext'
import { from ,createHttpLink, ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import { ApolloLink } from 'apollo-link'
import firebase from '@react-native-firebase/storage'
import { HttpLink } from 'apollo-link-http'
import { onError } from "apollo-link-error"
import { FormProvider } from './Contexts/FormContext'
import {makeVar, NormalizedCacheObject} from '@apollo/client'
import {CachePersistor, persistCache, AsyncStorageWrapper} from 'apollo3-cache-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {onErrorLink} from './globalGraphqlErrors'
import {isProfileCompleteVar} from './cache'
import  { createUploadLink } from 'apollo-upload-client';

//////////////////////////////////////// temporary fixe for RN debugger ///////////////////////////////////////
global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
global.FormData = global.originalFormData || global.FormData;

if (window.FETCH_SUPPORT) {
  window.FETCH_SUPPORT.blob = false;
} else {
  global.Blob = global.originalBlob || global.Blob;
  global.FileReader = global.originalFileReader || global.FileReader;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//TODO: async funtion persist check later
const App = (): ReactElement =>
{
 const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
 const [ready, setReady] = useState(false)
 const [persistor, setPersistor] = useState<CachePersistor<NormalizedCacheObject>>();
 useEffect(() => {
    async function init() {
      console.log("getting fired up")
      let newPersistor = new CachePersistor({
        cache,
        storage: new AsyncStorageWrapper(AsyncStorage),
        trigger: 'write',
      });
      //const prevIsComplete = await AsyncStorage.getItem('isProfileComplete')
      //isProfileCompleteVar(JSON.parse(prevIsComplete))
      await newPersistor.restore();
      //setPersistor(newPersistor);
      //newPersistor.pause()
      //newPersistor.purge()
      const myHtttpLink  = new HttpLink({
      uri: 'http://192.168.1.12:4000/graphql',
        //uri : 'http://localhost:4000/graphql'
      });
      //const uploadLink = createUploadLink({ uri: 'http://10.0.2.2:3000/graphql', })
        //const uploadLink = createUploadLink({ uri: 'http://192.168.1.8:4000/graphql', })
        //const uploadLink = createUploadLink({ uri:'http://192.168.1.12:4000/graphql'})
        //const uploadLink = createUploadLink({uri: 'http://localhost:4000/graphql'})
        const uploadLink = createUploadLink({uri: 'http://10.0.2.2:4000/graphql'})


      //const link = ApolloLink.from([onErrorLink, uploadLink]);
      //const uri = 'http://localhost:4000/graphql'
      setClient(
        new ApolloClient({
          //uri: 'http:localhost:4000/graphql',
          //link:createUploadLink({ uri }),
          //link: myHtttpLink,
          link: uploadLink,
          cache: cache,
        }),
      );
    }
    init();

    setReady(true)
  }, []);
  if (!client) {
    return <Text>Initializing app...</Text>;
  }
  //client.resetStore()
  //just to reset cache for debugging
  //TODO: high : need to figure out where to place Form provider that doesnt contradict user auth
  //{ready && <AuthNavigator/>}
  return (
    <ApolloProvider client={client}>
      <FormProvider>
        <AuthNavigator/>
      </FormProvider>
    </ApolloProvider>
  );
}
export default App
