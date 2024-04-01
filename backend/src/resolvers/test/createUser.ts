import Squash from '../../models/Squash';
import sanitize from 'mongo-sanitize'
import _ from 'lodash'
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
} from "../../constants/";
//import { PubSub } from 'graphql-subscriptions';
//const pubsub = new PubSub()
export const resolvers = {
  Mutation: {
    createSquashTestSamples: async (
      root,
      unSanitizedData,
      context,
    ) => {
      const {
        _id,
        image_set,
        firstName,
        lastName,
        gender,
        age,
        sports,
        neighborhood,
        description,
        phoneNumber,
        email
      } = sanitize(unSanitizedData);

      //const data_set = await createAWSUpload(image_set, _id);
      const isFound = await Squash.findOne(
        { _id:_id},
        { new: true }
      );
      if(isFound !== null) {
      const doc = await Squash.remove(
        { _id:_id},
      )
      }
      const doc = await Squash.create({
        _id: _id,
        image_set: image_set,
        firstName: firstName,
        last_name: lastName,
        gender: gender,
        age: age,
        neighborhood: neighborhood,
        sports: sports,
        description: description,
        phoneNumber: phoneNumber,
        email: email,
        matches: [],
        //likes: ["ba98a8c9-5939-4418-807b-320fdc0e0fec"],
        active: true,
        swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
        visableLikePerDay: LIKES_PER_DAY_LIMIT,
        sportChangesPerDay: SPORT_CHANGES_PER_DAY,
      });
      const profileImage = _.find(doc?.image_set, imgObj => {imgObj.img_idx == 0})
      const likedByUser = {
        firstName: doc?.firstName,
        _id: _id,
        age: doc?.age,
        gender: doc?.gender,
        sports: doc?.sports,
        description: doc?.description,
        image_set: doc?.image_set,
        neighborhood: doc?.neighborhood,
      };
      //const update = { $addToSet: { likedByUSers: likedByUser}}
      const doc1 = await Squash.findOneAndUpdate(
        { _id:"ba98a8c9-5939-4418-807b-320fdc0e0fec"},
        { $addToSet: { likedByUSers: likedByUser }},
        //{ likedByUSers: [ likedByUser ] },
        { new: true }
      );
      console.log(doc);
      console.log(doc1);
      return doc;
    },
  }
}
