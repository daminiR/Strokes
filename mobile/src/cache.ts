import React, { useState, ReactElement } from 'react'
import { from ,createHttpLink, ReactiveVar, ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import { makeVar} from '@apollo/client'
import {persistCache, AsyncStorageWrapper} from 'apollo3-cache-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {SportsList} from './localModels/UserSportsList'

const sportInitialValue: SportsList = [];
export const sportsItemsVar:ReactiveVar<SportsList> = makeVar<SportsList>(sportInitialValue)
export const FirstNameVar:ReactiveVar<String> = makeVar<String>(null)
export const LastNameVar:ReactiveVar<String> = makeVar<String>(null)
export const GenderVar:ReactiveVar<String> = makeVar<String>(null)
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
        firstName: {
          read() {
            return FirstNameVar();
          },
        },
        lastName: {
          read() {
            return sportsItemsVar();
          },
          },
        gender: {
          read() {
            return sportsItemsVar();
          },
        },
      },
    },
  },
});
