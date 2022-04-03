import Squash from '../models/Squash';
import * as path from 'path';
import _ from 'lodash'
export const resolvers = {
  Query: {
    checkPhoneInput: async (parents,{phoneNumber}, context, info) => {
      const filter = {phoneNumber: phoneNumber}
      const user = await Squash.findOne(filter)
      console.log("pphone", user)
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
