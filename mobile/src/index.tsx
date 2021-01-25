import React, { useState, ReactElement } from 'react'
import * as Keychain from 'react-native-keychain'
import { useColorScheme } from 'react-native-appearance'
import ThemeProvider from './ThemeProvider'
import { NavigationContainer} from '@react-navigation/native'
import {UserContext, AuthNavigator} from './UserContext'
import { from ,createHttpLink, ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError } from "apollo-link-error"
import { FormProvider } from './Contexts/FormContext'
import { useQuery, useMutation , makeVar} from '@apollo/client'

const MEMORY_KEY_PREFIX = '@MyStorage:'

let dataMemory: any = {}

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
class MyStorage {
  // the promise returned from sync function
  static syncPromise = null

  // set item with the key
  static setItem(key: string, value: string): string {
    Keychain.setGenericPassword(MEMORY_KEY_PREFIX + key, value)
    dataMemory[key] = value
    return dataMemory[key]
  }

  // get item with the key
  static getItem(key: string): string {
    return Object.prototype.hasOwnProperty.call(dataMemory, key) ? dataMemory[key] : undefined
  }

  // remove item with the key
  static removeItem(key: string): boolean {
    Keychain.resetGenericPassword()
    return delete dataMemory[key]
  }

  // clear out the storage
  static clear(): object {
    dataMemory = {}
    return dataMemory
  }
}

/////////////////////// Gloabl Appolo CLient error inspection //////////////
const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
});
/////////////////////////////////////////////////////////////////////////////////
//const cache = new InMemoryCache()
export  const squashItemsVar = makeVar([])
  const cache = new InMemoryCache({
     typePolicies: {
    Query: {
      fields: {
        squashId: {
          read() {
            return squashItemsVar();
          }
        }
      }
    }
  }
  })
const myHtttpLink  = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});
const link = ApolloLink.from([onErrorLink, myHtttpLink])
//const link = ApolloLink.from([myHtttpLink])
const client = new ApolloClient({
  link: link,
  cache: cache,
});
const App = (): ReactElement =>
{
  /**
   * Subscribe to color scheme changes with a hook
   */
  //TODO: high : need to figure out where to place Form provider that doesnt contradict user auth
  const scheme = useColorScheme()
  return (
    <ApolloProvider client={client}>
      <FormProvider>
        <AuthNavigator/>
      </FormProvider>
    </ApolloProvider>
  );
}

export default App
