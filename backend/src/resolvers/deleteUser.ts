import Squash from '../models/Squash';
import _ from 'lodash'
//import {
  //deleteAllUserImages,
//} from "../utils/googleUpload";
import sanitize from 'mongo-sanitize'
export const resolvers = {
  Mutation: {
    deleteSquash: async (root, unSanitizedData) => {
      const { _id, image_set } = sanitize(unSanitizedData);
      const squash = await Squash.findById(_id);
      //if (squash && image_set) {
        //deleteAllUserImages(image_set).then(async () => {
          //await squash.remove().then(() => {
            //console.log("profile deleted and google cloud image deleted");
          //});
        //});
        //return true;
      //} else {
        //return false;
      //}
    },
    softDeleteUser: async (root, { unSanitizedId }) => {
      const _id = sanitize(unSanitizedId)
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
