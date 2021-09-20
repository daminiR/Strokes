import Squash from '../models/Squash';
import { GraphQLUpload } from 'graphql-upload'
import { SquashDocument } from '../types/Squash.d'
import { sanitizeFile } from '../utils/fileNaming'
import {Types} from 'mongoose'
import { acsport1 } from '../index'
import {access, createWriteStream} from 'fs'
import { Stream } from "stream"
import * as path from 'path';
import {format} from 'util'
import axios from 'axios'


interface Data {
  img_idx: string;
  imageURL: string;
}

const dest_gcs_images = "all_images/"
export const resolvers = {
  Query: {
    squash: async (parents, args, context, info) => {
      const squash_val = await Squash.findById(args.id);
      console.log("is it working now")
      console.log(squash_val)
      return squash_val;
    },
    squashes: async (parents, args, context, info) => {
      const squashes = await Squash.find({});
      console.log(squashes)
      return squashes;
    },
    display: async (parents, args, context, info) => {

    },
  },
  FileUpload: GraphQLUpload,
  Mutation: {
     uploadFile: async (parents, { file, _id, img_idx} , context, info) => {
       // TODO: add user id as a seprator
       const { filename, mimetype, encoding, createReadStream } = await file;
       console.log(file);
       console.log(_id);
       console.log(img_idx);
       const sanitizedFilename = sanitizeFile(filename, "1234");
       console.log(sanitizedFilename);
       const gcFile = acsport1.file(
         path.join(dest_gcs_images, sanitizedFilename)
       );
       let data: Data;
       const squash_val = await Squash.findById(_id);
       console.log("isthis working");
       await new Promise<void>((resolve, reject) => {
         createReadStream().pipe(
           gcFile
             .createWriteStream()
             .on("finish", () => {
               //get link representing data file
               // save it to mongo db
               data = {
                 img_idx: img_idx,
                 imageURL: `https://storage.googleapis.com/${acsport1}/${sanitizedFilename}`,
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
         squash_val!.image_set = [data];
         squash_val!.save();
         console.log(squash_val);
       });

       return squash_val;
     },
    createSquash: async (root, args): Promise<SquashDocument> => {
      const squash = Squash.create(args);
      return squash;
    },
    deleteSquash: async (root, args) => {
      const squash = await Squash.findById({ id: args });
      if (squash) {
        await squash.remove();
        return true;
      } else {
        return false;
      }
    },
  },
};
