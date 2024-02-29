import {generateRNFile} from '../Upload'
import _ from 'lodash'
 const convertImagesToFormat = (images, _id) => {
    const RNFiles = images.map(imageObj =>{
       const RNFile = generateRNFile(imageObj.imageURL, _id)
       return {file: RNFile, img_idx: imageObj.img_idx}
    }
    )
    return RNFiles
  }
const registerOnMongoDb = async (values, _id, createSquash2, token, client) => {
  const rnfiles = convertImagesToFormat(values.image_set, _id)
    await createSquash2({
      variables: {
        phoneNumber: values.phoneNumber,
        email: values.email,
        _id: _id,
        image_set: rnfiles,
        first_name: values.first_name,
        last_name: values.last_name,
        age: Number(values.age),
        gender: values.gender,
        sports: values.sports,
        description: values.description,
        location: values.location,
        newUserToken: token
      },
      //client: client
    });
  };

export {convertImagesToFormat, registerOnMongoDb}
