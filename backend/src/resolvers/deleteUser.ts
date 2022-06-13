import Squash from '../models/Squash';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
export const resolvers = {
  Mutation: {
    softDeleteUser: async (root, unSanitizedId, context) => {
      const _id = sanitize(unSanitizedId);
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $set: { deleted: { isDeleted: true, deletedAt: new Date() } } },
        { new: true }
      );
      console.log("user soft deleted", doc);
      return "Done";
    },
  },
};
