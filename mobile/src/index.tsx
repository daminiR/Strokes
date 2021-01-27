import React, { useState, ReactElement } from 'react'
import { cache} from './cache'
import {AuthNavigator} from './UserContext'
import { from ,createHttpLink, ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError } from "apollo-link-error"
import { FormProvider } from './Contexts/FormContext'
import {makeVar} from '@apollo/client'
import {persistCache, AsyncStorageWrapper} from 'apollo3-cache-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {onErrorLink} from './globalGraphqlErrors'



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
const myHtttpLink  = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});
const link = ApolloLink.from([onErrorLink, myHtttpLink])
const client = new ApolloClient({
  link: link,
  cache: cache,
});
const App = (): ReactElement =>
{
  //TODO: high : need to figure out where to place Form provider that doesnt contradict user auth
  return (
    <ApolloProvider client={client}>
      <FormProvider>
        <AuthNavigator/>
      </FormProvider>
    </ApolloProvider>
  );
}

export default App
