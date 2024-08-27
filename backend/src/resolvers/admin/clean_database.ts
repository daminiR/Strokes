import User from '../../models/User';
import _ from 'lodash'
import {
  unhideSendbirdChannel,
} from "./../../utils/sendBirdv2";
export const resolvers = {
  Mutation: {
    cleanCollection: async (root, _id, context) => {
      const filter = {"matches": {$exists: true}}
      const options = {
        $set: {
          "matches.$[].archived": false,
          "matches.$[].createdAt": new Date(),
        },
      };
      User.updateMany(
        filter,
        options,
        {timestamps: true}
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
