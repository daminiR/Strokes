import React, { useState, ReactElement } from 'react'
import { from ,createHttpLink, ReactiveVar, ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import { makeVar} from '@apollo/client'
import {persistCache, AsyncStorageWrapper} from 'apollo3-cache-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {SportsList, NameT} from './localModels/UserSportsList'

const sportInitialValue: SportsList = [];
export const sportsItemsVar:ReactiveVar<SportsList> = makeVar<SportsList>(sportInitialValue)
export const FirstNameVar:ReactiveVar<NameT> = makeVar<NameT>({FirstName: '', LastName:''})
export const AgeVar:ReactiveVar<Number> = makeVar<Number>(0)
export const GenderVar:ReactiveVar<String> = makeVar<String>(null)
export const DescriptionVar:ReactiveVar<String> = makeVar<String>('')
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
        fullName: {
          read() {
            return FirstNameVar();
          },
        },
        age: {
          read() {
            return AgeVar();
          },
          },
        gender: {
          read() {
            return GenderVar();
          },
        },
        description: {
          read() {
            return DescriptionVar();
          },
        },
      },
    },
  },
});
