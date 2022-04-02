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
  Query: {
    checkPhoneInput: async (parents,{phoneNumber}, context, info) => {
      const filter = {phoneNumber: phoneNumber}
      const user = await Squash.findOne(filter)
      console.log("pphone", user)
      if(user){
        return {isPhoneExist: true, isDeleted: user.deleted? user.deleted.isDeleted : false}
      }
      else {
        return {isPhoneExist: false, isDeleted: false}
      }
    },
  },
  //Mutations: {},
};
