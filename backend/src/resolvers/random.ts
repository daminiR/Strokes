import Squash from '../models/Squash';
import * as path from 'path';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
export const resolvers = {
  Query: {
    checkPhoneInput: async (parents, unSanitizedData, context, info) => {
      const { phoneNumber} = sanitize(unSanitizedData)
      const filter = {phoneNumber: phoneNumber}
      const user = await Squash.findOne(filter)
      if(user){
        return {isPhoneExist: true, isDeleted: user.deleted? user.deleted.isDeleted : false}
      }
      else {
        return {isPhoneExist: false, isDeleted: false}
      }
    },
  },
  //Mutations: {},
};
