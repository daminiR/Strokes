import Squash from '../models/Squash';
import { SquashDocument } from '../types/Squash.d'
export const resolvers = {
  Mutation: {
    createSquash: async (root, args): Promise<SquashDocument> => {
      const squash = Squash.create(args);
      return squash;
    },
  },
};


