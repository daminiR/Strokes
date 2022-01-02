import * as Yup from 'yup'
import {generateRNFile} from '../Upload'
import auth from '@react-native-firebase/auth'
import _ from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

const deleteUser = async (_id, image_set, phoneNumber, setDisplayInput, deleteUserGraphQL) : Promise<void> => {
  /// remove user from firebase
  // remove google images
  // remove users from mongodb
  // remove all chats when user is send or receiver
  //console.log("in delete")
  //console.log("userID", image_set)
  console.log("in delete")
  //const image_set_new = _.map(image_set, obj => {
    //return _.omit(obj, ['__typename'])
  //})
    //await auth().currentUser.delete()
      //.then((res) => {
        //deleteUserGraphQL({variables: {_id: _id, image_set: image_set_new}})
        //AsyncStorage.clear()
        ////setDisplayInput(false)
        //deleteUserGraphQL({variables: _id})
      //})
      //.catch((err) => {
        //console.log(err.code);
      //});

  }

export {deleteUser, registerOnFirebase, convertImagesToFormat, registerOnMongoDb}
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


