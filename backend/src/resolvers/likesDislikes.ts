import Squash from '../models/Squash';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'

export const resolvers = {
  Query: {
    getSwipesPerDay: async (parents, unSanitizedId, context, info) => {
      const _id = sanitize(unSanitizedId)
      const user = await Squash.findById(_id);
      return user ? user.swipesPerDay : 0;
    }
  },
    Mutation: {
      updateLikes: async (
        parents,
        unSanitizedData,
        context,
        info
      ) => {
        const { _id, likes, currentUserData, isFromLikes } = sanitize(unSanitizedData)
        // the one who swiped get one less swipe so for _id, decease swipe
        // only upser documents if likes/dislikes are more than 0
        console.log("what is isFromLikes", isFromLikes);
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
            location: doc?.location,
          };
          const update = { $addToSet: { likedByUSers: likedByUser } };
          await Squash.updateMany(filter, update);
          return doc;
        } else {
          const doc = await Squash.findOneAndUpdate(
            {
              $and: [
                { _id: _id },
                { $gt: { swipesPerDay: 0, visableLikePerDay: 0 } },
              ],
            },
            {
              $addToSet: { likes: { $each: likes } },
              $inc: { swipesPerDay: -1, visableLikePerDay: -1 },
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
            location: doc?.location,
          };
          const update = { $addToSet: { likedByUSers: likedByUser } };
          await Squash.updateMany(filter, update);
          return doc;
        }
      },
      updateDislikes: async (
        parents,
        unSanitizedData,
        context,
        info
      ) => {
        const { _id, dislikes, isFromLikes } = sanitize(unSanitizedData)
        // todo: create dilikedby users list, users that didnt like you so you done need to show these
        if (!isFromLikes) {
          const doc = await Squash.findOneAndUpdate(
            { $and: [{ _id: _id }, { $gt: { swipesPerDay: 0 } }] },
            {
              $addToSet: { dislikes: { $each: dislikes } },
              $inc: { swipesPerDay: -1 },
            },
            { new: true }
          );
          console.log("Updated user dislikes ", dislikes);
          console.log("doc", doc);
          return doc;
        } else {
          const doc = await Squash.findOneAndUpdate(
            {
              $and: [
                { _id: _id },
                { $gt: { swipesPerDay: 0, visableLikePerDay: 0 } },
              ],
            },
            {
              $addToSet: { dislikes: { $each: dislikes } },
              $inc: { swipesPerDay: -1, visableLikePerDay: -1 },
            },
            { new: true }
          );
          console.log("Updated user dislikes ", dislikes);
          console.log("doc", doc);
          return doc;
        }
      },
  },
};
