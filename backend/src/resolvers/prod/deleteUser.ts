import User from '../../models/User';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
export const resolvers = {
  Mutation: {
    softDeletePlayer: async (root, unSanitizedId, context) => {
      const _id = sanitize(unSanitizedId);
      const doc = await User.findOneAndUpdate(
        { _id: _id },
        { $set: { deleted: { isDeleted: true, deletedAt: new Date() } } },
        { new: true }
      );
      console.log("user soft deleted", doc);
      return "Done";
    },
    softUnDeletePlayer: async (root, unSanitizedId, context) => {
      const _id = sanitize(unSanitizedId);
      const doc = await User.findOneAndUpdate(
        { _id: _id },
        { $set: { "deleted.isDeleted" : false } },
        { new: true }
      );
      console.log("user soft \"un\" deleted", doc);
      return "Done";
    },
  },
};
