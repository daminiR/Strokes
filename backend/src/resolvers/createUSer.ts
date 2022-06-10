import Squash from '../models/Squash';
import { GraphQLUpload } from 'graphql-upload'
import { CognitoJwtVerifier } from "aws-jwt-verify"
import { ObjectId} from 'mongodb'
import { sanitizeFile } from '../utils/fileNaming'
import * as path from 'path';
import {validator} from '../validation'
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import {Data, DisplayData} from '../types/Squash'
import { AuthenticationError }  from 'apollo-server-express';
import {
  createAWSUpload,
} from "../utils/awsUpload";
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
} from "../constants/";
export const resolvers = {
  Mutation: {
    createSquash2: async (
      root,
      unSanitizedData,
      context,
    ) => {
      const {
        _id,
        image_set,
        first_name,
        last_name,
        gender,
        age,
        sports,
        location,
        description,
        phoneNumber,
        email,
        newUserToken,
      } = sanitize(unSanitizedData);

      // TODO: this is being done indivisually here because dynamically updateing context, idk yet!
      //const user = context.user;
      //const verifier = CognitoJwtVerifier.create({
        //userPoolId: "us-east-1_idvRudgcB", // Your user pool id here
        //tokenUse: "access",
        //clientId: "5db5ndig7d4dei9eiviv06v59f", // Your client id here
      //});
      //const user = await verifier.verify(newUserToken);
      //console.log("user is", user);
      //console.log("did we make it to the backend", user.sub, _id);
      //if (user?.sub != _id) throw new AuthenticationError("not logged in");
      console.log("did we make it to the backend after user sub");
      const data_set = await createAWSUpload(image_set, _id);
      const doc = await Squash.create({
        _id: _id,
        image_set: data_set,
        first_name: first_name,
        last_name: last_name,
        gender: gender,
        age: age,
        location: location,
        sports: sports,
        description: description,
        phoneNumber: phoneNumber,
        email: email,
        active: true,
        swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
        visableLikePerDay: LIKES_PER_DAY_LIMIT,
        sportChangesPerDay: SPORT_CHANGES_PER_DAY,
      });
      console.log(doc);
      return doc;
    },
  },
};
