import React, { useState, ReactElement } from 'react'
import { from ,createHttpLink, ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import { makeVar} from '@apollo/client'
import {persistCache, AsyncStorageWrapper} from 'apollo3-cache-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'

export  const squashItemsVar = makeVar([])
export  const isProfileCompleteVar = makeVar<Boolean>(false)
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isProfileComplete: {
          read() {
            return isProfileCompleteVar();
          },
        },
      },
    },
  },
});
