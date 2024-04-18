import User from '../../models/User';
import sanitize from 'mongo-sanitize'
import _ from 'lodash'
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
} from "../../constants/";

export const resolvers = {
  Mutation: {
    updateAllSportFieldsTest: async () => {
      try {
        const result = await User.updateMany(
          {}, // An empty filter selects all documents in the collection
          {
            $set: { sport : {sportName: "Squash", gameLevel: 4} }, // Set the new sport structure for all documents
          }
        );
        console.log("Number of documents modified:", result.modifiedCount);
        return result;
      } catch (error) {
        console.error(
          "Error updating the sport field for all documents:",
          error
        );
        throw error; // or handle it as needed
      }
    },
    registerNewPlayerTest: async (root, unSanitizedData, context) => {
      const {
        _id,
        imageSet,
        firstName,
        lastName,
        gender,
        age,
        sport,
        neighborhood,
        description,
        phoneNumber,
        preferences,
        email,
      } = sanitize(unSanitizedData);

      const isFound = await User.findOne({ _id: _id }, { new: true });
      if (isFound !== null) {
        const doc = await User.remove({ _id: _id });
      }
      const doc = await User.create({
        _id: _id,
        imageSet: imageSet,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        age: age,
        neighborhood: neighborhood,
        sport: sport,
        description: description,
        phoneNumber: phoneNumber,
        preferences: preferences,
        email: email,
        matches: [],
        active: true,
        swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
        visableLikePerDay: LIKES_PER_DAY_LIMIT,
        sportChangesPerDay: SPORT_CHANGES_PER_DAY,
      });
      return doc;
    },
  },
};
