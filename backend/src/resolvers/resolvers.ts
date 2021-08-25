import Squash from '../models/Squash';
import { ReadStream } from "fs-capacitor"
import { GraphQLUpload } from 'graphql-upload'
import { SquashDocument } from '../types/Squash.d'
import { sanitizeFile } from '../utils/fileNaming'
import {Types} from 'mongoose'
import { acsport1 } from '../index'
import {access, createWriteStream, createReadStream} from 'fs'
import { Stream } from "stream"
import * as path from 'path';
import {format} from 'util'
import axios from 'axios'
import * as  RNFS from 'react-native-fs'


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
  },
  FileUpload: GraphQLUpload,
  Mutation: {
     uploadFile: async (parents, { file } , context, info) => {
       // TODO: add user id as a seprator
         const { createReadStream, filename, mimetype, encoding } = await file
         const sanitizedFilename = sanitizeFile(filename, "1234")
         console.log(sanitizedFilename)
         const gcFile = acsport1.file( path.join(dest_gcs_images, sanitizedFilename))
         await new Promise((resolve, reject) => {
           createReadStream()
             .pipe(
               gcFile.createWriteStream({
                 resumable: false,
                 validation: false,
                 metadata: { "Cache-Control": "public, max-age=31536000" },
               })
             )
             .on("error", (error: Error) => {
                reject(error)
             })
             .on("finish", () => {
                 resolve("resolved")
             })
         })
         .then(msg => {
             console.log("successfully image uploaded")
             console.log(msg)})
         .catch((err) => {console.log(err)})

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
