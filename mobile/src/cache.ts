import React, { useState, ReactElement } from 'react'
import { from ,createHttpLink, ReactiveVar, ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import { makeVar} from '@apollo/client'
import {persistCache, AsyncStorageWrapper} from 'apollo3-cache-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {SportsList} from './localModels/UserSportsList'

const sportInitialValue: SportsList = [];
export const sportsItemsVar:ReactiveVar<SportsList> = makeVar<SportsList>(sportInitialValue)
export  const isProfileCompleteVar = makeVar<Boolean>(false)
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        sportItems: {
          read() {
            return sportsItemsVar();
          },
        },
      },
    },
  },
});
