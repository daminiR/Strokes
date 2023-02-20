import Squash from '../../models/Squash';
import _ from 'lodash'
export const resolvers = {
  Mutation: {
    updateAllUserSchema: async (root, _id, context) => {
      console.log("started")
      Squash.updateMany(
        { "matches": {$exists: true}},
        {
          $set: {
            "matches.$[].archived": false,
            "matches.$[].createdAt": new Date()
          },
        },
        { timestamps: true }
      )
        .then(() => {
          console.log("done");
        })
        .catch((err) => {
          console.log(err);
        })
      return "done"
    },
  }
}
