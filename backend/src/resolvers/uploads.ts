import Squash from '../models/Squash';
import { GraphQLUpload } from 'graphql-upload'
import sanitize from 'mongo-sanitize'
import { sanitizeFile } from '../utils/fileNaming'
import * as path from 'path';
import _ from 'lodash'
import {Data, DisplayData} from '../types/Squash'
import {
  dest_gcs_images,
} from "../constants/";

export const resolvers = {
  FileUpload: GraphQLUpload,
  Mutation: {
    deleteImage: async (parents, unSanitizedData, context, info) => {
      const { _id, img_idx } = sanitize(unSanitizedData);
      const filter = { _id: _id };
      const update = { $pull: { image_set: { img_idx: img_idx } } };
      const squash_doc = await Squash.findOneAndUpdate(filter, update, {
        new: false,
      });
      let file_to_del = squash_doc!.image_set.find(
        (image_info) => image_info.img_idx === img_idx
      )!.filePath;
      //await deleteFromGC(file_to_del);
      return squash_doc!.image_set;
    },
  },
};
