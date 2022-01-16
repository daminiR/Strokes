import React from 'react'
import _ from 'lodash'
import {ImageSetT} from '@localModels'

const createProfileImage =  (image_set: [ImageSetT]) => {
  const profileImage = _.minBy(image_set, (imagObj) => {return imagObj?.img_idx})
  return profileImage
};

export {createProfileImage}
