import Squash from '../models/Squash';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import { AuthenticationError }  from 'apollo-server-express';
export const resolvers = {
  Mutation: {
    softDeleteUser: async (root, { unSanitizedId }, context) => {
      const _id = sanitize(unSanitizedId)
      //const user = context.user;
      //if (user?.sub != _id) throw new AuthenticationError("not logged in");

      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $set: { deleted: { isDeleted: true, deletedAt: new Date() } } },
        { new: true }
      );
      console.log("user soft deleted");
      return "Done";
    },
  },
};
