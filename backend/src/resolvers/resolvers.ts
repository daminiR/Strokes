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
  img_idx: number;
  imageURL: string;
  filePath: string;
}
interface DisplayData {
  imageURL: string;
  filePath: string;
}
const dest_gcs_images = "all_images"
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
     deleteImage: async (parents, {_id, img_idx} , context, info) => {
       // TODO: add user id as a seprator
       console.log(_id);
       console.log(img_idx);
       // get file uri from squash document
       // acees in google cloud storage
       // remove it
       // update squash document
       const squash_val = await Squash.findById(_id);
       console.log(squash_val)
       const file_to_del =  squash_val!.image_set.find(image_info => image_info.img_idx === img_idx)!.filePath
       console.log("file to del")
       console.log(file_to_del)
       await acsport1.file(file_to_del).delete().then(
        () => {
            console.log(`file ${file_to_del} deleted`)
        }
       )
       .catch(error => {
            console.log(error)
        })
       return squash_val;
     },
     uploadFile: async (parents, { file, _id, img_idx} , context, info) => {
       // TODO: add user id as a seprator
       const { filename, mimetype, encoding, createReadStream } = await file;
       console.log(file);
       console.log(_id);
       console.log(img_idx);
       const sanitizedFilename = sanitizeFile(filename, _id);
       console.log(sanitizedFilename);
       const gcFile = acsport1.file(
         path.join(dest_gcs_images, sanitizedFilename)
       );
       let data: Data
       let displayData: DisplayData ={
           imageURL: "",
           filePath: ""
       }
       const squash_val = await Squash.findById(_id);
       console.log("isthis working");
       await new Promise<void>((resolve, reject) => {
         createReadStream().pipe(
           gcFile
             .createWriteStream()
             .on("finish", () => {
               //get link representing data file
               // save it to mongo db
                gcFile.makePublic()
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
         squash_val!.image_set = [data];
         squash_val!.save();
         console.log(squash_val);
       });
       return displayData
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
