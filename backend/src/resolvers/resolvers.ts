import Squash from '../models/Squash';
import { SquashDocument } from '../types/Squash.d'
import {Types} from 'mongoose'
export const resolvers = {
  Query: {
    squash: async (id) => {
      const squash_val = await Squash.findById(id);
      console.log("values")
      return squash_val;
    },
    squashes: async (limit) => {
      const squashes = await Squash.find({});
      console.log(squashes)
      return squashes;
    },
  },
  Mutation: {
    createSquash: async (root, args): Promise<SquashDocument> => {
      const squash = Squash.create(args);
      return squash;
    },
    deleteSquash: async (root, args) => {
      const squash = await Squash.findById({ id: args });
      if (squash) {
        await squash.remove();
        return true;
      } else {
        return false;
      }
    },
  },
};


