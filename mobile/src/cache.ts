import React, { useState, ReactElement } from 'react'
import { from ,createHttpLink, ReactiveVar, ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import { makeVar} from '@apollo/client'
import {persistCache, AsyncStorageWrapper} from 'apollo3-cache-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {SportsList, InputT, NameT, PotentialMatchT} from '@localModels'

const sportInitialValue: SportsList = [];
export const sportsItemsVar:ReactiveVar<SportsList> = makeVar<SportsList>(sportInitialValue)
export const FirstNameVar:ReactiveVar<NameT> = makeVar<NameT>({FirstName: '', LastName:''})
export const EditInputVar:ReactiveVar<InputT> = makeVar<InputT>({inputType: '', displayInput: false})
export const EditAccountInputVar:ReactiveVar<InputT> = makeVar<InputT>({inputType: '', displayInput: false})
export const EditAccounDetailInputVar:ReactiveVar<InputT> = makeVar<InputT>({inputType: '', displayInput: false})
export const AgeVar:ReactiveVar<Number> = makeVar<Number>(0)
export const GenderVar:ReactiveVar<String> = makeVar<String>(null)
export const DescriptionVar:ReactiveVar<String> = makeVar<String>('')
export  const isProfileCompleteVar = makeVar<Boolean>(false)



export const likesVar:ReactiveVar<PotentialMatchT> = makeVar<PotentialMatchT>([])
export const dislikesVar:ReactiveVar<PotentialMatchT> = makeVar<PotentialMatchT>([])


export const cityVar:ReactiveVar<String> = makeVar<String>('')
export const isCityChangedVar:ReactiveVar<Boolean> = makeVar<Boolean>(false)
export const filterSportChangedVar:ReactiveVar<Boolean> = makeVar<Boolean>(false)

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        //queryProssibleMatches: {
          //keyArgs: false,
           //Concatenate the incoming list items with
           // the existing list items.
          //merge(existing = [], incoming, {args: {offset = 0}}) {
            //const merged = existing ? existing.slice(0) : [];
              //for (let i = 0; i < incoming.length; ++i) {
              //merged[offset + i] = incoming[i];
            //}
            //return incoming;
        //},
          //merge(existing = [], incoming) {
            //return [...incoming];
        //},
        //},
        inputItems: {
          read() {
            return EditInputVar();
          },
        },
        inputAccountItems: {
          read() {
            return EditAccountInputVar();
          },
        },
        inputAccountDetailItems: {
          read() {
            return EditAccounDetailInputVar();
          },
        },
        dislikedItems: {
          read() {
            return dislikesVar();
          },
        },
        likedItems: {
          read() {
            return likesVar();
          },
        },
        sportItems: {
          read() {
            return sportsItemsVar();
          },
        },
        city: {
          read() {
            return cityVar();
          },
        },
        isCityChanged: {
          read() {
            return isCityChangedVar();
          },
        },
        isFilterSportChanged: {
          read() {
            return filterSportChangedVar();
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
