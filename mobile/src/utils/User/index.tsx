import * as Yup from 'yup'
import {generateRNFile} from '../Upload'
import auth from '@react-native-firebase/auth'

const registerOnFirebase = async (phoneNumber) => {
const authorize = new Promise(async (resolve, reject) => {
    await auth()
      .signInWithPhoneNumber(phoneNumber)
      .then((confirmation: any) => {
        resolve(confirmation);
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      });
})
return authorize
  }
 const convertImagesToFormat = (images, _id) => {
    const RNFiles = images.map(imageObj =>{
       const RNFile = generateRNFile(imageObj.imageURL, _id)
       return {file: RNFile, img_idx: imageObj.img_idx}
    }
    )
    return RNFiles
  }
 const registerOnMongoDb = async (values, _id, createSquash2) => {
  console.log("values in mongo", values)
  const rnfiles = convertImagesToFormat(values.image_set, _id)
  console.log("rnfilel in mongo", rnfiles)
    await createSquash2({
      variables: {
        _id: _id,
        image_set: rnfiles,
        first_name: values.first_name,
        last_name: values.last_name,
        age: Number(values.age),
        gender: values.gender,
        sports: values.sports,
        description: values.description,
        location: values.location
      },
    });
  };

 const deleteChatUser = async (values, _id, createSquash2) => {
    await createSquash2({
      variables: {
        _id: _id,
        image_set: rnfiles,
        first_name: values.first_name,
        last_name: values.last_name,
        age: Number(values.age),
        gender: values.gender,
        sports: values.sports,
        description: values.description,
        location: values.location
      },
    });
  };

export {registerOnFirebase, convertImagesToFormat, registerOnMongoDb}
//const createUser  = async ({
  //values,
  //createSquash
//})  => {

  //const {phoneNumber, email, first_name, last_name, age, gender, sports, images, confirmationCode} = values
  //registerOnFirebase(phoneNumber, email, confirmationCode)

  ////const [createSquash, {client, data}] = useMutation(ADD_PROFILE, {
    ////ignoreResults: false,
    ////onCompleted: (data) => {
      //////const squashItems = squashItemsVar()
      //////isProfileCompleteVar(true);
      //////squashItemsVar([...squashItems, data.createSquash._id])
      //////console.log(squashItemsVar());
    ////},
  ////});

//};


