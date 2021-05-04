import Squash from '../models/Squash';
import { ReadStream } from "fs-capacitor"
import { SquashDocument } from '../types/Squash.d'
import {Types} from 'mongoose'
import { googleCloud } from '../index'
import {createWriteStream, createReadStream} from 'fs'
import { Stream } from "stream"
import * as path from 'path'

const acsport1 = googleCloud.bucket("acsport1");
interface Upload {
    createReadStream: () => Stream
    filename: string
}
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
     uploadFile: async (_, {file}) => {
       console.log("file 1 ", file);
       // TODO: when buidling for io make sure file structure matches and replace it
       // TODO: add android and ios variations and map it seprately for uri
       const { uri, name, type } = await file;
       console.log(file)
       const blob = acsport1.file(name);
       const stream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });
      stream.on('finish', () => console.log("Upload to Google cloud at location finished"))
      stream.on('error', (err) => console.log(err))
      stream.end(file.buffer);
      return true;
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
