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

const creatGCUpload = (image_set, _id) => {
      const promise = Promise.all(
        image_set.map(async (image) => {
          return new Promise(async (resolve, reject) => {
            const {
              filename,
              mimetype,
              encoding,
              createReadStream,
            } = await image.file;
            console.log(filename);
            console.log("where is the file");
            console.log(image.file);
            const sanitizedFilename = sanitizeFile(filename, _id);
            const gcFile = acsport1.file(
              path.join(dest_gcs_images, sanitizedFilename)
            );
            let data: Data;
            let displayData: DisplayData = {
              imageURL: "",
              filePath: "",
            };
            createReadStream().pipe(
              gcFile
                .createWriteStream()
                .on("finish", () => {
                  gcFile.makePublic();
                  data = {
                    img_idx: image.img_idx,
                    imageURL: `https://storage.googleapis.com/acsport1/${dest_gcs_images}/${sanitizedFilename}`,
                    filePath: `${dest_gcs_images}/${sanitizedFilename}`,
                  };
                  displayData = {
                    imageURL: `https://storage.googleapis.com/acsport1/${dest_gcs_images}/${sanitizedFilename}`,
                    filePath: `${dest_gcs_images}/${sanitizedFilename}`,
                  };
                  console.log("done");
                  resolve(data);

                })
                .on("error", (error) => {
                  console.log("error");
                  console.log(error);
                  reject();
                })
            );
          });
        })
      )
      return promise
}
const deleteFilesFromGC = async (files_to_del, original_uploaded_image_set) => {
  // remove from gc AND mongdb
  // remove from mongoDb
  const  img_idx_del = files_to_del.map(imgObj => imgObj.img_idx)
  const filtered_array = original_uploaded_image_set.filter(imgObj => !img_idx_del.includes(imgObj.img_idx))
  console.log("check filtered again", filtered_array)
  files_to_del.map(async (file_to_del) => {
    await deleteFromGC(file_to_del.filePath);
  });
  return filtered_array
};
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
      console.log(squash_val);
      return squash_val;
    },
    queryProssibleMatches: async (parents, { _id }, context, info) => {
      const users = await Squash.find({ _id: { $ne: _id } });
      console.log("All users that are a potential match to current!");
      return users;
    },
    squashes: async (parents, args, context, info) => {
      const squashes = await Squash.find({});
      console.log(squashes);
      return squashes;
    },
    display: async (parents, args, context, info) => {},
  },
  FileUpload: GraphQLUpload,
  Mutation: {
    updateUserSports: async (parents, { _id, sportsList }, context, info) => {
      if (sportsList.length != 0) {
        const doc = await Squash.findOneAndUpdate(
          { _id: _id },
          { $set: { sports: sportsList } },
          { new: true }
        );
        console.log("Updated user squash changes");
      }
      return _id;
    },
    updateName: async (
      parents,
      { _id, first_name, last_name },
      context,
      info
    ) => {
      console.log("did we get here");
      if (first_name.length != 0) {
        const doc = await Squash.findOneAndUpdate(
          { _id: _id },
          { $set: { first_name: first_name, last_name: last_name } },
          { new: true }
        );
        console.log("Updated user first name ", first_name, last_name);
      } else {
        console.log("Name cannot be no length");
      }
      return _id;
    },
    updateAge: async (parents, { _id, age }, context, info) => {
      if (age != 0) {
        const doc = await Squash.findOneAndUpdate(
          { _id: _id },
          { $set: { age: age } },
          { new: true }
        );
        console.log("Updated user age ", age);
      } else {
        console.log("Age cannot be no length");
      }
      return _id;
    },
    updateGender: async (parents, { _id, gender }, context, info) => {
      //if (gender != 0) {
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $set: { gender: gender } },
        { new: true }
      );
      console.log("Updated user gender ", gender);
      //} else {
      //console.log("Age cannot be no length");
      //}
      return _id;
    },
    updateDescription: async (parents, { _id, description }, context, info) => {
      //if (gender != 0) {
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $set: { description: description } },
        { new: true }
      );
      console.log("Updated user description ", description);
      //} else {
      //console.log("Age cannot be no length");
      //}
      return _id;
    },
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
    createSquash2: async (
      root,
      {
        _id,
        image_set,
        first_name,
        last_name,
        gender,
        age,
        sports,
        description,
      }
    ) => {
      creatGCUpload(image_set, _id).then(async (data_set: any) => {
        console.log(data_set);
        console.log("done");
        const doc = await Squash.create({
          _id: _id,
          image_set: data_set,
          first_name: first_name,
          last_name: last_name,
          gender: gender,
          age: age,
          sports: sports,
          description: description,
        });
        console.log(doc);
      });
      return "done";
    },
    updateUserProfile: async (
      root,
      {
        _id,
        image_set,
        first_name,
        last_name,
        gender,
        age,
        sports,
        description,
        remove_uploaded_images,
        add_local_images,
        original_uploaded_image_set,
      }
    ) => {
      // remove from gc
      const removed_image_set = await deleteFilesFromGC(remove_uploaded_images, original_uploaded_image_set);
      creatGCUpload(add_local_images, _id).then(async (data_set: any) => {
        console.log(data_set);
        const final_image_set = removed_image_set.concat(data_set)
        console.log("new array for total delete and add", final_image_set)
        const doc = await Squash.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              _id: _id,
              image_set: final_image_set,
              first_name: first_name,
              last_name: last_name,
              gender: gender,
              age: age,
              sports: sports,
              description: description,
            },
          },
          { new: true }
        );
        console.log("Updated user profile new profile", doc);
      });
      return "done";
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
