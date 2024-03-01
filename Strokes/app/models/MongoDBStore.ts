import { types, flow } from 'mobx-state-tree';
import { gql } from '@apollo/client';
import client from '../services/api/apollo-client';
import { getRootStore } from './helpers/getRootStore';
import * as graphQL from '@graphQL'


interface UserData {
  phoneNumber: string;
  email: string;
  _id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  sports: string;
  description: string;
  location: string;
}


const MongoDBStore = types
  .model('MongoDBStore', {
    // Define any state properties you may need
  })
  .actions((self) => ({
    createUserInMongoDB: flow(function* createUser() {
      try {
        const userStore = getRootStore(self).userStore
        console.log(userStore.imageFiles)
        const response = yield client.mutate({
          mutation: graphQL.ADD_PROFILE2,
          variables: {
            phoneNumber: userStore.phoneNumber,
            email: userStore.email,
            _id: userStore._id,
            image_set: userStore.imageFiles,
            first_name: userStore.firstName,
            last_name: userStore.lastName,
            age: 33,
            gender: userStore.gender,
            sports: ["Squash", 1],
            description: userStore.description,
            location: userStore.neighborhood,
            //newUserToken: token,
          },
        })
        // Handle success or update state as needed
      } catch (error) {
        console.error('Error creating user:', error);
        // Handle error or set error state
      }
    }),

    // Add more actions for interacting with MongoDB via GraphQL as needed
  }));

export default MongoDBStore;
