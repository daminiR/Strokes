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
import { ObjectId } from 'mongodb'

interface Data {
  img_idx: number;
  imageURL: string;
  filePath: string;
}
interface DisplayData {
  imageURL: string;
  filePath: string;
}

const deleteFromGC = async (file_to_del: string) => {
       await acsport1.file(file_to_del).delete().then(
        () => {
            console.log(`file ${file_to_del} deleted`)
        }
       )
       .catch(error => {
            console.log(error)
        })
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
     updateUserSports: async (parents, {_id, sportsList} , context, info) => {
       if (sportsList.length != 0){
           const doc = await Squash.findOneAndUpdate(
             {_id: _id },
             {$set:{sports: sportsList}},
             {new: true }
           );
           console.log("Updated user squash changes")
       }
       return _id
     },
     deleteImage: async (parents, {_id, img_idx} , context, info) => {
       const filter = { '_id': _id}
       const update = {$pull: {image_set : {img_idx: img_idx}}}
       const squash_doc = await Squash.findOneAndUpdate(filter, update, {new: false})
       let file_to_del  = squash_doc!.image_set.find(image_info => image_info.img_idx === img_idx)!.filePath
       await deleteFromGC(file_to_del)
       return squash_doc!.image_set;
     },
     uploadFile: async (parents, { file, _id, img_idx} , context, info) => {
       // TODO: add user id as a seprator
       const { filename, mimetype, encoding, createReadStream } = await file;
       const sanitizedFilename = sanitizeFile(filename, _id);
       const gcFile = acsport1.file(
         path.join(dest_gcs_images, sanitizedFilename)
       );
       let data: Data
       let displayData: DisplayData ={
           imageURL: "",
           filePath: ""
       }
       const squash_val = await Squash.findById(_id);
       await new Promise<void>((resolve, reject) => {
         createReadStream().pipe(
           gcFile
             .createWriteStream()
             .on("finish", () => {
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

           const file_to_del = squash_val!.image_set.find((image_info) => image_info.img_idx === img_idx)!.filePath.toString()
           await deleteFromGC(file_to_del)
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
