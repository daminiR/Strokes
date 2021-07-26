import Squash from '../models/Squash';
import { ReadStream } from "fs-capacitor"
import { SquashDocument } from '../types/Squash.d'
import {Types} from 'mongoose'
import { acsport1 } from '../index'
import {createWriteStream, createReadStream} from 'fs'
import { Stream } from "stream"
import * as path from 'path';
import {format} from 'util'
import axios from 'axios'

//interface Upload {
    //createReadStream: () => Stream
    //filename: string
//}
const gcs_profile = "/profile/"
const gcs_images = "/all_images"
const files:string[] = []
export const resolvers = {
  Query: {
    squash: async (id) => {
      const squash_val = await Squash.findById(id);
      console.log("values")
      return squash_val;
    },
    squashes: async (limit) => {
      const squashes = await Squash.find({});
      console.log(squashes)
      return squashes;
    },
  },
  Mutation: {
     uploadFile: async (_, {files, _id}) => {
       //const { filename, mimetype, encoding, createReadStream} = await file
       //const {filename, mimetype, encoding, createReadStream} = await files[0];
       // TODO: when buidling for io make sure file structure matches and replace it
       // TODO: add android and ios variations and map it seprately for uri
       // TODO: add user id as a seprator
       // read stream function has issues, this works for now -> it had the same underlying code
       //console.log(filespath" argument must be of type string or an instance of Buffer or URL)
       await Promise.all(files.map(async (file) => {
         console.log(file)
         const stream = createReadStream('/storage/emulated/0/Pictures/IMG_20210419_151521.jpg')
         //const dataStream = new Stream.PassThrough()
         const gcFile = acsport1.file(file.name)
         //dataStream.push(file.buffer)
         //dataStream.push(null)
         await new Promise((resolve, reject) => {
           //dataStream
        console.log("what is going on")
           stream
             .pipe(
               gcFile.createWriteStream({
                 resumable: false,
                 validation: false,
                 metadata: { "Cache-Control": "public, max-age=31536000" },
               })
             )
             .on("error", (error: Error) => {
               console.log("error")
               //reject(error);
             })
             .on("finish", () => {
               console.log("no erro")
               //resolve(true);
             })
         })
         .catch((err) => {console.log(err)})
       }))
       .catch((err) => console.log(err))
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
