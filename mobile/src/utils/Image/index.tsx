import _ from 'lodash'
import {ImageSetT} from '@localModels'
const compareQueryFormik = (a, b) =>
    {
      const keys = [
        'email',
        'first_name',
        'last_name',
        'age',
        'gender',
        'location',
        'sports',
        'description',
      ];
      const noChange = _.isMatch(
        // check deep equality
        a, // get properties from a
        _.pick(b, keys), // get properties from b
      );

      return (
        noChange &&
        _.isEmpty(b.add_local_images) &&
        _.isEmpty(b.remove_uploaded_images)
      );
    }


const createProfileImage =  (image_set: [ImageSetT]) => {
  const profileImage = _.minBy(image_set, (imagObj) => {return imagObj?.img_idx})
  return profileImage
};

export {createProfileImage, compareQueryFormik}
