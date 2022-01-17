import Squash from '../models/Squash';
import Message from '../models/Messages';
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
import { ObjectId} from 'mongodb'
import { typeDefs }  from '../typeDefs/typeDefs'
import { PotentialMatchUserInputType }  from '../typeDefs/typeDefs'
import _ from 'lodash'
//import { PubSub } from 'graphql-subscriptions';
import { pubsub } from '../pubsub'
//const pubsub = new PubSub()
const SWIPIES_PER_DAY_LIMIT = 10
const LIKES_PER_DAY_LIMIT = 3
export interface Sport {
  sport: string;
  game_level: number;
}
export interface ImageSetT {
  imageURL: string;
  img_idx: number;
  filePath: string;
}
export interface PotentialMatchType {
    first_name: string
    _id: string
    age: number
    gender: string
    sports: Sport[],
    description: string,
    image_set: ImageSetT[]
}

interface Data {
  img_idx: number;
  imageURL: string;
  filePath: string;
}
interface DisplayData {
  imageURL: string;
  filePath: string;
}
interface MessageType {
  sender: string
  receiver: string
  text: string;
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
            const sanitizedFilename = sanitizeFile(filename, _id);
            const fileLocation =  path.join(dest_gcs_images, _id, sanitizedFilename)
            console.log(fileLocation)
            const gcFile = acsport1.file(
                fileLocation
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
                    imageURL: `https://storage.googleapis.com/acsport1/${fileLocation}`,
                    filePath: `${fileLocation}`,
                  };
                  displayData = {
                    imageURL: `https://storage.googleapis.com/acsport1/${fileLocation}`,
                    filePath: `${fileLocation}`,
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
const deleteAllUserImages = async (image_set) => {
  // remove from gc AND mongdb
  await new Promise<void>((resolve, reject) => {
    try {
      image_set.map(async (imageObj) => {
        console.log("imageObj", imageObj.filePath)
        await deleteFromGC(imageObj.filePath);
      });
      resolve();
    } catch {
      reject();
    }
  });
};
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
const POST_CHANNEL = 'MESSAGE_CHANNEL'
export const resolvers = {
  Query: {
    messages: async (parents, {currentUserID, matchedUserID, offset, limit}, context, info) => {
      //TODO: index the sorting id thing! high latency
      const messages = await Message.find({
        $or: [{sender: currentUserID, receiver: matchedUserID},{sender: matchedUserID, receiver: currentUserID}]
      }).sort({"_id": -1}).skip(offset).limit(limit)
      // sort based on objectId
      console.log(messages)
      return messages
    },
    squash: async (parents, args, context, info) => {
      const squash_val = await Squash.findById(args.id)
      console.log(squash_val);
      return squash_val;
    },
    getSwipesPerDay: async (parents, {_id}, context, info) => {
      const user = await Squash.findById(_id)
      return user? user.swipesPerDay : 0
    },
    checkPhoneInput: async (parents,{phoneNumber}, context, info) => {
      const filter = {phoneNumber: phoneNumber}
      const user = await Squash.findOne(filter)
      console.log("pphone", user)
      if(user){
        return {isPhoneExist: true, isDeleted: user.deleted? user.deleted.isDeleted : false}
      }
      else {
        return {isPhoneExist: false, isDeleted: false}
      }
    },
    /////////////////////////////////////////////// Jmeter Testing ///////////////////////////////////////
    matchesNotOptim: async (parents, { _id, offset, limit, location, sport, game_levels, ageRange, dislikes}, context, info) => {
      //const users = await Squash.find({$and : [{ _id: { $ne: _id }}, {active: true}]}).limit(limit);
      //// it is imperitive all the filter items are indexed!
      const minAge = ageRange.minAge;
      const maxAge = ageRange.maxAge;
      const filter = {
        $and: [
          {
            _id: { $ne: _id },
          },
          {
            "location.city": location.city,
          },
          {
            "likes._id": {$ne: _id},
          },
          {
            active: true,
          },
          {
            //sports: { sport: sport, game_level: { $in: game_levels  } },
            sports: {
              $elemMatch: { sport: sport, game_level: { $in: ["2", "0"] } },
            },
          },
          {
            age: { $gt: minAge, $lt: maxAge },
          },
        ],
      };
      const users = await Squash.find(filter).skip(offset).limit(limit);
      console.log("All users that are a potential match to current!", users.length);
      return users;
    },
    ////////////////////////////////////////////////////////////////
    queryProssibleMatches: async (parents, { _id, offset, limit, location, sport, game_levels, ageRange}, context, info) => {
      //const users = await Squash.find({$and : [{ _id: { $ne: _id }}, {active: true}]}).limit(limit);
      //// it is imperitive all the filter items are indexed!
      //just for testing!
      const matchingestingFIlter = [
        "vesysemweoqsfeeqmmbgpfbjgyfb",
        "gmmrumjnprkvomlaujtnchuxmimg",
        "ajxydxqqodmnnflqrszduslasqvq",
        "txwqpoyqxcpvggrdogoasgtgbhnl",
        "fbxqmzosqyicrcqrwzcaxocphhof",
        "wretbbdbqrrsislfcgieoyyjrjug",
        "uxvzrlscekmkfnfiokkilcayaldn",
        "vhyykzhbjsewczprvgdmhwbxsmzu",
        "hcdqelwjyxokdmzlenomdjpzwpjo",
        "jsznhtqnocylruuzwaqurgjpoabz",
        "yxfscryrnuoboobsexdhnyfiuuaw",
        "kfpbkdaccdjgunmpvaasxcuvbyvx",
        "ntittoomnqedaqnblriizjoptnag",
        "wgksentfjqihijyhornfzmqidjow",
        "gzmoxyusjiquidhieqkygfzyspqx",
        "iqpsehxvmnkgeizymmimmslyzvds",
        "katnabhjuvrtbhdxqdnqonayftis",
        "kntalpxtkpzkokrjuemytzyofwzw",
        "sbruwlskfkpzcbwkhzfvcdjkfjnq",
        "hjtbjqtakkjmlehssknoghjusitp",
        "gowrdjixecspyedrwukycfzfydyd",
        "uohqumzhnhdyahntacizxsxpzmga",
        "upxsfctsaauzmuqjhkxmrxuxzbar",
        "zogmxlupmwmxkvxinnugxulwokgp",
        "nnxskfiqbrnmcovjzhehuejniwxw",
        "oitakxbvjqjdcpegiuglanzpkdjr",
        "bcnuigtqctzcmxktppjrrvbadccn",
        "qpqvaclkjuopmmgjysscgtvanmvv",
        "ftnyvcgszxrkxezuszktusqkmkzw",
      ];
      const minAge = ageRange.minAge;
      const maxAge = ageRange.maxAge;
      const filter = {
        $and: [
          {
            _id: { $ne: _id },
          },
          {
            "location.city": location.city,
          },
          {
            active: true,
          },
          {
            sports: {
              $elemMatch: { sport: sport, game_level: { $in: game_levels } },
            },
          },
          {
            age: { $gt: minAge, $lt: maxAge },
          },
        ],
      };
      const test_filter = {_id: {$in: matchingestingFIlter}}
      const fieldsNeeded = {
        _id: 1,
        first_name: 1,
        age: 1,
        gender: 1,
        sports: 1,
        description: 1,
        image_set: 1,
        location: 1,
      };
      const users = await Squash.find(test_filter, fieldsNeeded)
        .skip(offset)
        .limit(limit);
      return users;
    },
    squashes: async (parents, args, context, info) => {
      const squashes = await Squash.find({});
      return squashes;
    },
    display: async (parents, args, context, info) => {},
  },

  FileUpload: GraphQLUpload,
  Subscription: {
    messagePosted: {
      //subscribe: (parents, args, {pubsub}, info) => pubsub.asyncIterator(POST_CHANNEL)
      subscribe: () => pubsub.asyncIterator([POST_CHANNEL])
    },
  },

  Mutation: {
    //////////////////////////////////////// JMETER Testing MUtations ////////////////////////////////////////////////
    updateLocation: async (parents, {check}, context, info) => {
      const locationAll = {
        city: "Cambridge",
        state: "MA",
        country: "US"
      }
        const docs = await Squash.updateMany(
          {},
          { $set: { location: locationAll } },
          { new: true }
        );
        console.log("Updated user location changes", docs);
        return "Done";
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    postMessage2: async (parents, {sender, receiver, text}, context, info) => {
      const id = text.length
      const messageID = new ObjectId()
      const createdAt = new Date()
      pubsub.publish(POST_CHANNEL, {
        messagePosted: { _id: messageID, sender: sender, receiver: receiver, text: text, createdAt: createdAt}
      })
      const doc = await Message.create(
          { _id: messageID, sender: sender, receiver: receiver, text: text, createdAt: createdAt}
      )
       return id
    },
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
    updateMatches: async (parents, { currentUserId, potentialMatchId, currentUser, potentialMatch}, context, info) => {
        const doc = await Squash.findOneAndUpdate(
          { _id: currentUserId },
          { $addToSet: { matches: potentialMatch } },
          { new: true }
        );
        const doc2 = await Squash.findOneAndUpdate(
          { _id: potentialMatchId },
          { $push: { matches: currentUser} },
          { new: true }
        );
        console.log("doc user", doc)
        console.log("doc match", doc2)
      return doc;
    },
    updateLikes: async (parents, { _id, likes, currentUserData, isFromLikes}, context, info) => {
      // the one who swiped get one less swipe so for _id, decease swipe
      // only upser documents if likes/dislikes are more than 0
      console.log("what is isFromLikes", isFromLikes)
      if (!isFromLikes) {
      const doc = await Squash.findOneAndUpdate(
        { $and: [{ _id: _id }, { $gt: { swipesPerDay: 0 } }] },
        {
          $addToSet: { likes: { $each: likes } },
          $inc: { swipesPerDay: -1 },
        },
        { new: true }
      );
      const filter = { _id: likes };
      //const profileImage = _.find(doc?.image_set, (imgObj) => {
        //imgObj.img_idx == 0;
      //});
      const likedByUser = {
        first_name: doc?.first_name,
        _id: _id,
        age: doc?.age,
        gender: doc?.gender,
        sports: doc?.sports,
        description: doc?.description,
        image_set: doc?.image_set,
        location: doc?.location
      };
      const update = { $addToSet: { likedByUSers: likedByUser } };
      await Squash.updateMany(filter, update);
      return doc;
      }
      else {
      const doc = await Squash.findOneAndUpdate(
        { $and: [{ _id: _id }, { $gt: { swipesPerDay: 0, visableLikePerDay: 0}}] },
        {
          $addToSet: { likes: { $each: likes } },
          $inc: { swipesPerDay: -1, visableLikePerDay: -1},
        },
        { new: true }
      );
      const filter = { _id: likes };
      //const profileImage = _.find(doc?.image_set, (imgObj) => {
        //imgObj.img_idx == 0;
      //});
      const likedByUser = {
        first_name: doc?.first_name,
        _id: _id,
        age: doc?.age,
        gender: doc?.gender,
        sports: doc?.sports,
        description: doc?.description,
        image_set: doc?.image_set,
        location: doc?.location
      };
      const update = { $addToSet: { likedByUSers: likedByUser } };
      await Squash.updateMany(filter, update);
      return doc;
      }
    },
    updateDislikes: async (parents, { _id, dislikes, isFromLikes}, context, info) => {
      // todo: create dilikedby users list, users that didnt like you so you done need to show these
      if (!isFromLikes){
        const doc = await Squash.findOneAndUpdate(
          { $and: [{ _id: _id }, { $gt: { swipesPerDay: 0 } }] },
          {
            $addToSet: { dislikes: { $each: dislikes } },
            $inc: { swipesPerDay: -1 },
          },
          { new: true }
        );
        console.log("Updated user dislikes ", dislikes);
        console.log("doc", doc)
      return doc;
      }
      else {
        const doc = await Squash.findOneAndUpdate(
          { $and: [{ _id: _id }, { $gt: { swipesPerDay: 0, visableLikePerDay: 0} }] },
          {
            $addToSet: { dislikes: { $each: dislikes } },
            $inc: { swipesPerDay: -1, visableLikePerDay: -1},
          },
          { new: true }
        );
        console.log("Updated user dislikes ", dislikes);
        console.log("doc", doc)
      return doc;
      }
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
    ////////////////////////////////// JMETER TESTS ////////////////////////////////
    updateGameLevelsToStrings: async (parents, context, info) => {
        //const doc = await Squash.updateMany(
          //{ _id: ["aoshwaakxrywljjshsgxuvytfzlm"]},
          //{ $set: {"sports.$[].game_level":  '1'}},
          //{ new: true }
        //);
        console.log("tetsing")
      //return doc;
    },
    updateLikesTestSamples: async (parents, { _id, likes}, context, info) => {
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $addToSet: { likes: { $each: likes } } },
        { new: true }
      );
      const profileImage = _.find(doc?.image_set, imgObj => {imgObj.img_idx == 0})
      const likedByUser = {
        first_name: doc?.first_name,
        _id: _id,
        age: doc?.age,
        profileImage: profileImage,
      };
      const filter = {_id: likes}
      const update = { $addToSet: { likedByUSers: likedByUser}}
      await Squash.updateMany(filter, update)
      return doc;
    },
    updateLikesCurrentUserTestSamples: async (parents, { _id, likes}, context, info) => {
      /// function different from the pther updateLikes
      const likeIDs = _.map(likes, likeObj => {
        return likeObj._id
      })
      const likedDocs = await Squash.updateMany(
        { _id: {$in : likeIDs} },
        { $addToSet: { likes:  _id } },
        { new: true }
      );
      const filter = {_id: _id}
      const update = { $addToSet: { likedByUSers: {$each : likes}}}
      const doc = await Squash.findOneAndUpdate(filter, update)
      return doc;
    },
    updateUserProfileTestSamples: async (parents, { _id1, _id2 }, context, info) => {
        const doc = await Squash.updateMany(
          {},
          //{ $pull: { matches: {}, likes: {}, likedByUSers: {}} },
          { $set: {"sports.$[].game_level": _.random(0,2).toString()}},
          { new: true }
        );
        console.log("tetsing", doc)
      return doc;
    },
    createSquashTestSamples: async (
      root,
      {
        _id,
        image_set,
        first_name,
        last_name,
        gender,
        age,
        sports,
        location,
        description,
      }
    ) => {
      const doc = await Squash.create({
          _id: _id,
          image_set: image_set,
          first_name: first_name,
          last_name: last_name,
          gender: gender,
          age: age,
          sports: sports,
          location: location,
          description: description,
          swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
          visableLikePerDay: LIKES_PER_DAY_LIMIT,
          i_blocked: [],
          blocked_me: [],
          likes: [],
          dislikes: [],
          active: true,
        });
        console.log(doc);
        return doc;
    },
    testMut(root, args){
      return args.name
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
        location,
        description,
        phoneNumber,
        email,
      }
    ) => {
      const data_set = await creatGCUpload(image_set, _id)
      const doc = await Squash.create({
          _id: _id,
          image_set: data_set,
          first_name: first_name,
          last_name: last_name,
          gender: gender,
          age: age,
          location: location,
          sports: sports,
          description: description,
          phoneNumber: phoneNumber,
          email: email,
          active: true,
          swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
          visableLikePerDay: LIKES_PER_DAY_LIMIT,
        });
        console.log(doc);
        return doc;
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
        location,
        description,
        remove_uploaded_images,
        add_local_images,
        original_uploaded_image_set,
      }
    ) => {
      // remove from gc
      const removed_image_set = await deleteFilesFromGC(remove_uploaded_images, original_uploaded_image_set);
      const data_set = await creatGCUpload(add_local_images, _id)
      const final_image_set = removed_image_set.concat(data_set)
      const doc = await Squash.findOneAndUpdate(
          { _id: _id },
          {
            $set: {
              _id: _id,
              image_set: final_image_set,
              first_name: first_name,
              last_name: last_name,
              gender: gender,
              location: location,
              age: age,
              sports: sports,
              description: description,
            },
          },
          { new: true }
        );
    return doc
    },
    deleteChatUser: async (root, {_idUser, _idChatUser, UserObj, ChatUserObj}) => {
          //const filter = {'_id': [_idUser, _idChatUser]},
      // remove _ids from matches, likedByUSers, likes
          //{ $pull: { matches: {}, likes: {}, likedByUSers: {}} },
      if (!_.isEqual(_idUser,_idChatUser)){
        const filter = [_idUser, _idChatUser]
        const Users = await Squash.find(
          {'_id': [_idUser, _idChatUser]},
        );
          //var UserMatchObj = null
          //var ChatUserObj = null
          var matchObj = {}
          _.map(Users, userObj => {
          console.log(userObj._id)
          console.log(_idUser)
          if (_.isEqual(userObj._id, _idUser)){
            const potentialDisLike  = {
              '_id': userObj._id,
              'first_name': userObj.first_name,
              'age': userObj.age,
              'gender': userObj.gender,
              'sports': userObj.sports,
              'image_set': userObj.image_set,
              //TODO: some weird issue with description type
              'description': userObj.description.toString(),
            }
            matchObj[_idUser] = _.concat(userObj.dislikes, potentialDisLike)
          }
          if (_.isEqual(userObj._id, _idChatUser)){
            const potentialDisLike  = {
              '_id': userObj._id,
              'first_name': userObj.first_name,
              'age': userObj.age,
              'gender': userObj.gender,
              'sports': userObj.sports,
              'image_set': userObj.image_set,
              //TODO: some weird issue with description type
              'description': userObj.description.toString(),
            }
            matchObj[_idChatUser] = _.concat(userObj.dislikes, potentialDisLike)
          }
        })
        const doc = await Squash.findOneAndUpdate(
          {'_id': _idUser},
          {
            $pull:
           {
             "matches": {"_id": _idChatUser} ,
             "likes": {"_id": _idChatUser},
             "likedByUSers": _idChatUser,
          },
          $set: { dislikes: matchObj[_idChatUser]}
          },
          { new: true }
        );
        const doc2 = await Squash.findOneAndUpdate(
          {'_id': _idChatUser},
          {
            $pull:
           {
             "matches": {"_id": _idUser} ,
             "likes": {"_id": _idUser},
             "likedByUSers": _idUser,
          },
          $set: { dislikes: matchObj[_idUser]}
          },
          { new: true }
        );
        // Finally delete all chat history
        try {
          const allMessages = await Message.deleteMany({
            $or: [
              {
                $and: [
                  {
                    receiver: _idUser,
                  },
                  {
                    sender: _idChatUser,
                  },
                ],
              },
              {
                $and: [
                  {
                    receiver: _idChatUser,
                  },
                  {
                    sender: _idUser,
                  },
                ],
              },
            ],
          });
        }
        catch (e) {
          console.log(e)
        }
        //TODO: you can later test the doc output for total number of modifications should be 6 , 3 from each document
        //once done removing (don;t show user the matched user again) =>  add to dislike user set
        console.log("test docs in delete", doc)
      }
        return "done"
    },
    deleteSquash: async (root, {_id, image_set}) => {
      console.log("running")
      const squash = await Squash.findById(_id);
      if (squash && image_set) {
          deleteAllUserImages(image_set).then(async () => {
            await squash.remove().then(() => {
              console.log("profile deleted and google cloud image deleted");
            })
          });
        return true;
      } else {
        return false;
      }
    },
    softDeleteUser: async (root, {_id}) => {
        const doc = await Squash.findOneAndUpdate(
          { _id: _id },
          { $set: { deleted: {isDeleted: true, deletedAt: new Date()}} },
          { new: true }
        );
        console.log("user soft deleted");
        return "Done"
      }
  },
};
