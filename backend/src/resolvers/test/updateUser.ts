import User from '../../models/User';
import sanitize from 'mongo-sanitize'
import _ from 'lodash'
import { SHA256 } from 'crypto-js';

export const resolvers = {
  Mutation: {
    updatePlayerPreferencesTest: async (root, unSanitizedData, context) => {
      const { _id } = sanitize(unSanitizedData); // Sanitize only _id as preferences will be fetched from the doc
      const userDoc = await User.findOne({ _id: _id }).exec();
      if (userDoc !== null) {
        // Assuming preferences are already part of the userDoc
        const preferences = userDoc.preferences;

        // If you need to update preferences with new values from unSanitizedData, merge them here before hashing
        // Example: userDoc.preferences = { ...userDoc.preferences, ...newPreferences };
        // Then, stringify and hash

        const preferencesString = JSON.stringify(preferences);
        const preferencesHash = SHA256(preferencesString).toString();
        // Update the user document with the new preferencesHash
        const updatedDoc = await User.updateOne(
          { _id: _id },
          {
            $set: {
              preferencesHash: preferencesHash,
              // If you updated preferences above, make sure to also set them here
              // preferences: userDoc.preferences,
            },
          },
          { new: true }
        );
        return updatedDoc;
      } else {
        throw new Error("User not found");
      }
    },
  },
};
