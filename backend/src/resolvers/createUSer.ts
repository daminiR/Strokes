import Squash from '../models/Squash';
import Message from '../models/Messages';
import { GraphQLUpload } from 'graphql-upload'
import { ObjectId} from 'mongodb'
import { sanitizeFile } from '../utils/fileNaming'
import * as path from 'path';
import {validator} from '../validation'
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import {Data, DisplayData} from '../types/Squash'
import {
  createAWSUpload,
} from "../utils/awsUpload";
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
} from "../constants/";
export const resolvers = {
  Mutation: {
    createSquash2: async (
      root,
      unSanitizedData
    ) => {
      const {
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
      } = sanitize(unSanitizedData)

      const data_set = await createAWSUpload(image_set, _id)
      ///////////////////////////////////validate data before input/////////////////////////////////////////

      //////////////////////////////////////////////////////////////////////////////////////////////////////
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
