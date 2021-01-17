import Squash from '../models/Squash';
import { SquashDocument } from '../types/Squash.d'
export const resolvers = {
  Mutation: {
    createSquash: (
      root,
      args: {
        first_name: string,
        age: number,
        gender: string,
        sports: string,
        game_level: string,
        country: string,
        description: string,
        image_set: string,
      }
    ): Promise<SquashDocument> => {
      const squash = Squash.create(args);
      return squash;
    },
  },
};


