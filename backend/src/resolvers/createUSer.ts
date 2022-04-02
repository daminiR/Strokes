import Squash from '../models/Squash';
import Message from '../models/Messages';
import { GraphQLUpload } from 'graphql-upload'
import { ObjectId} from 'mongodb'
import { sanitizeFile } from '../utils/fileNaming'
import { acsport1 } from '../index'
import * as path from 'path';
import _ from 'lodash'
import {Data, DisplayData} from '../types/Squash'
import {
  deleteAllUserImages,
  creatGCUpload,
  deleteFilesFromGC,
  deleteFromGC,
} from "../utils/googleUpload";
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
  dest_gcs_images,
  POST_CHANNEL
} from "../constants/";
//import { PubSub } from 'graphql-subscriptions';
import { pubsub } from '../pubsub'
//const pubsub = new PubSub()
export const resolvers = {
  Mutation: {
    createSquash2: async (
      root,
      {
        _id,
        image_set,
        first_name,
        last_name,
        gender,
        age,
        sports,
        location,
        description,
        phoneNumber,
        email,
      }
    ) => {
      const data_set = await creatGCUpload(image_set, _id)
      const doc = await Squash.create({
          _id: _id,
          image_set: data_set,
          first_name: first_name,
          last_name: last_name,
          gender: gender,
          age: age,
          location: location,
          sports: sports,
          description: description,
          phoneNumber: phoneNumber,
          email: email,
          active: true,
          swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
          visableLikePerDay: LIKES_PER_DAY_LIMIT,
          sportChangesPerDay: SPORT_CHANGES_PER_DAY,
        });
        console.log(doc);
        return doc;
    },
  },
};
