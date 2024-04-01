//import Squash from '../models/Squash';
//import Message from '../models/Messages';
//import { GraphQLUpload } from 'graphql-upload'
//import { ObjectId} from 'mongodb'
//import { sanitizeFile } from '../utils/fileNaming'
//import { acsport1 } from '../index'
//import * as path from 'path';
//import _ from 'lodash'
//import {Data, DisplayData} from '../types/Squash'
//import {
  //deleteAllUserImages,
  //creatGCUpload,
  //deleteFilesFromGC,
  //deleteFromGC,
//} from "../utils/googleUpload";
//import {
  //SWIPIES_PER_DAY_LIMIT,
  //LIKES_PER_DAY_LIMIT,
  //SPORT_CHANGES_PER_DAY,
  //dest_gcs_images,
  //POST_CHANNEL
//} from "../constants/";
//import { pubsub } from '../pubsub'

//export const resolvers = {
  //Query: {
    //messages: async (parents, {currentUserID, matchedUserID, offset, limit}, context, info) => {
      ////TODO: index the sorting id thing! high latency
      //const messages = await Message.find({
        //$or: [{sender: currentUserID, receiver: matchedUserID},{sender: matchedUserID, receiver: currentUserID}]
      //}).sort({"_id": -1}).skip(offset).limit(limit)
      //// sort based on objectId
      //console.log(messages)
      //return messages
    //},
  //},
  //Subscription: {
    //messagePosted: {
      ////subscribe: (parents, args, {pubsub}, info) => pubsub.asyncIterator(POST_CHANNEL)
      //subscribe: () => pubsub.asyncIterator([POST_CHANNEL])
    //},
  //},
  //Mutation: {
    //postMessage2: async (parents, {sender, receiver, text}, context, info) => {
      //const id = text.length
      //const messageID = new ObjectId()
      //const createdAt = new Date()
      //pubsub.publish(POST_CHANNEL, {
        //messagePosted: { _id: messageID, sender: sender, receiver: receiver, text: text, createdAt: createdAt}
      //})
      //const doc = await Message.create(
          //{ _id: messageID, sender: sender, receiver: receiver, text: text, createdAt: createdAt}
      //)
       //return id
    //},
    //deleteChatUser: async (root, {_idUser, _idChatUser, UserObj, ChatUserObj}) => {
          ////const filter = {'_id': [_idUser, _idChatUser]},
      //// remove _ids from matches, likedByUSers, likes
          ////{ $pull: { matches: {}, likes: {}, likedByUSers: {}} },
      //if (!_.isEqual(_idUser,_idChatUser)){
        //const filter = [_idUser, _idChatUser]
        //const Users = await Squash.find(
          //{'_id': [_idUser, _idChatUser]},
        //);
          ////var UserMatchObj = null
          ////var ChatUserObj = null
          //var matchObj = {}
          //_.map(Users, userObj => {
          //console.log(userObj._id)
          //console.log(_idUser)
          //if (_.isEqual(userObj._id, _idUser)){
            //const potentialDisLike  = {
              //'_id': userObj._id,
              //'first_name': userObj.first_name,
              //'age': userObj.age,
              //'gender': userObj.gender,
              //'sports': userObj.sports,
              //'image_set': userObj.image_set,
              ////TODO: some weird issue with description type
              //'description': userObj.description.toString(),
            //}
            //matchObj[_idUser] = _.concat(userObj.dislikes, potentialDisLike)
          //}
          //if (_.isEqual(userObj._id, _idChatUser)){
            //const potentialDisLike  = {
              //'_id': userObj._id,
              //'first_name': userObj.first_name,
              //'age': userObj.age,
              //'gender': userObj.gender,
              //'sports': userObj.sports,
              //'image_set': userObj.image_set,
              ////TODO: some weird issue with description type
              //'description': userObj.description.toString(),
            //}
            //matchObj[_idChatUser] = _.concat(userObj.dislikes, potentialDisLike)
          //}
        //})
        //const doc = await Squash.findOneAndUpdate(
          //{'_id': _idUser},
          //{
            //$pull:
           //{
             //"matches": {"_id": _idChatUser} ,
             //"likes": {"_id": _idChatUser},
             //"likedByUSers": _idChatUser,
          //},
          //$set: { dislikes: matchObj[_idChatUser]}
          //},
          //{ new: true }
        //);
        //const doc2 = await Squash.findOneAndUpdate(
          //{'_id': _idChatUser},
          //{
            //$pull:
           //{
             //"matches": {"_id": _idUser} ,
             //"likes": {"_id": _idUser},
             //"likedByUSers": _idUser,
          //},
          //$set: { dislikes: matchObj[_idUser]}
          //},
          //{ new: true }
        //);
        //// Finally delete all chat history
        //try {
          //const allMessages = await Message.deleteMany({
            //$or: [
              //{
                //$and: [
                  //{
                    //receiver: _idUser,
                  //},
                  //{
                    //sender: _idChatUser,
                  //},
                //],
              //},
              //{
                //$and: [
                  //{
                    //receiver: _idChatUser,
                  //},
                  //{
                    //sender: _idUser,
                  //},
                //],
              //},
            //],
          //});
        //}
        //catch (e) {
          //console.log(e)
        //}
        ////TODO: you can later test the doc output for total number of modifications should be 6 , 3 from each document
        ////once done removing (don;t show user the matched user again) =>  add to dislike user set
        //console.log("test docs in delete", doc)
      //}
        //return "done"
    //},
  //}
//}
