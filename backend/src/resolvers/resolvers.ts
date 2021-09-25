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
       const filter = { '_id': _id}
       const update = {$pull: {image_set : {img_idx: img_idx}}}
       const squash_doc = await Squash.findOneAndUpdate(filter, update, {new: false}, (err, doc) => {console.log(err)})
       let file_to_del  = squash_doc!.image_set.find(image_info => image_info.img_idx === img_idx)!.imageURL
       //console.log("file to del")
       //console.log(file_to_del)
       await acsport1.file(file_to_del).delete().then(
        () => {
            console.log(`file ${file_to_del} deleted`)
        }
       )
       .catch(error => {
            console.log(error)
        })
        // delete from schema
       return squash_doc!.image_set;
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
       console.log(squash_val)
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
           //const doc = Squash.findOneAndUpdate(
             //{ _id: new ObjectId() },
             //{ $push: { image_set: data } },
               //{new: true}
         // if imgx idx is not in array add, else replace
         //if (
           //squash_val!.image_set = [data]
         if (squash_val!.image_set.find(
           (image_info) => image_info.img_idx === img_idx
         ) === undefined) {
           console.log("if doesnt exists in array");
           const doc = await Squash.findOneAndUpdate(
             { _id: _id},
             { $push: {image_set: data}},
             {new: true}
           );
           console.log(doc)
         }
           else {
           console.log("are we here");
           const filter = { _id: _id, image_set: {$elemMatch: { img_idx: img_idx}}}
           const update = {$set: {"image_set.$" : data}}
           const squash_new = await Squash.findOneAndUpdate(filter, update, {new: true})
           console.log("squash life")
           console.log(squash_new)
         }
         //console.log(squash_val!.image_set)
         //squash_val!.save()
         //squash_val!.markModified('image_set')
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
