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
  deleteFromGC,
} from "../utils/googleUpload";
import {
  dest_gcs_images,
} from "../constants/";

export const resolvers = {
  FileUpload: GraphQLUpload,
  Mutation: {
    deleteImage: async (parents, { _id, img_idx }, context, info) => {
      const filter = { _id: _id };
      const update = { $pull: { image_set: { img_idx: img_idx } } };
      const squash_doc = await Squash.findOneAndUpdate(filter, update, {
        new: false,
      });
      let file_to_del = squash_doc!.image_set.find(
        (image_info) => image_info.img_idx === img_idx
      )!.filePath;
      await deleteFromGC(file_to_del);
      return squash_doc!.image_set;
    },
    uploadFile: async (parents, { file, _id, img_idx }, context, info) => {
      // TODO: add user id as a seprator
      const { filename, mimetype, encoding, createReadStream } = await file;
      const sanitizedFilename = sanitizeFile(filename, _id);
      const gcFile = acsport1.file(
        path.join(dest_gcs_images, sanitizedFilename)
      );
      let data: Data;
      let displayData: DisplayData = {
        imageURL: "",
        filePath: "",
      };
      const squash_val = await Squash.findById(_id);
      await new Promise<void>((resolve, reject) => {
        createReadStream().pipe(
          gcFile
            .createWriteStream()
            .on("finish", () => {
              gcFile.makePublic();
              data = {
                img_idx: img_idx,
                imageURL: `https://storage.googleapis.com/acsport1/${dest_gcs_images}/${sanitizedFilename}`,
                filePath: `${dest_gcs_images}/${sanitizedFilename}`,
              };
              displayData = {
                imageURL: `https://storage.googleapis.com/acsport1/${dest_gcs_images}/${sanitizedFilename}`,
                filePath: `${dest_gcs_images}/${sanitizedFilename}`,
              };
              console.log("done");
              resolve();
            })
            .on("error", (error) => {
              console.log("error");
              console.log(error);
              reject();
            })
        );
      }).then(async () => {
        if (
          squash_val!.image_set.find(
            (image_info) => image_info.img_idx === img_idx
          ) === undefined
        ) {
          const doc = await Squash.findOneAndUpdate(
            { _id: _id },
            { $push: { image_set: data } },
            { new: true }
          );
          console.log(doc);
        } else {
          const file_to_del = squash_val!.image_set
            .find((image_info) => image_info.img_idx === img_idx)!
            .filePath.toString();
          await deleteFromGC(file_to_del);
          const filter = {
            _id: _id,
            image_set: { $elemMatch: { img_idx: img_idx } },
          };
          const update = { $set: { "image_set.$": data } };
          const doc = await Squash.findOneAndUpdate(filter, update, {
            new: true,
          });
          console.log(doc);
        }
      });
      return displayData;
    },
  }
}
