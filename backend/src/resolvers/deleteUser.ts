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
import sanitize from 'mongo-sanitize'
export const resolvers = {
  Mutation: {
    deleteSquash: async (root, unSanitizedData) => {
      const { _id, image_set } = sanitize(unSanitizedData);
      const squash = await Squash.findById(_id);
      if (squash && image_set) {
        deleteAllUserImages(image_set).then(async () => {
          await squash.remove().then(() => {
            console.log("profile deleted and google cloud image deleted");
          });
        });
        return true;
      } else {
        return false;
      }
    },
    softDeleteUser: async (root, { unSanitizedId }) => {
      const _id = sanitize(unSanitizedId)
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $set: { deleted: { isDeleted: true, deletedAt: new Date() } } },
        { new: true }
      );
      console.log("user soft deleted");
      return "Done";
    },
  },
};
